import { imageURLResolver } from "../config/imageUrlResolver";
import { Link, useNavigate } from "react-router-dom";
import { FcLikePlaceholder } from "react-icons/fc";
import { FcLike } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { toggleLike, likeRealTime } from "../redux/slices/blogsSlice";
import { toast } from "react-toastify";
import { useEffect } from "react";
import socket from "../socket";

const BlogCard = ({ data }) => {
  const imageurl = imageURLResolver(data.image);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.blog);

  useEffect(() => {
    socket.on("like", (res) => {
      dispatch(likeRealTime(res));
    });
  }, []);

  const handleToggleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(toggleLike(data._id))
      .unwrap()
      .then((res) => {
        toast.success(res.message);
      })
      .catch((err) => {
        if (err.status === 401) {
          toast.error(err.message);
          navigate("/login");
        }
      });
  };
  return (
    <Link
      to={`/blog/${data._id}`}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500"
    >
      {/* Image */}
      <div className="relative h-56 w-full overflow-hidden">
        <img
          src={imageurl}
          alt={data.title}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent"></div>

        {/* Category */}
        <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
          {data.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3">
        {/* Title */}
        <h2 className="text-xl font-bold text-gray-800 line-clamp-1 group-hover:text-red-500 transition">
          {data.title}
        </h2>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-2">{data.content}</p>

        {/* Footer */}
        <div className="flex justify-between items-center pt-3 text-sm text-gray-500">
          <div className="flex items-center gap-2 w-14 h-14">
            <FcLikePlaceholder
              onClick={handleToggleLike}
              className="w-12 h-12 hover:cursor-pointer hover:scale-110 duration-200"
            />

            <span>{data.likesCount}</span>
          </div>

          {/* Read More */}
          <span className="text-red-500 font-semibold group-hover:translate-x-1 transition">
            Read →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
