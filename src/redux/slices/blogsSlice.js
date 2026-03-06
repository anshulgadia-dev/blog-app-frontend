import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  blogs: [],
  blog: null,
  loading: false,
  error: null,
};

export const fetchAllBlogs = createAsyncThunk(
  "blog/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/blog`,
      );
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  },
);

export const fetchBlogById = createAsyncThunk(
  "blog/fetchBlogById",
  async (blogId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/${blogId}`,
      );
      return response?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  },
);

export const addBlog = createAsyncThunk(
  "blog/addblog",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/blog`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        },
      );

      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        return rejectWithValue({
          message: "Please login first",
          status: 401,
        });
      }
      return rejectWithValue(error.response?.data);
    }
  },
);

export const toggleLike = createAsyncThunk(
  "blog/toggleLike",
  async (blogId, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/like/${blogId}`,
        {},
        { withCredentials: true },
      );
      return response?.data;
    } catch (error) {
      if (error?.response?.status === 401) {
        return rejectWithValue({
          status: 401,
          message: "Please Login First",
        });
      }
      return rejectWithValue(error?.response?.data);
    }
  },
);

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    likeRealTime: (state, action) => {
      state.blogs = state.blogs.map((b) => {
        if (b._id === action.payload.blogId) {
          return {
            ...b,
            likesCount: action.payload.likesCount,
          };
        }
        return b;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload.blogs;
      })
      .addCase(fetchAllBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      .addCase(addBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.blogs.unshift(action.payload.blog);
      })
      .addCase(addBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      .addCase(toggleLike.pending, (state) => {
        state.error = null;
      })
      .addCase(toggleLike.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(toggleLike.rejected, (state, action) => {
        state.error = action.payload.message;
      });
  },
});

export const { likeRealTime } = blogSlice.actions;
export default blogSlice.reducer;
