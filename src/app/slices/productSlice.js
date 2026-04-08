import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// ================= FETCH RELATED =================
export const fetchRelatedProducts = createAsyncThunk(
  "products/fetchRelated",
  async (ids, { rejectWithValue }) => {
    try {
      if (!ids || ids.length === 0) return [];

      const res = await axiosInstance.get(
        `/products/related?ids=${ids.join(",")}`
      );

      return res.data?.data || [];
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch related"
      );
    }
  }
);

// ================= INITIAL STATE =================
const initialState = {
  related: [],
  relatedStatus: "idle", // idle | loading | succeeded | failed
  relatedError: null,
};

// ================= SLICE =================
const productSlice = createSlice({
  name: "products",
  initialState,

  reducers: {
    // 🔥 IMPORTANT (wishlist empty hone pe call karna)
    clearRelated: (state) => {
      state.related = [];
      state.relatedStatus = "idle";
      state.relatedError = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // 🔄 FETCH RELATED
      .addCase(fetchRelatedProducts.pending, (state) => {
        state.relatedStatus = "loading";
        state.relatedError = null;
      })

      .addCase(fetchRelatedProducts.fulfilled, (state, action) => {
        state.relatedStatus = "succeeded";

        // ✅ Safety (avoid duplicates if API weird ho)
        const uniqueProducts = [];
        const seenIds = new Set();

        (action.payload || []).forEach((product) => {
          if (!seenIds.has(product.id)) {
            seenIds.add(product.id);
            uniqueProducts.push(product);
          }
        });

        state.related = uniqueProducts;
      })

      .addCase(fetchRelatedProducts.rejected, (state, action) => {
        state.relatedStatus = "failed";
        state.relatedError = action.payload;
      });
  },
});

// ================= EXPORTS =================
export const { clearRelated } = productSlice.actions;

export default productSlice.reducer;