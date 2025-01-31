import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    fetchCartStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCartSuccess: (state, action) => {
      state.loading = false;
      state.items = action.payload.items;
      state.error = null;
    },
    fetchCartFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addToCartStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    addToCartSuccess: (state, action) => {
      state.loading = false;
      state.items = action.payload.items;
      state.error = null;
    },
    addToCartFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateCartItemStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateCartItemSuccess: (state, action) => {
      state.loading = false;
      state.items = action.payload.items;
      state.error = null;
    },
    updateCartItemFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    removeFromCartStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    removeFromCartSuccess: (state, action) => {
      state.loading = false;
      state.items = action.payload.items;
      state.error = null;
    },
    removeFromCartFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearCart: (state) => {
      state.items = [];
      state.loading = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchCartStart,
  fetchCartSuccess,
  fetchCartFailure,
  addToCartStart,
  addToCartSuccess,
  addToCartFailure,
  updateCartItemStart,
  updateCartItemSuccess,
  updateCartItemFailure,
  removeFromCartStart,
  removeFromCartSuccess,
  removeFromCartFailure,
  clearCart,
  clearError,
} = cartSlice.actions;

export default cartSlice.reducer;
