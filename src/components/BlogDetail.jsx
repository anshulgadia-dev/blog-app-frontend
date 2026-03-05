import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { imageURLResolver } from "../config/imageUrlResolver";

export const BlogDetail = () => {
  const blogId = useParams().id;
  const [blog, setBlog] = useState(null);

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

  useEffect(() => {
    getBlog();
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

              <div className="bg-gray-50 p-4 rounded-lg text-gray-500">
                No comments yet.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
