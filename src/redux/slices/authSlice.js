import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const tokenFromStorage = localStorage.getItem("token")
  ? localStorage.getItem("token")
  : null;

const userFromStorage = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

const initialState = {
  user: userFromStorage,
  token: tokenFromStorage,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/login`,
        userData,
      );
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/register`,
        userData,
      );
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const logoutUser = createAsyncThunk(
  "/auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/logout`,
        {},
        { withCredentials: true },
      );
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return response.data;
    } catch (error) {
      console.log("Error in logout user ", error);
      return rejectWithValue(error.response.data);
    }
  },
);

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Login Failed";
      })

      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      .addCase(logoutUser.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.token = null;
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.loading = false;
        state.token = null;
        state.user = null;
      });
  },
});

// export const { } = authSlice.actions;
export default authSlice.reducer;
