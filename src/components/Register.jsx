import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/register`,
        data,
      );

      localStorage.setItem("token", res.data.token);

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-xl rounded-xl p-10 w-100">
        <h2 className="text-3xl font-semibold text-center mb-6">
          Create New Account
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col">
            <label className="mb-1 text-sm">Name</label>
            <input
              name="name"
              type="name"
              value={data.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-sm">Email</label>
            <input
              name="email"
              type="email"
              value={data.email}
              onChange={handleChange}
              placeholder="example@gmail.com"
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm">Password</label>
            <input
              name="password"
              type="password"
              value={data.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            disabled={loading}
            className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-medium">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
