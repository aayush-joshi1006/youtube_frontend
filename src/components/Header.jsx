import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { CgProfile } from "react-icons/cg";
import { IoMdClose } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import { FaYoutube } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";

import { toast } from "react-toastify";

import axiosInstance from "../utiles/axiosInstance";
import { removeUser } from "../utiles/userSlice";
import { setSearch } from "../utiles/searchSlice";
import defaultAvatar from "../assets/default-avatar.jpg";

// Header section
export default function Header({ sidebar }) {
  // states for managing drop down menu
  const [dropdownOpen, setdropdownOpen] = useState(false);
  const [hovering, setHovering] = useState(false);
  // states for managing search
  const [localSearch, setLocalSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  // references for dropdown, search, and timeout
  const timeoutRef = useRef(null);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  // current user
  const currentUser = useSelector((store) => store.user.user);
  // initializing dispatchand navigatte method
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // getting the username from current user
  const username = currentUser?.username;
  // hook for managing the display of search bar mainly on mobile device
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
  // applying debounce effect for search
  useEffect(() => {
    const handler = setTimeout(() => {
      dispatch(setSearch(localSearch));
    }, 500);

    return () => clearTimeout(handler);
  }, [localSearch, dispatch]);
  // hook for managing outside click of a dropdown
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
  // 3 second timeout for dropdown display
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
  // hook for setting the hovering state to false in case the mouse goes out of the dropdown
  useEffect(() => {
    if (!dropdownOpen) {
      setHovering(false);
    }
  }, [dropdownOpen]);

  // function for handling logout
  const handleLogout = async () => {
    // in case there is no current user exit the function
    if (!currentUser) return;

    try {
      // making request for logging out
      const res = await axiosInstance.post("/user/logout");
      // removing the user from redux store
      dispatch(removeUser());
      // navigate back to homepage
      navigate("/");
      toast.success("Logged out successfully");
    } catch (error) {
      // in case there is an error while logging out
      toast.error(
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
          {/* for toggling sidebar */}
          <button
            className="hidden sm:block hover:bg-gray-800 p-2 rounded-full transition"
            onClick={() => sidebar.setToggleSidebar(!sidebar.toggleSidebar)}
          >
            <GiHamburgerMenu className="text-xl" />
          </button>
          {/* Logo  */}
          <div
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <FaYoutube className="text-blue-500 text-3xl" />
            <span className="text-xl font-bold tracking-wide">VidSphere</span>
          </div>
        </div>

        {/* Search Bar (centered) for desktop */}
        <div className="hidden sm:flex absolute left-1/2 transform -translate-x-1/2 w-1/2 max-w-xl">
          <div className="flex items-center w-full rounded-full border border-gray-700 bg-gray-900 focus-within:border-blue-500 relative">
            {/* search input */}
            <input
              type="text"
              placeholder="Search"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="text-sm sm:text-base bg-transparent outline-none px-4 py-2 w-full text-gray-200 placeholder-gray-500 pr-10"
            />
            <button className="absolute right-3 text-gray-400 hover:text-white">
              <CiSearch className="text-xl" />
            </button>
          </div>
        </div>
        {/* search box for mobile view */}
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
              {/* input field for searching */}
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

        {/* Right Section signin  */}
        <div className="flex items-center gap-4">
          {/* search icon for mobile display */}
          <button className="sm:hidden" onClick={() => setShowSearch(true)}>
            <CiSearch className="text-2xl" />
          </button>
          {/* conditional rendering if user is present or not */}
          {!currentUser ? (
            // Sign Up button
            <Link
              to="/signup"
              className="flex items-center gap-1 px-3 py-2 text-sm sm:text-base rounded-full bg-gradient-to-r from-blue-500 to-blue-700 hover:opacity-90 transition"
            >
              <CgProfile className="text-lg sm:text-2xl" />
              <span>Sign Up</span>
            </Link>
          ) : (
            // in case user is logged in
            <div className="relative" ref={dropdownRef}>
              <div
                className="bg-blue-600 flex justify-center items-center cursor-pointer w-10 h-10 text-lg rounded-full hover:ring-2 hover:ring-blue-400 transition"
                onClick={() => setdropdownOpen((e) => !e)}
              >
                {/* in case channel is present using channel avatar */}
                {currentUser.isChannelCreated ? (
                  <img
                    src={currentUser.channelAvatar || defaultAvatar}
                    className="w-full h-full object-cover rounded-full border border-gray-700"
                    alt={`${username}'s avatar`}
                  />
                ) : (
                  // in case channel avatar is not present
                  <span className="text-white font-bold">
                    {username?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              {/* Dropdown menu */}
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
