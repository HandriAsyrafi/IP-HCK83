import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for login only
export const loginUser = createAsyncThunk(
  "login/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("https://gc.handriasyrafi.site/login", {
        email,
        password,
      });

      const access_token = data.token;
      localStorage.setItem("access_token", access_token);

      return {
        token: access_token,
        success: true,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "You are not authorized"
      );
    }
  }
);

const loginSlice = createSlice({
  name: "login",
  initialState: {
    isLoading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearLoginError: (state) => {
      state.error = null;
    },
    clearLoginSuccess: (state) => {
      state.success = false;
    },
    resetLoginState: (state) => {
      state.isLoading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        state.success = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { clearLoginError, clearLoginSuccess, resetLoginState } =
  loginSlice.actions;
export default loginSlice.reducer;
