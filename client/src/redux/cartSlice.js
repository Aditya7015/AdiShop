// redux/cartSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Base URL from .env
const BASE_URL = import.meta.env.VITE_API_URL;

// ======================= THUNKS ======================= //

// Fetch cart
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/cart/${userId}`);
      return res.data?.products || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch cart");
    }
  }
);

// Add product to cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/cart/${userId}`, {
        productId,
        quantity,
      });
      return res.data; // backend returns cart.products array
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add product");
    }
  }
);

// Remove product from cart
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`${BASE_URL}/cart/${userId}/${productId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to remove product");
    }
  }
);

// ======================= SLICE ======================= //

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCartState: (state) => {
      state.items = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchCart cases
      .addCase(fetchCart.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchCart.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchCart.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // addToCart cases
      .addCase(addToCart.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(addToCart.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(addToCart.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // removeFromCart cases
      .addCase(removeFromCart.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(removeFromCart.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(removeFromCart.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { clearCartState } = cartSlice.actions; // export action
export default cartSlice.reducer;
