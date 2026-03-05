import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import BlogDetail from "./components/BlogDetail";
import Login from "./components/Login";
import Register from "./components/Register";
import AddBlog from "./components/AddBlog";

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
        </Routes>
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
