// src/app/slices/cartSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

const getGuestToken = () => localStorage.getItem('guest_token');
const setGuestToken = (token) => {
  if (token) localStorage.setItem('guest_token', token);
};
const clearGuestToken = () => localStorage.removeItem('guest_token');

const initialState = {
  items: [],
  totals: {
    subtotal: 0,
    shipping: 0,
    discount: 0,
    total: 0
  },
  loading: false,
  error: null,
  guestToken: getGuestToken() || null,
};

// ✅ Fetch cart - Handle 400 error gracefully
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const guestToken = getGuestToken();
      const headers = {};
      
      // Only add guest token if user is not logged in AND we have a token
      if (!auth.user && guestToken) {
        headers['Guest-Token'] = guestToken;
      }

      const response = await axiosInstance.get('/cart', { headers });
      
      if (response.data.guest_token) {
        setGuestToken(response.data.guest_token);
      }
      
      return response.data.data;
    } catch (error) {
      // Handle 400 - Cart is empty or needs guest token
      if (error.response?.status === 400) {
        // Generate new guest token if needed
        if (!getGuestToken()) {
          const newToken = 'guest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
          setGuestToken(newToken);
        }
        // Return empty cart
        return { cart: { items: [] }, totals: initialState.totals };
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
    }
  }
);

// ✅ Add to cart - Handle guest token creation
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ product_id, quantity, variant_id = null }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      let guestToken = getGuestToken();
      const headers = {};
      
      // Generate guest token if doesn't exist
      if (!auth.user && !guestToken) {
        guestToken = 'guest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        setGuestToken(guestToken);
      }
      
      if (!auth.user && guestToken) {
        headers['Guest-Token'] = guestToken;
      }

      const response = await axiosInstance.post('/cart/add', 
        { product_id, quantity, variant_id },
        { headers }
      );
      
      if (response.data.guest_token) {
        setGuestToken(response.data.guest_token);
      }
      
      // Refresh cart after adding
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to cart');
    }
  }
);

// ✅ Update cart item
export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ itemId, quantity }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const guestToken = getGuestToken();
      const headers = {};
      
      if (!auth.user && guestToken) {
        headers['Guest-Token'] = guestToken;
      }

      const response = await axiosInstance.put(`/cart/${itemId}`, 
        { quantity },
        { headers }
      );
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update cart');
    }
  }
);

// ✅ Remove cart item
export const removeCartItem = createAsyncThunk(
  'cart/removeCartItem',
  async ({ itemId }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const guestToken = getGuestToken();
      const headers = {};
      
      if (!auth.user && guestToken) {
        headers['Guest-Token'] = guestToken;
      }

      const response = await axiosInstance.delete(`/cart-item/${itemId}`, { headers });
      return { itemId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove item');
    }
  }
);

// ✅ Clear cart
export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const guestToken = getGuestToken();
      const headers = {};
      
      if (!auth.user && guestToken) {
        headers['Guest-Token'] = guestToken;
      }

      await axiosInstance.delete('/cart/clear', { headers });
      return;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to clear cart');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    resetCartState: (state) => {
      state.items = [];
      state.totals = initialState.totals;
      state.error = null;
      state.loading = false;
    },
    clearGuestToken: (state) => {
      state.guestToken = null;
      clearGuestToken();
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.cart?.items || [];
        state.totals = action.payload.totals || initialState.totals;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // Don't throw error, just set empty cart
        state.items = [];
        state.totals = initialState.totals;
      })
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.guest_token) {
          state.guestToken = action.payload.guest_token;
        }
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        if (action.payload.totals) {
          state.totals = action.payload.totals;
        }
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        if (action.payload.totals) {
          state.totals = action.payload.totals;
        }
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.totals = initialState.totals;
      });
  }
});

export const { resetCartState, clearGuestToken: clearGuestTokenAction } = cartSlice.actions;
export default cartSlice.reducer;