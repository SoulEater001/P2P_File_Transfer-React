import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "./Footer";
import { Link } from "react-router-dom";

const Login = ({ setIsAuthenticated }) => {
  const [input, setInput] = useState({ username: "", password: "" });
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
      const response = await axios.post("https://p2pfiletransfer-react-backend-production.up.railway.app/api/auth/login", input);
      const { token, username } = response.data;

      // Save token to localStorage or a global state
      localStorage.setItem("authToken", token);
      setIsAuthenticated(true);

      // Redirect to the protected page
      navigate("/");
    } catch (err) {
      console.error("Axios error details:", err.response || err);
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <div className="text-white bg-purple-500">
        <Link to="/">
          <h1 className="flex justify-center text-5xl">ShareWare</h1>
        </Link>
      </div>
      <form
        className="my-20 mx-auto w-[360px] rounded-md border-4 border-purple-800 space-y-2 p-4"
        onSubmit={handleSubmitEvent}
      >
        {error && <p className="text-red-500">{error}</p>}
        <div className="form_control">
          <label className="block text-sm font-semibold" htmlFor="username">
            Username or Email
          </label>
          <input
            className="block w-full rounded-md border-2 border-purple-400 p-2 focus:border-purple-800 disabled:border-purple-300 disabled:bg-purple-50"
            type="text"
            id="username"
            name="username"
            placeholder="Enter your username or email"
            onChange={handleInput}
          />
        </div>
        <div className="form_control">
          <label className="block text-sm font-semibold" htmlFor="password">
            Password
          </label>
          <input
            className="block w-full rounded-md border-2 border-purple-400 p-2 focus:border-purple-800 disabled:border-purple-300 disabled:bg-purple-50"
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            onChange={handleInput}
          />
        </div>
        <div className="space-x-2 flex flex-row justify-between">
          <button
            type="submit"
            className="btn-submit bg-purple-300 text-purple-800 rounded-md border-purple-800 px-2 border-2"
          >
            LogIn
          </button>
          <button
            type="button"
            className="btn-submit bg-purple-300 text-purple-800 rounded-md border-purple-800 px-2 border-2"
          >
            <Link to ="/signup">Sign Up</Link>
            
          </button>
        </div>
      </form>
      <div className="mb-[340px]"></div>
      <Footer />
    </>
  );
};

export default Login;
