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
    <>
      <div className="flex min-h-full flex-col justify-center px-6 py-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <FaYoutube className="mx-auto h-20 w-auto text-[#f03] animate-pulse" />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900 animate-bounce">
            Login Here
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoFocus
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value.trim());
                    setError(null);
                  }}
                  required
                  autoComplete="email"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value.trim());
                    setError(null);
                  }}
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={!email || !password || loading}
                className="flex w-full justify-center rounded-md bg-indigo-600 disabled:bg-indigo-300 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {loading ? "Logging In..." : "Log In"}
              </button>
            </div>
          </form>
          {error && (
            <p className="text-center text-red-700 text-xs mt-2">{error}</p>
          )}
          <p className="mt-4 text-center text-sm/6 text-gray-400">
            Don't have an account?
            <Link
              to="/signup"
              className="font-semibold text-indigo-400 hover:text-indigo-300"
            >
              Sign Up here
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
