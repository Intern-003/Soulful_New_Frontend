import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

const getGuestToken = () => localStorage.getItem('guest_token');
const setGuestToken = (token) => {
  if (token) localStorage.setItem('guest_token', token);
};
const clearGuestTokenLS = () => localStorage.removeItem('guest_token');

const initialState = {
  items: [],
  totals: {
    subtotal: 0,
    shipping: 0,
    discount: 0,
    total: 0
  },
  status: "idle", // idle | loading | succeeded | failed
  error: null,
  guestToken: getGuestToken() || null,
  // ✅ NEW
  updatingItemId: null,
  removingItemId: null,
};


// 🔁 COMMON RESPONSE HANDLER
const applyCartData = (state, action) => {
  const cart = action.payload?.data?.cart;
  const totals = action.payload?.data?.totals;

  // ✅ Force new reference (VERY IMPORTANT)
  state.items = [...(cart?.items || [])];
  state.totals = { ...(totals || initialState.totals) };

  if (action.payload?.guest_token) {
    state.guestToken = action.payload.guest_token;
    setGuestToken(action.payload.guest_token);
  }
};


// ================= FETCH CART =================
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();


      const headers = {};
      const guestToken = getGuestToken();

      if (!auth.user && guestToken) {
        headers['Guest-Token'] = guestToken;
      }

      const res = await axiosInstance.get('/cart', { headers });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch cart'
      );
    }
  }
);


// ================= ADD =================
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ product_id, quantity, variant_id = null }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      let guestToken = getGuestToken();

      const headers = {};

      if (!auth.user && !guestToken) {
        guestToken = 'guest_' + Date.now();
        setGuestToken(guestToken);
      }

      if (!auth.user && guestToken) {
        headers['Guest-Token'] = guestToken;
      }

      const res = await axiosInstance.post(
        '/cart/add',
        { product_id, quantity, variant_id },
        { headers }
      );

      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add to cart'
      );
    }
  }
);


// ================= UPDATE =================
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

      const res = await axiosInstance.put(
        `/cart/${itemId}`,
        { quantity },
        { headers }
      );

      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update cart'
      );
    }
  }
);


// ================= REMOVE =================
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

      const res = await axiosInstance.delete(
        `/cart-item/${itemId}`,
        { headers }
      );

      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to remove item'
      );
    }
  }
);


// ================= CLEAR =================
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

      const res = await axiosInstance.delete('/cart/clear', { headers });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to clear cart'
      );
    }
  }
);


// ================= SLICE =================
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    resetCartState: (state) => {
      Object.assign(state, initialState);
    },
    clearGuestToken: (state) => {
      state.guestToken = null;
      clearGuestTokenLS();
    }
  },
  extraReducers: (builder) => {
    builder

      // 🔄 FETCH
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        applyCartData(state, action);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // ➕ ADD
      .addCase(addToCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        applyCartData(state, action);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // 🔄 UPDATE
      .addCase(updateCartItem.pending, (state, action) => {
        state.status = "loading";
        state.updatingItemId = action.meta.arg.itemId;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.updatingItemId = null;
        applyCartData(state, action);
      })
      .addCase(updateCartItem.rejected, (state) => {
        state.status = "failed";
        state.updatingItemId = null;
      })
      // ❌ REMOVE
      .addCase(removeCartItem.pending, (state, action) => {
        state.status = "loading";
        state.removingItemId = action.meta.arg.itemId;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.removingItemId = null;
        applyCartData(state, action);
      })
      .addCase(removeCartItem.rejected, (state) => {
        state.status = "failed";
        state.removingItemId = null;
      })
      // 🧹 CLEAR
      .addCase(clearCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        applyCartData(state, action);
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  }
});

export const { resetCartState, clearGuestToken } = cartSlice.actions;
export default cartSlice.reducer;