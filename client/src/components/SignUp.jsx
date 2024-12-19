import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleInput = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitEvent = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        input
      );
      const { token, username } = response.data;

      // Save token to localStorage or a global state
      localStorage.setItem("authToken", token);

      // Redirect to login page or main page
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="sign-up-form">
      <h1 className="text-center text-3xl text-purple-800">Sign Up</h1>
      <form
        className="my-20 mx-auto w-[360px] rounded-md border-4 border-purple-800 space-y-4 p-4"
        onSubmit={handleSubmitEvent}
      >
        {error && <p className="text-red-500">{error}</p>}

        <div className="form_control">
          <label className="block text-sm font-semibold" htmlFor="username">
            Username
          </label>
          <input
            className="block w-full rounded-md border-2 border-purple-400 p-2 focus:border-purple-800"
            type="text"
            id="username"
            name="username"
            placeholder="Enter your username"
            onChange={handleInput}
            required
          />
        </div>

        <div className="form_control">
          <label className="block text-sm font-semibold" htmlFor="email">
            Email
          </label>
          <input
            className="block w-full rounded-md border-2 border-purple-400 p-2 focus:border-purple-800"
            type="email"
            id="email"
            name="email"
            placeholder="example@gmail.com"
            onChange={handleInput}
            required
          />
        </div>

        <div className="form_control">
          <label className="block text-sm font-semibold" htmlFor="password">
            Password
          </label>
          <input
            className="block w-full rounded-md border-2 border-purple-400 p-2 focus:border-purple-800"
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            onChange={handleInput}
            required
          />
        </div>

        <div className="space-x-2 flex flex-row justify-between">
          <button
            type="submit"
            className="btn-submit bg-purple-300 text-purple-800 rounded-md border-purple-800 px-2 border-2"
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
