import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// Fetch all categories (parents + flat list)
export const fetchCategories = createAsyncThunk(
  "categories/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/categories");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch categories");
    }
  }
);

// Fetch children with cache check
export const fetchChildrenByParent = createAsyncThunk(
  "categories/fetchChildren",
  async (parentId, { getState, rejectWithValue }) => {
    const state = getState();

    // Return cached data without API call
    if (state.categories.children[parentId]) {
      return {
        parentId,
        data: state.categories.children[parentId],
        fromCache: true,
      };
    }

    try {
      const res = await axiosInstance.get(`/categories/${parentId}/children`);
      return {
        parentId,
        data: res.data.data,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch subcategories");
    }
  }
);

const categorySlice = createSlice({
  name: "categories",
  initialState: {
    all: [],
    children: {}, // { parentId: [children] }
    loading: false,
    error: null,
    fetched: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All Categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.all = action.payload || [];
         state.fetched = true;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Children
      .addCase(fetchChildrenByParent.fulfilled, (state, action) => {
        const { parentId, data } = action.payload;
        state.children[parentId] = data || [];
      });
  },
});

export default categorySlice.reducer;