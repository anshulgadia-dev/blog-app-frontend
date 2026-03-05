import { imageURLResolver } from "../config/imageUrlResolver";
import { Link } from "react-router-dom";

const BlogCard = ({ data }) => {
  const imageurl = imageURLResolver(data.image);

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
          {/* Author */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
            <span>Author</span>
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
