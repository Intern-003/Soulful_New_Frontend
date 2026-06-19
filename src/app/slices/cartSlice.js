import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

const getGuestToken = () => localStorage.getItem('guest_token');
const setGuestToken = (token) => {
  if (token) localStorage.setItem('guest_token', token);
};
const clearGuestTokenLS = () => localStorage.removeItem('guest_token');

const initialState = {
  id: null,  // Add this line - store cart ID
  items: [],
  itemsByVendor: [],
  totals: {
    subtotal: 0,
    shipping_total: 0,
    tax_total: 0,
    coupon_discount: 0,
    platform_coupon_discount: 0,
    vendor_coupon_discount: 0,
    grand_total: 0
  },
  vendorSummaries: [],
  appliedCoupon: null,
  status: "idle",
  error: null,
  guestToken: getGuestToken() || null,
  updatingItemId: null,
  removingItemId: null,
  itemCount: 0,
};

// Helper to transform cart data from backend
const transformCartData = (cartData) => {
  const cart = cartData?.cart || { items: [] };
  const itemsByVendor = cartData?.items_by_vendor || [];
  const totals = cartData?.totals || initialState.totals;
  
  // Get cart ID
  const cartId = cart?.id || null;
  
  // Flatten items for easier access
  const flattenedItems = [];
  itemsByVendor.forEach(vendor => {
    vendor.items?.forEach(item => {
      flattenedItems.push({
        ...item,
        vendor_name: vendor.vendor_name,
        vendor_id: vendor.vendor_id
      });
    });
  });

  return {
    id: cartId,  // Add cart ID
    items: flattenedItems,
    itemsByVendor: itemsByVendor,
    totals: totals,
    vendorSummaries: itemsByVendor.map(v => ({
      vendor_id: v.vendor_id,
      vendor_name: v.vendor_name,
      subtotal: v.subtotal,
      shipping_estimate: v.shipping_estimate,
      items_count: v.items?.length || 0
    })),
    itemCount: flattenedItems.length,
    appliedCoupon: cartData?.applied_coupon || null
  };
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

// ================= ADD TO CART =================
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

// ================= UPDATE CART ITEM =================
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

// ================= REMOVE CART ITEM =================
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

// ================= CLEAR CART =================
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

// ================= APPLY COUPON =================
// ================= APPLY COUPON =================
export const applyCoupon = createAsyncThunk(
  'cart/applyCoupon',
  async ({ coupon_code }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const { guestToken, id: cartId } = getState().cart;
      
      if (!auth.user) {
        return rejectWithValue('Please login to apply coupon');
      }

      // Get cart ID from state or fetch it
      let cartIdentifier = cartId;
      
      // If we don't have cart ID in state, we need to get it
      if (!cartIdentifier) {
        const cartRes = await axiosInstance.get('/cart');
        cartIdentifier = cartRes.data?.data?.cart?.id;
      }

      const headers = {};
      if (!auth.user && guestToken) {
        headers['Guest-Token'] = guestToken;
      }

      const res = await axiosInstance.post(
        '/coupon/apply',
        { 
          code: coupon_code,  // Backend expects 'code', not 'coupon_code'
          cart_id: cartIdentifier  // Backend requires cart_id
        },
        { headers }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.response?.data?.errors || 'Failed to apply coupon'
      );
    }
  }
);

// ================= REMOVE COUPON =================
// ================= REMOVE COUPON =================
export const removeCoupon = createAsyncThunk(
  'cart/removeCoupon',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const { guestToken, id: cartId } = getState().cart;
      
      if (!auth.user) {
        return rejectWithValue('Please login');
      }

      // Get cart ID if not available
      let cartIdentifier = cartId;
      if (!cartIdentifier) {
        const cartRes = await axiosInstance.get('/cart');
        cartIdentifier = cartRes.data?.data?.cart?.id;
      }

      const headers = {};
      if (!auth.user && guestToken) {
        headers['Guest-Token'] = guestToken;
      }

      const res = await axiosInstance.post(
        '/coupon/remove',
        { cart_id: cartIdentifier },
        { headers }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to remove coupon'
      );
    }
  }
);

// Helper to apply cart data to state
const applyCartData = (state, action) => {
  const cartData = action.payload?.data || {};
  const transformed = transformCartData(cartData);
  
  state.id = transformed.id;  // Add this line
  state.items = transformed.items;
  state.itemsByVendor = transformed.itemsByVendor;
  state.totals = transformed.totals;
  state.vendorSummaries = transformed.vendorSummaries;
  state.itemCount = transformed.itemCount;
  state.appliedCoupon = transformed.appliedCoupon;

  if (action.payload?.guest_token) {
    state.guestToken = action.payload.guest_token;
    setGuestToken(action.payload.guest_token);
  }
};

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
    },
    updateLocalQuantity: (state, action) => {
      const { itemId, quantity } = action.payload;
      const item = state.items.find(i => i.id === itemId);
      if (item) {
        item.quantity = quantity;
        // Update totals locally (optional, can also refetch)
      }
    },
    removeLocalItem: (state, action) => {
      const itemId = action.payload;
      state.items = state.items.filter(i => i.id !== itemId);
      state.itemCount = state.items.length;
    }
  },
  extraReducers: (builder) => {
    builder
      // FETCH CART
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

      // ADD TO CART
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

      // UPDATE CART ITEM
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

      // REMOVE CART ITEM
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

      // CLEAR CART
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
      })

      // APPLY COUPON
      .addCase(applyCoupon.pending, (state) => {
        state.status = "loading";
      })
      .addCase(applyCoupon.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload?.data?.totals) {
          state.totals = {
            ...state.totals,
            ...action.payload.data.totals
          };
        }
        if (action.payload?.data?.discount) {
          state.appliedCoupon = action.payload.data;
        }
        // Refetch cart to get updated state
      })
      .addCase(applyCoupon.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // REMOVE COUPON
      .addCase(removeCoupon.pending, (state) => {
        state.status = "loading";
      })
      .addCase(removeCoupon.fulfilled, (state) => {
        state.status = "succeeded";
        state.appliedCoupon = null;
      })
      .addCase(removeCoupon.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  }
});

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartItemsByVendor = (state) => state.cart.itemsByVendor;
export const selectCartTotals = (state) => state.cart.totals;
export const selectCartItemCount = (state) => state.cart.itemCount;
export const selectCartLoading = (state) => state.cart.status === "loading";
export const selectCartError = (state) => state.cart.error;
export const selectUpdatingItemId = (state) => state.cart.updatingItemId;
export const selectRemovingItemId = (state) => state.cart.removingItemId;
export const selectAppliedCoupon = (state) => state.cart.appliedCoupon;
export const selectVendorSummaries = (state) => state.cart.vendorSummaries;

export const { resetCartState, clearGuestToken, updateLocalQuantity, removeLocalItem } = cartSlice.actions;
export default cartSlice.reducer;