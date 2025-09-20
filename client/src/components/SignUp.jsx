import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Footer from "./Footer";

const SignUp = ({ setIsAuthenticated }) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [input, setInput] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInput = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmitEvent = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/signup`,
        input
      );
      const { token, username, id } = response.data;

      localStorage.setItem("authToken", token);
      localStorage.setItem("username", username);
      localStorage.setItem("userId", id);
      setIsAuthenticated(true);

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-center py-6 bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-md">
        <Link to="/">
          <h1 className="text-4xl font-bold tracking-wide">ShareWare</h1>
        </Link>
      </div>

      <div className="min-h-screen flex items-center justify-center bg-cyan-50 py-12">
        <form
          className="w-[380px] p-10 bg-white rounded-2xl shadow-xl space-y-6"
          onSubmit={handleSubmitEvent}
        >
          <h2 className="text-2xl font-semibold text-blue-800 text-center tracking-tight">
            Create Your Account
          </h2>
          {error && <p className="text-red-500 text-center">{error}</p>}

          <div>
            <label className="block text-sm font-medium text-blue-800 mb-1" htmlFor="username">
              Username
            </label>
            <input
              className="w-full p-3 border-2 border-blue-200 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition outline-none"
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              value={input.username}
              onChange={handleInput}
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-800 mb-1" htmlFor="email">
              Email
            </label>
            <input
              className="w-full p-3 border-2 border-blue-200 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition outline-none"
              type="email"
              id="email"
              name="email"
              placeholder="example@gmail.com"
              value={input.email}
              onChange={handleInput}
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-800 mb-1" htmlFor="password">
              Password
            </label>
            <input
              className="w-full p-3 border-2 border-blue-200 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition outline-none"
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={input.password}
              onChange={handleInput}
              disabled={loading}
              required
            />
          </div>

          <div className="flex justify-between space-x-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-1/2 py-3 rounded-lg font-semibold text-white transition transform ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:scale-105"
              }`}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>

            <Link
              to="/login"
              className="w-1/2 py-3 text-center rounded-lg font-semibold text-cyan-700 bg-cyan-100 hover:bg-cyan-200 hover:scale-105 transition transform"
            >
              Log In
            </Link>
          </div>
        </form>
      </div>

      <Footer />
    </>
  );
};

export default SignUp;
