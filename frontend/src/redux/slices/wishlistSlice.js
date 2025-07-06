import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../../services/wishlistService";

// Thunks
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (userId, thunkAPI) => {
    try {
      const response = await getWishlist(userId);
      console.log("wishlist", response);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addProductToWishlist = createAsyncThunk(
  "wishlist/addProduct",
  async ({ userId, productId }, thunkAPI) => {
    try {
      const response = await addToWishlist(userId, productId);
      console.log("addProductToWishlist", response);
      thunkAPI.dispatch(fetchWishlist(userId)); // Refresh after adding
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const removeProductFromWishlist = createAsyncThunk(
  "wishlist/removeProduct",
  async ({ userId, productId }, thunkAPI) => {
    try {
      await removeFromWishlist(userId, productId);
      thunkAPI.dispatch(fetchWishlist(userId)); // Refresh after removing
      return productId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  items: [],
  status: "idle",
  error: null,
};

// Slice
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
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

      // Add
      .addCase(addProductToWishlist.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addProductToWishlist.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(addProductToWishlist.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Remove
      .addCase(removeProductFromWishlist.pending, (state) => {
        state.status = "loading";
      })
      .addCase(removeProductFromWishlist.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(removeProductFromWishlist.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default wishlistSlice.reducer;
