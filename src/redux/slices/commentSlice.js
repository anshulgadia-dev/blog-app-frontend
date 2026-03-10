import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  blogId: null,
  comments: [],
  comment: null,
  loading: false,
  error: null,
  replyingTo: null,
  editingCommentId: null,

  addCommentState: {
    loading: false,
    error: null,
  },

  addNestedCommentState: {
    loading: false,
    error: null,
  },

  deleteCommentState: {
    loading: false,
    error: null,
  },

  updateCommentState: {
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

export const addNestedComment = createAsyncThunk(
  "comment/addNested",
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

export const deleteComment = createAsyncThunk(
  "comment/delete",
  async (commentId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/comment/${commentId}`,
        { withCredentials: true },
      );
      return { ...response.data, commentId };
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

export const updateComment = createAsyncThunk(
  "comment/update",
  async ({ commentId, message }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/comment/${commentId}`,
        { message },
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

const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    addCommentRealTime: (state, action) => {
      if (state.blogId == action.payload.blogId) {
        const comment = action.payload.comment;

        if (comment.parentCommentId) {
          const parentComment = state.comments.find(
            (c) => c._id === comment.parentCommentId,
          );
          if (parentComment) {
            if (!parentComment.replies) {
              parentComment.replies = [];
            }
            if (!parentComment.replies.some((r) => r._id === comment._id)) {
              parentComment.replies.push(comment);
            }
          }
        } else {
          state.comments.unshift(comment);
        }
      }
    },
    addNestedCommentRealTime: (state, action) => {
      if (state.blogId == action.payload.blogId) {
        const comment = action.payload.comment;
        const parentComment = state.comments.find(
          (c) => c._id === comment.parentCommentId,
        );
        if (parentComment) {
          if (!parentComment.replies) {
            parentComment.replies = [];
          }
          if (!parentComment.replies.some((r) => r._id === comment._id)) {
            parentComment.replies.push(comment);
          }
        }
      }
    },
    setReplyingTo: (state, action) => {
      state.replyingTo = action.payload;
    },
    setEditingComment: (state, action) => {
      state.editingCommentId = action.payload;
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
      })
      .addCase(addComment.rejected, (state, action) => {
        state.addCommentState.loading = false;
        state.addCommentState.error = action?.payload?.message;
      })

      .addCase(addNestedComment.pending, (state) => {
        state.addNestedCommentState.loading = true;
        state.addNestedCommentState.error = null;
      })
      .addCase(addNestedComment.fulfilled, (state) => {
        state.addNestedCommentState.loading = false;
        state.addNestedCommentState.error = false;
        state.replyingTo = null;
      })
      .addCase(addNestedComment.rejected, (state, action) => {
        state.addNestedCommentState.loading = false;
        state.addNestedCommentState.error = action?.payload?.message;
      })

      .addCase(deleteComment.pending, (state) => {
        state.deleteCommentState.loading = true;
        state.deleteCommentState.error = null;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.deleteCommentState.loading = false;
        state.deleteCommentState.error = null;

        const commentId = action.payload.commentId;
        state.comments = state.comments.filter((c) => c._id !== commentId);
        state.comments.forEach((comment) => {
          if (comment.replies) {
            comment.replies = comment.replies.filter(
              (r) => r._id !== commentId,
            );
          }
        });
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.deleteCommentState.loading = false;
        state.deleteCommentState.error = action?.payload?.message;
      })

      .addCase(updateComment.pending, (state) => {
        state.updateCommentState.loading = true;
        state.updateCommentState.error = null;
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        state.updateCommentState.loading = false;
        state.updateCommentState.error = null;
        state.editingCommentId = null;

        const updatedComment = action.payload.comment;

        // Update in top-level comments
        const parentIndex = state.comments.findIndex(
          (c) => c._id === updatedComment._id,
        );
        if (parentIndex >= 0) {
          state.comments[parentIndex].message = updatedComment.message;
        }

        // Update in nested comments (replies)
        state.comments.forEach((comment) => {
          if (comment.replies) {
            const replyIndex = comment.replies.findIndex(
              (r) => r._id === updatedComment._id,
            );
            if (replyIndex >= 0) {
              comment.replies[replyIndex].message = updatedComment.message;
            }
          }
        });
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.updateCommentState.loading = false;
        state.updateCommentState.error = action?.payload?.message;
      });
  },
});
export const {
  addCommentRealTime,
  addNestedCommentRealTime,
  setReplyingTo,
  setEditingComment,
} = commentSlice.actions;
export default commentSlice.reducer;
