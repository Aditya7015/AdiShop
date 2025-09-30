// redux/wishlistSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

// Fetch wishlist
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (token, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/users/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data?.items || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch wishlist");
    }
  }
);

// Add to wishlist
export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async ({ productId, token }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/users/wishlist`,
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // After adding, fetch the updated wishlist to get complete state
      const wishlistRes = await axios.get(`${BASE_URL}/users/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return wishlistRes.data?.items || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add to wishlist");
    }
  }
);

// Remove from wishlist
export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async ({ productId, token }, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/users/wishlist/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // After removing, fetch the updated wishlist to get complete state
      const wishlistRes = await axios.get(`${BASE_URL}/users/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return wishlistRes.data?.items || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to remove from wishlist");
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;