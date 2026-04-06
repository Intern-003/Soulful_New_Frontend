import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

const initialState = {
  items: [],
  status: "idle", // idle | loading | succeeded | failed
  error: null,

  // ✅ UX improvements
  addingProductId: null,
  removingProductId: null,
};

// ================= FETCH =================
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();

      if (!auth.user) {
        return [];
      }

      const res = await axiosInstance.get('/wishlist');
      return res.data.data || [];
    } catch (error) {
      if (error.response?.status === 401) {
        return [];
      }
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch wishlist'
      );
    }
  }
);

// ================= ADD =================
export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async ({ product_id }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();

      if (!auth.user) {
        return rejectWithValue('Please login to add to wishlist');
      }

      const res = await axiosInstance.post('/wishlist', { product_id });
      return res.data.data; // ✅ return only item
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add to wishlist'
      );
    }
  }
);

// ================= REMOVE =================
export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async ({ product_id }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();

      if (!auth.user) {
        return rejectWithValue('Please login');
      }

      await axiosInstance.delete(`/wishlist/${product_id}`);
      return { product_id }; // ✅ consistent payload
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to remove'
      );
    }
  }
);

// ================= SLICE =================
const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    resetWishlistState: (state) => {
      Object.assign(state, initialState);
    }
  },
  extraReducers: (builder) => {
    builder

      // 🔄 FETCH
      .addCase(fetchWishlist.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // ➕ ADD
      .addCase(addToWishlist.pending, (state, action) => {
        state.addingProductId = action.meta.arg.product_id;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.addingProductId = null;

        // ✅ instant UI update
        state.items.push(action.payload);
      })
      .addCase(addToWishlist.rejected, (state) => {
        state.addingProductId = null;
      })

      // ❌ REMOVE
      .addCase(removeFromWishlist.pending, (state, action) => {
        state.removingProductId = action.meta.arg.product_id;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.removingProductId = null;

        state.items = state.items.filter(
          item => item.product_id !== action.payload.product_id
        );
      })
      .addCase(removeFromWishlist.rejected, (state) => {
        state.removingProductId = null;
      });
  }
});

export const { resetWishlistState } = wishlistSlice.actions;
export default wishlistSlice.reducer;