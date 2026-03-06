import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  blogId: null,
  comments: [],
  comment: null,
  loading: false,
  error: null,

  addCommentState: {
    loading: false,
    error: null,
  },

  deleteCommentState: {
    loading: false,
    error: null,
  },
};

export const addComment = createAsyncThunk(
  "comment/add",
  async ({ blogId, commentData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/comment/${blogId}`,
        commentData,
        { withCredentials: true },
      );
      return response.data;
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

export const getComments = createAsyncThunk(
  "comment/get",
  async (blogId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/comment/${blogId}`,
        { withCredentials: true },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  },
);

const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    addCommentRealTime: (state, action) => {
      if (state.blogId == action.payload.blogId) {
        state.comments.unshift(action.payload.comment);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action?.payload?.comments;
        state.blogId = action?.payload?.blogId;
        state.error = null;
      })
      .addCase(getComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload?.message;
      })

      .addCase(addComment.pending, (state) => {
        state.addCommentState.loading = true;
        state.addCommentState.error = null;
      })
      .addCase(addComment.fulfilled, (state) => {
        state.addCommentState.loading = false;
        state.addCommentState.error = false;
        // state.comments.unshift(action?.payload?.comment);
      })
      .addCase(addComment.rejected, (state, action) => {
        state.addCommentState.loading = false;
        state.addCommentState.error = action?.payload?.message;
      });
  },
});

export const { addCommentRealTime } = commentSlice.actions;
export default commentSlice.reducer;
