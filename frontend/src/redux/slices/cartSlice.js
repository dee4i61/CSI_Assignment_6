import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addToCart,
  removeFromCart,
  updateCartItem,
  getCartItems,
  clearCart,
} from "../../services/cartService";

// Thunks

export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (userId, thunkAPI) => {
    try {
      const response = await getCartItems(userId);
      console.log("getCartItems", response);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addItemToCart = createAsyncThunk(
  "cart/addItemToCart",
  async ({ userId, productId, quantity = 1 }, thunkAPI) => {
    try {
      const response = await addToCart(userId, productId, quantity);
      console.log("addItemToCart", response);
      thunkAPI.dispatch(fetchCartItems(userId));
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const removeItemFromCart = createAsyncThunk(
  "cart/removeItemFromCart",
  async ({ userId, productId }, thunkAPI) => {
    try {
      await removeFromCart(userId, productId);
      thunkAPI.dispatch(fetchCartItems(userId));
      return productId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateItemQuantity = createAsyncThunk(
  "cart/updateItemQuantity",
  async ({ userId, productId, quantity }, thunkAPI) => {
    try {
      const response = await updateCartItem(userId, productId, quantity);
      console.log("updateItemQuantity", response);
      thunkAPI.dispatch(fetchCartItems(userId));
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const clearCartItems = createAsyncThunk(
  "cart/clearCartItems",
  async (userId, thunkAPI) => {
    try {
      await clearCart(userId);
      return [];
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
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(addItemToCart.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(removeItemFromCart.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(updateItemQuantity.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(clearCartItems.fulfilled, (state) => {
        state.status = "succeeded";
        state.items = [];
      });
  },
});

export default cartSlice.reducer;
