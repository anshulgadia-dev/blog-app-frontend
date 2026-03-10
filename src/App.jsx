import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import BlogDetail from "./components/BlogDetail";
import Login from "./components/Login";
import Register from "./components/Register";
import AddBlog from "./components/AddBlog";
import Dropdown from "./components/Dropdown";
import Profile from "./components/Profile";
import MyBlogs from "./components/MyBlogs";

const app = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/addblog" element={<AddBlog />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/myblogs" element={<MyBlogs />} />
        </Routes>
        <ToastContainer theme="dark" autoClose={3000} />
      </BrowserRouter>
    </>
  );
};

export default app;

//
// Home Page
// Nav
// Profile
// Blog Detail
// Add Blog Model
//
