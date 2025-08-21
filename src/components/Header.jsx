import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { FaYoutube } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utiles/axiosInstance";
import { removeUser } from "../utiles/userSlice";
import { CgProfile } from "react-icons/cg";
import { setSearch } from "../utiles/searchSlice";
import { IoMdClose } from "react-icons/io";

export default function Header({ sidebar }) {
  const [dropdownOpen, setdropdownOpen] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [localSearch, setLocalSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const timeoutRef = useRef(null);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  const currentUser = useSelector((store) => store.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log(currentUser);

  const username = currentUser?.username;

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
      }
    }

    if (showSearch) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [showSearch, setShowSearch]);

  useEffect(() => {
    const handler = setTimeout(() => {
      dispatch(setSearch(localSearch));
    }, 500);

    return () => clearTimeout(handler);
  }, [localSearch, dispatch]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setdropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (dropdownOpen && !hovering) {
      timeoutRef.current = setTimeout(() => {
        setdropdownOpen(false);
      }, 3000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [dropdownOpen, hovering]);

  useEffect(() => {
    if (!dropdownOpen) {
      setHovering(false);
    }
  }, [dropdownOpen]);

  const handleLogout = async () => {
    if (!currentUser) return;

    try {
      const res = await axiosInstance.post("/user/logout");
      console.log("Logout successful", res.data);
      dispatch(removeUser());
      navigate("/");
    } catch (error) {
      console.error(
        "Registration failed ",
        error.response?.data || error.message
      );
    }
  };

  return (
    <>
      <nav className="flex justify-between items-center px-4 py-3 bg-black text-white fixed top-0 left-0 w-full z-40 shadow-md">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            className="hidden sm:block hover:bg-gray-800 p-2 rounded-full transition"
            onClick={() => sidebar.setToggleSidebar(!sidebar.toggleSidebar)}
          >
            <GiHamburgerMenu className="text-xl" />
          </button>

          <div
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <FaYoutube className="text-blue-500 text-3xl" />
            <span className="text-xl font-bold tracking-wide">YouTube</span>
          </div>
        </div>

        {/* Search Bar (centered) */}
        <div className="hidden sm:flex absolute left-1/2 transform -translate-x-1/2 w-1/2 max-w-xl">
          <div className="flex items-center w-full rounded-full border border-gray-700 bg-gray-900 focus-within:border-blue-500 relative">
            <input
              type="text"
              placeholder="Search"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="text-sm sm:text-base bg-transparent outline-none px-4 py-2 w-full text-gray-200 placeholder-gray-500 pr-10"
            />
            {/* Search Icon (inside input, right aligned) */}
            <button className="absolute right-3 text-gray-400 hover:text-white">
              <CiSearch className="text-xl" />
            </button>
          </div>
        </div>

       
        {showSearch && (
          <div
            className="fixed inset-0 bg-black/50 z-[9999] flex flex-col p-4"
            onClick={(e) => {
              e.stopPropagation(); // stops event bubbling
              setShowSearch(false); // closes search box
            }}
          >
            {/* Prevent closing when clicking inside the search box */}
            <div
              className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-md"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="text"
                placeholder="Search..."
                className="flex-1 px-3 py-2 rounded-lg bg-gray-100 text-gray-900 outline-none"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setShowSearch(false);
                  }
                }}
                autoFocus
              />
              <button onClick={() => setShowSearch(false)}>
                <IoMdClose className="text-3xl text-gray-700 hover:text-black" />
              </button>
            </div>
          </div>
        )}

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <button className="sm:hidden" onClick={() => setShowSearch(true)}>
            <CiSearch className="text-2xl" />
          </button>

          {!currentUser ? (
            <Link
              to="/signup"
              className="flex items-center gap-1 px-3 py-2 text-sm sm:text-base rounded-full bg-gradient-to-r from-blue-500 to-blue-700 hover:opacity-90 transition"
            >
              <CgProfile className="text-lg sm:text-2xl" />
              <span>Sign Up</span>
            </Link>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <div
                className="bg-blue-600 flex justify-center items-center cursor-pointer w-10 h-10 text-lg rounded-full hover:ring-2 hover:ring-blue-400 transition"
                onClick={() => setdropdownOpen((e) => !e)}
              >
                {currentUser.isChannelCreated ? (
                  <img
                    src={`${currentUser.channelAvatar}`}
                    className="w-full h-full object-cover rounded-full border border-gray-700"
                    alt={`${username}'s avatar`}
                  />
                ) : (
                  <span className="text-white font-bold">
                    {username?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              {/* Dropdown */}
              <ul
                className={`absolute top-12 right-0 bg-gray-900 border border-gray-700 rounded-lg shadow-lg text-sm w-44 transform transition-all duration-300 ${
                  dropdownOpen
                    ? "scale-100 opacity-100"
                    : "scale-95 opacity-0 pointer-events-none"
                }`}
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
              >
                <li className="px-4 py-2 text-gray-400 italic">
                  Welcome, {username}
                </li>
                <li
                  className="px-4 py-2 hover:bg-blue-600 cursor-pointer rounded-t-md"
                  onClick={() => {
                    setdropdownOpen(false);
                    navigate("/createChannel");
                  }}
                >
                  Your Channel
                </li>
                <li
                  className="px-4 py-2 hover:bg-blue-600 cursor-pointer"
                  onClick={() => {
                    setdropdownOpen(false);
                    navigate("/upload");
                  }}
                >
                  Upload Video
                </li>
                <li
                  className="px-4 py-2 hover:bg-red-600 cursor-pointer rounded-b-md"
                  onClick={() => {
                    setdropdownOpen(false);
                    handleLogout();
                  }}
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
