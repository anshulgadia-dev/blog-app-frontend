import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import blogReducer from "./slices/blogsSlice.js";
const store = configureStore({
  reducer: {
    auth: authReducer,
    blog: blogReducer,
  },
});

export default store;
