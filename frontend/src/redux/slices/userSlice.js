import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginUser,
  logoutUser,
  getUserDetails,
} from "../../services/userServices";

// Async Thunks
export const login = createAsyncThunk(
  "user/login",
  async (userData, thunkAPI) => {
    try {
      const response = await loginUser(userData);
      return response.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Login failed");
    }
  }
);

export const logout = createAsyncThunk("user/logout", async (_, thunkAPI) => {
  try {
    await logoutUser();
    return null;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || "Logout failed");
  }
});

export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (_, thunkAPI) => {
    try {
      const response = await getUserDetails();
      return response.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "Failed to fetch user");
    }
  }
);

// Initial State
const initialState = {
  user: null,
  loading: false,
  error: null,
};

// Slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;

        // ✅ Save user to localStorage
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Logout
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;

        // ✅ Remove user from localStorage
        localStorage.removeItem("user");
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch user on app load
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.loading = false;
        state.user = null; // Token might be expired, clear user
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;
