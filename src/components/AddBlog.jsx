import { useState } from "react";
import { addBlog } from "../redux/slices/blogsSlice.js";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
const AddBlog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
    blogImage: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setFormData({ ...formData, blogImage: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addBlog(formData))
      .unwrap()
      .then((data) => {
        console.log("blog Added");
      })
      .catch((err) => {
        if (err.status === 401) {
          navigate("/login");
        }
      });
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-200 py-16 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Create New Blog
          </h1>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Blog Title
              </label>

              <input
                type="text"
                name="title"
                placeholder="Enter blog title"
                value={formData.title}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Category
              </label>

              <input
                type="text"
                name="category"
                placeholder="Enter category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Blog Content
              </label>

              <textarea
                name="content"
                rows="6"
                placeholder="Write your blog content..."
                value={formData.content}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Upload Image
              </label>

              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition duration-300"
            >
              Publish Blog
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBlog;
