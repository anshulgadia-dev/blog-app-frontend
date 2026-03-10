import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { imageURLResolver } from "../config/imageUrlResolver";
import { useSelector, useDispatch } from "react-redux";
import {
  addComment,
  addCommentRealTime,
  getComments,
  addNestedComment,
  addNestedCommentRealTime,
  setReplyingTo,
  deleteComment,
  updateComment,
  setEditingComment,
} from "../redux/slices/commentSlice";
import { toast } from "react-toastify";
import socket from "../socket";

export const BlogDetail = () => {
  const navigate = useNavigate();
  const blogId = useParams().id;
  const [blog, setBlog] = useState(null);
  const [message, setMessage] = useState("");
  const [nestedCommentMessage, setNestedCommentMessage] = useState("");
  const [editingMessage, setEditingMessage] = useState("");
  const dispatch = useDispatch();
  const {
    comments,
    loading,
    addCommentState,
    replyingTo,
    addNestedCommentState,
    deleteCommentState,
    editingCommentId,
    updateCommentState,
  } = useSelector((state) => state.comment);
  const { user } = useSelector((state) => state.auth);

  const getBlog = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/${blogId}`,
      );

      const blogData = res.data.blog || res.data.result;
      blogData.image = imageURLResolver(blogData.image);

      setBlog(blogData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (message.trim() === "") return;

    dispatch(addComment({ blogId, commentData: { message: message } }))
      .unwrap()
      .then(() => {
        console.log("Comment Added");
        toast.success("Commented");
      })
      .catch((err) => {
        if (err.status === 401) {
          toast.error("Login First");
          navigate("/login");
        }
      });

    console.log(message);

    setMessage("");
  };

  const handleReplySubmit = (parentCommentId) => {
    if (nestedCommentMessage.trim() === "") return;

    dispatch(
      addNestedComment({
        blogId,
        commentData: {
          message: nestedCommentMessage,
          parentCommentId: parentCommentId,
        },
      }),
    )
      .unwrap()
      .then(() => {
        console.log("Reply Added");
        toast.success("Reply Added");
        setNestedCommentMessage("");
      })
      .catch((err) => {
        if (err.status === 401) {
          toast.error("Login First");
          navigate("/login");
        } else {
          toast.error(err.message || "Failed to add reply");
        }
      });
  };

  const handleDeleteComment = (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    dispatch(deleteComment(commentId))
      .unwrap()
      .then(() => {
        toast.success("Comment Deleted");
      })
      .catch((err) => {
        toast.error(err.message || "Failed to delete comment");
      });
  };

  const handleUpdateComment = (commentId, currentMessage) => {
    dispatch(setEditingComment(commentId));
    setEditingMessage(currentMessage);
  };

  const handleUpdateSubmit = (commentId) => {
    if (editingMessage.trim() === "") {
      toast.error("Comment cannot be empty");
      return;
    }

    dispatch(updateComment({ commentId, message: editingMessage }))
      .unwrap()
      .then(() => {
        toast.success("Comment Updated");
        setEditingMessage("");
      })
      .catch((err) => {
        if (err.status === 401) {
          toast.error("Login First");
          navigate("/login");
        } else {
          toast.error(err.message || "Failed to update comment");
        }
      });
  };

  useEffect(() => {
    const handleNewComment = (data) => {
      console.log(data);
      dispatch(addCommentRealTime(data));
    };

    const handleNewReply = (data) => {
      console.log("New Reply:", data);
      dispatch(addNestedCommentRealTime(data));
    };

    socket.on("new-comment", handleNewComment);
    socket.on("new-reply", handleNewReply);

    return () => {
      socket.off("new-comment", handleNewComment);
      socket.off("new-reply", handleNewReply);
    };
  }, [dispatch]);

  useEffect(() => {
    getBlog();
    dispatch(getComments(blogId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blogId]);

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-gray-50 to-gray-200">
        <h2 className="text-xl font-semibold text-gray-600">Loading blog...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-200 py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-md rounded-xl overflow-hidden">
          {/* Blog Image */}
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-80 object-cover"
          />

          <div className="p-8">
            {/* Category */}
            <span className="text-sm font-medium text-blue-600 uppercase tracking-wide">
              {blog.category}
            </span>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-800 mt-2 mb-6">
              {blog.title}
            </h1>

            {/* Content */}
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {blog.content}
            </p>

            {/* Likes */}
            <div className="mt-10 border-t pt-6 flex items-center justify-between">
              <h3 className="text-gray-700 font-semibold">
                👍 Likes: {blog.likesCount}
              </h3>
            </div>

            <div className="mt-10">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Comments
              </h2>

              <div className="mt-6">
                <form className="flex flex-col gap-3">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your comment..."
                    rows="3"
                    className="w-full resize-none rounded-lg border border-gray-300 p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />

                  <div className="flex justify-end">
                    <button
                      onClick={handleCommentSubmit}
                      type="submit"
                      className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition duration-200 cursor-pointer"
                    >
                      {addCommentState.loading ? "Posting..." : "Post Comment"}
                    </button>
                  </div>
                </form>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg text-gray-500 mt-4">
                {loading
                  ? "Loading Comments..."
                  : comments?.length === 0
                    ? "No comments yet"
                    : comments?.map((c) => (
                        <div
                          key={c._id}
                          className="bg-white border border-gray-200 rounded-lg shadow-sm mb-4 overflow-hidden"
                        >
                          {/* Parent Comment Section */}
                          <div className="p-4 border-b border-gray-200">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-800">
                                  {c.userName}
                                </p>
                                {editingCommentId === c._id ? (
                                  <textarea
                                    value={editingMessage}
                                    onChange={(e) =>
                                      setEditingMessage(e.target.value)
                                    }
                                    className="w-full mt-2 resize-none rounded-md border border-blue-300 bg-white p-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows="2"
                                  />
                                ) : (
                                  <p className="text-gray-700 text-sm mt-2">
                                    {c.message}
                                  </p>
                                )}
                              </div>

                              {user?.name === c.userName && (
                                <div className="ml-3 flex gap-2">
                                  {editingCommentId !== c._id && (
                                    <button
                                      onClick={() =>
                                        handleUpdateComment(c._id, c.message)
                                      }
                                      className="text-yellow-600 hover:text-yellow-700 cursor-pointer text-sm leading-none"
                                      title="Edit comment"
                                    >
                                      edit
                                    </button>
                                  )}
                                  <button
                                    onClick={() => handleDeleteComment(c._id)}
                                    disabled={deleteCommentState.loading}
                                    className="text-red-500 hover:text-red-700 text-sm cursor-pointer leading-none h-5"
                                    title="Delete comment"
                                  >
                                    delete
                                  </button>
                                </div>
                              )}
                            </div>

                            {editingCommentId === c._id && (
                              <div className="mb-3 flex gap-2">
                                <button
                                  onClick={() => {
                                    dispatch(setEditingComment(null));
                                    setEditingMessage("");
                                  }}
                                  className="text-xs font-medium text-gray-600 hover:text-gray-800 px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 transition"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleUpdateSubmit(c._id)}
                                  disabled={updateCommentState.loading}
                                  className="text-xs font-medium bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50 transition"
                                >
                                  {updateCommentState.loading
                                    ? "Saving..."
                                    : "Save"}
                                </button>
                              </div>
                            )}

                            {editingCommentId !== c._id && (
                              <button
                                onClick={() => dispatch(setReplyingTo(c._id))}
                                className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline"
                              >
                                {replyingTo === c._id ? "✕ Cancel" : "↳ Reply"}
                              </button>
                            )}
                          </div>

                          {replyingTo === c._id && (
                            <div className="bg-blue-50 p-4 border-b border-blue-200">
                              <textarea
                                value={nestedCommentMessage}
                                onChange={(e) =>
                                  setNestedCommentMessage(e.target.value)
                                }
                                placeholder="Write your reply..."
                                rows="2"
                                className="w-full resize-none rounded-md border border-blue-300 bg-white p-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              <div className="flex justify-end gap-2 mt-3">
                                <button
                                  onClick={() => {
                                    dispatch(setReplyingTo(null));
                                    setNestedCommentMessage("");
                                  }}
                                  className="text-xs font-medium text-gray-600 hover:text-gray-800 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleReplySubmit(c._id)}
                                  className="text-xs font-medium bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                                >
                                  {addNestedCommentState.loading
                                    ? "Posting..."
                                    : "Post Reply"}
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Nested Comments (Replies) Section */}
                          {c.replies && c.replies.length > 0 && (
                            <div className="bg-blue-50 p-4">
                              <p className="text-xs font-semibold text-blue-700 mb-3 uppercase tracking-wide">
                                {c.replies.length}{" "}
                                {c.replies.length === 1 ? "Reply" : "Replies"}
                              </p>
                              <div className="space-y-3">
                                {c.replies.map((reply) => (
                                  <div
                                    key={reply._id}
                                    className="bg-white border-l-4 border-blue-400 p-3 rounded-md hover:shadow-md transition"
                                  >
                                    <div className="flex items-start gap-2 justify-between">
                                      <div className="flex items-start gap-2 flex-1">
                                        <div className="text-blue-500 text-lg h-5 leading-none mt-0.5">
                                          ↳
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="text-xs font-semibold text-blue-700 mb-1">
                                            {reply.userName}
                                          </p>
                                          {editingCommentId === reply._id ? (
                                            <textarea
                                              value={editingMessage}
                                              onChange={(e) =>
                                                setEditingMessage(
                                                  e.target.value,
                                                )
                                              }
                                              className="w-full resize-none rounded-md border border-blue-300 bg-white p-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                              rows="2"
                                            />
                                          ) : (
                                            <p className="text-gray-700 text-sm wrap-break-word">
                                              {reply.message}
                                            </p>
                                          )}
                                        </div>
                                      </div>

                                      {user?.name === reply.userName && (
                                        <div className="ml-2 flex gap-1">
                                          {editingCommentId !== reply._id && (
                                            <button
                                              onClick={() =>
                                                handleUpdateComment(
                                                  reply._id,
                                                  reply.message,
                                                )
                                              }
                                              className="text-yellow-600 hover:text-yellow-700 text-sm leading-none cursor-pointer"
                                              title="Edit reply"
                                            >
                                              edit
                                            </button>
                                          )}
                                          <button
                                            onClick={() =>
                                              handleDeleteComment(reply._id)
                                            }
                                            disabled={
                                              deleteCommentState.loading
                                            }
                                            className="text-red-500 hover:text-red-700 cursor-pointer text-sm leading-none disabled:opacity-50 h-5"
                                            title="Delete reply"
                                          >
                                            delete
                                          </button>
                                        </div>
                                      )}
                                    </div>

                                    {editingCommentId === reply._id && (
                                      <div className="mt-2 flex gap-2">
                                        <button
                                          onClick={() => {
                                            dispatch(setEditingComment(null));
                                            setEditingMessage("");
                                          }}
                                          className="text-xs font-medium text-gray-600 hover:text-gray-800 px-2 py-1 rounded border border-gray-300 hover:bg-gray-100 transition"
                                        >
                                          Cancel
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleUpdateSubmit(reply._id)
                                          }
                                          disabled={updateCommentState.loading}
                                          className="text-xs font-medium bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 disabled:opacity-50 transition"
                                        >
                                          {updateCommentState.loading
                                            ? "Saving..."
                                            : "Save"}
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
