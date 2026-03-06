import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate, data } from "react-router-dom";
import { imageURLResolver } from "../config/imageUrlResolver";
import { useSelector, useDispatch } from "react-redux";
import {
  addComment,
  addCommentRealTime,
  getComments,
} from "../redux/slices/commentSlice";
import { toast } from "react-toastify";
import socket from "../socket";

export const BlogDetail = () => {
  const navigate = useNavigate();
  const blogId = useParams().id;
  const [blog, setBlog] = useState(null);
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const { comments, loading, addCommentState } = useSelector(
    (state) => state.comment,
  );

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

  useEffect(() => {
    const handleNewComment = (data) => {
      console.log(data);
      dispatch(addCommentRealTime(data));
    };

    socket.on("new-comment", handleNewComment);

    return () => {
      socket.off("new-comment", handleNewComment);
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
                          className="bg-white p-3 rounded-md shadow-sm mb-3 flex justify-between items-start"
                        >
                          <div>
                            <p className="text-sm font-semibold text-gray-800">
                              {c.userName}
                            </p>
                            <p className="text-gray-700 text-sm">{c.message}</p>
                          </div>

                          {/* <button
                            onClick={() => dispatch(deleteComment(c._id))}
                            className="text-red-500 text-sm hover:text-red-700"
                          >
                            Delete
                          </button> */}
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
