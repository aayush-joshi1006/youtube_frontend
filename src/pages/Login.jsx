import { Link, useNavigate } from "react-router-dom";
import { FaYoutube } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../utiles/axiosInstance";
import { addUser } from "../utiles/userSlice";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const user = useSelector((store) => store.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Both email and password are required");
      return;
    }

    const currentUser = {
      email,
      password,
    };

    setLoading(true);

    try {
      const res = await axiosInstance.post("/user/login", currentUser);
      console.log("User signed in: ", res.data);
      dispatch(addUser(res.data));
      setEmail("");
      setPassword("");
      setError(null);
      navigate("/");
    } catch (error) {
      setError(
        error.response?.data.message || error.message || "Something went wrong"
      );
      console.error(
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
        {/* Logo */}
        <div className="flex flex-col items-center">
          <FaYoutube className="h-16 w-16 text-[#f03] animate-pulse drop-shadow-md" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-500">Please login to continue</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
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
                setEmail(e.target.value.trim());
                setError(null);
              }}
              required
              className="mt-2 block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
            />
          </div>

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
                setPassword(e.target.value.trim());
                setError(null);
              }}
              required
              className="mt-2 block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your password"
            />
          </div>

          {error && <p className="text-center text-xs text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={!email || !password || loading}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-400 disabled:bg-indigo-300"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
