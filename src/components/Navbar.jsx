import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { logoutUser } from "../redux/slices/authSlice.js";
import { toast } from "react-toastify";
import Dropdown from "./Dropdown.jsx";
const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const handleLogout = async () => {
    await dispatch(logoutUser()).unwrap();
    toast.success("Logged Out");
  };
  return (
    <>
      <nav className="flex justify-between bg-blue-600 p-10">
        <h1 className="text-white text-3xl">BLOG APP</h1>
        <div className="flex items-center gap-8">
          {user && (
            <Link
              to={"/addblog"}
              className="cursor-pointer bg-white hover:bg-gray-200 duration-200 p-4 rounded-md"
            >
              Add Blog
            </Link>
          )}
          {user ? (
            <>
              <button
                onClick={() => handleLogout()}
                className="cursor-pointer bg-red-500 hover:bg-red-600 text-white duration-200 p-4 rounded-md"
              >
                Logout
              </button>
              {/* <p>Hi! {user?.name}</p> */}

              <Dropdown
                title={`Hi ! ${user.name}`}
                options={[
                  { title: "Profile", path: "/profile" },
                  { title: "My Blogs", path: "/myblogs" },
                ]}
              />
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
