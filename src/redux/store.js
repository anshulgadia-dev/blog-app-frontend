import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import blogReducer from "./slices/blogsSlice.js";
import commentReducer from "./slices/commentSlice.js";
const store = configureStore({
  reducer: {
    auth: authReducer,
    blog: blogReducer,
    comment: commentReducer,
  },
});

export default store;
