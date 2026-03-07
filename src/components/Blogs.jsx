import { useEffect } from "react";
import BlogCard from "./BlogCard";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllBlogs } from "../redux/slices/blogsSlice";
import BlogSkeleton from "./BlogSkeleton";

const Blogs = () => {
  const { blogs, loading, error } = useSelector((state) => state.blog);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllBlogs());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // if (loading) {
  //   return <h2>Loading...</h2>;
  // }

  if (error) {
    console.log(error);
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-200 py-16 px-6">
      <div className="max-w-7xl mx-auto text-center mb-14">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Explore Latest Blogs
        </h1>

        <p className="text-gray-600 text-lg">
          Discover insights, tutorials and stories from our writers
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <BlogSkeleton key={i} />)
          : blogs?.map((blog) => <BlogCard key={blog._id} data={blog} />)}
      </div>
    </div>
  );
};

export default Blogs;
