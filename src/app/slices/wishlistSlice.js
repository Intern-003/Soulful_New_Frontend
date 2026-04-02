// src/app/slices/wishlistSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

const initialState = {
  items: [],
  loading: false,
  error: null,
  status: "idle",
  isAuthenticated: false // Track if wishlist requires auth
};

// ✅ Fetch wishlist - Only for authenticated users
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      
      // Only fetch if user is authenticated
      if (!auth.user) {
        return { items: [], requiresAuth: true };
      }
      
      const response = await axiosInstance.get('/wishlist');
      return { items: response.data.data || [], requiresAuth: false };
    } catch (error) {
      // If 401, just return empty wishlist
      if (error.response?.status === 401) {
        return { items: [], requiresAuth: true };
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch wishlist');
    }
  }
);

// ✅ Add to wishlist - Requires authentication
export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async ({ product_id }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      
      if (!auth.user) {
        return rejectWithValue('Please login to add to wishlist');
      }
      
      const response = await axiosInstance.post('/wishlist', { product_id });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to wishlist');
    }
  }
);

// ✅ Remove from wishlist
export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async ({ product_id }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      
      if (!auth.user) {
        return rejectWithValue('Please login to manage wishlist');
      }
      
      await axiosInstance.delete(`/wishlist/${product_id}`);
      return { product_id };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from wishlist');
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    resetWishlistState: (state) => {
      state.items = [];
      state.error = null;
      state.loading = false;
      state.isAuthenticated = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // .addCase(fetchWishlist.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      // })
      // .addCase(fetchWishlist.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.items = action.payload.items;
      //   state.isAuthenticated = !action.payload.requiresAuth;
      // })
      // .addCase(fetchWishlist.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.payload;
      //   state.isAuthenticated = false;
      // })
      .addCase(fetchWishlist.pending, (state) => {
  state.status = "loading";
  state.error = null;
})
.addCase(fetchWishlist.fulfilled, (state, action) => {
  state.status = "succeeded";
  state.items = action.payload.items;
})
.addCase(fetchWishlist.rejected, (state, action) => {
  state.status = "failed";
  state.error = action.payload;
})
      .addCase(addToWishlist.fulfilled, (state, action) => {
        // Wishlist will be refreshed separately
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.product_id !== action.payload.product_id);
      });
  }
});

export const { resetWishlistState } = wishlistSlice.actions;
export default wishlistSlice.reducer;
