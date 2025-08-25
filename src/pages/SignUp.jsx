import { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import { toast } from "react-toastify";

import { FaYoutube } from "react-icons/fa";

import axiosInstance from "../utiles/axiosInstance.js";
import { addUser } from "../utiles/userSlice.js";

// Sign Up Page
export default function SignUp() {
  // states for managing email,username,password
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // states for manging error and loading
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  // getting current user from redux store
  const user = useSelector((store) => store.user.user);
  // initializing the navigate and dispatch method
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // in case user is already there nevigate back to the homepage
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // function for handling form submition
  const handleSubmit = async (e) => {
    // preventing the default behavior of form submit
    e.preventDefault();
    // trimming out the username,email and password
    const trimmedEmail = email.trim();
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    //  exiting function in case any of the mendetory texts are missing
    if (!trimmedEmail || !trimmedPassword || !trimmedUsername) return;
    // creating a new user object
    let newUser = {
      email: trimmedEmail,
      username: trimmedUsername,
      password: trimmedPassword,
    };
    setLoading(true);
    try {
      // sending request for adding new user to the database
      const res = await axiosInstance.post("/user/register", newUser);
      // saving the user to the redux store
      dispatch(addUser(res.data));
      // setting all values to initial state
      setEmail("");
      setUsername("");
      setPassword("");
      setError(null);

      toast.success("User registered successfully");
      // navigating to the homepage
      navigate("/");
    } catch (error) {
      // handling the error
      setError(error.response?.data.message || "Something went wrong");
      toast.error(
        "Registration failed ",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 px-6 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        {/* Logo and Heading */}
        <div className="flex flex-col items-center">
          <FaYoutube className="h-16 w-16 text-blue-500 animate-pulse drop-shadow-md" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create Your Account
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Sign up to get started with YouTube Clone
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Email address */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              autoFocus
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              required
              className="mt-2 block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
            />
          </div>
          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError(null);
              }}
              required
              className="mt-2 block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
              placeholder="Choose a username"
            />
          </div>
          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              required
              className="mt-2 block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your password"
            />
          </div>
          {/* Error display */}
          {error && <p className="text-center text-xs text-red-600">{error}</p>}
          {/* Submit button */}
          <button
            type="submit"
            disabled={!email || !username || !password || loading}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-400 disabled:bg-indigo-300"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        {/* navigation for log in */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
