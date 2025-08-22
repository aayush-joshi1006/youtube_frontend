import { Link, useNavigate } from "react-router-dom";
import { FaYoutube } from "react-icons/fa";
import { useEffect, useState } from "react";
import axiosInstance from "../utiles/axiosInstance.js";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utiles/userSlice.js";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const user = useSelector((store) => store.user.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    //  /user/register
    if (!trimmedEmail || !trimmedPassword || !trimmedUsername) return;

    let newUser = {
      email: trimmedEmail,
      username: trimmedUsername,
      password: trimmedPassword,
    };
    setLoading(true);
    try {
      const res = await axiosInstance.post("/user/register", newUser);
      console.log("user registered ", res.data);
      dispatch(addUser(res.data));
      setEmail("");
      setUsername("");
      setPassword("");
      setError(null);

      navigate("/");
    } catch (error) {
      setError(error.response?.data.message || "Something went wrong");
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
        {/* Logo + Heading */}
        <div className="flex flex-col items-center">
          <FaYoutube className="h-16 w-16 text-[#f03] animate-pulse drop-shadow-md" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create Your Account
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Sign up to get started with YouTube Clone
          </p>
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
                setEmail(e.target.value);
                setError(null);
              }}
              required
              className="mt-2 block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
            />
          </div>

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

          {error && <p className="text-center text-xs text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={!email || !username || !password || loading}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-400 disabled:bg-indigo-300"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        {/* Footer */}
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
