import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { logoutUser } from "../redux/slices/authSlice.js";
const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logoutUser());
  };
  return (
    <>
      <nav className="flex justify-between bg-blue-600 p-10">
        <h1 className="text-white text-3xl">BLOG APP</h1>
        <div className="flex items-center gap-8">
          <p className="cursor-pointer bg-white hover:bg-gray-200 duration-200 p-4 rounded-md">
            Add Blog
          </p>
          {user ? (
            <>
              <button
                onClick={() => handleLogout()}
                className="cursor-pointer bg-red-500 hover:bg-red-600 text-white duration-200 p-4 rounded-md"
              >
                Logout
              </button>
              <p>Hi! {user?.name}</p>
            </>
          ) : (
            <Link
              to={"/login"}
              className="cursor-pointer bg-white hover:bg-gray-200 duration-200 p-4 rounded-md"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
