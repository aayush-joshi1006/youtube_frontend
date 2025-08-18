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

export default function Header({ sidebar }) {
  const [dropdownOpen, setdropdownOpen] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [localSearch, setLocalSearch] = useState("");

  const timeoutRef = useRef(null);
  const dropdownRef = useRef(null);

  const currentUser = useSelector((store) => store.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const username = currentUser?.username;

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
    } catch (error) {
      console.error(
        "Registration failed ",
        error.response?.data || error.message
      );
    }
  };

  return (
    <>
      <nav className="flex justify-between p-3 text-2xl bg-[rgb(15_15_15)] text-[#ffffff] fixed top-0 left-0 w-full z-40">
        <div className="flex justify-center items-center gap-5">
          <div
            className="hover:bg-gray-800 p-2 rounded-full transition-colors duration-500"
            onClick={() => sidebar.setToggleSidebar(!sidebar.toggleSidebar)}
          >
            <GiHamburgerMenu />
          </div>

          <div className="flex justify-center items-center gap-1 mx-3 cursor-pointer">
            <FaYoutube className="text-[#f03]" />
            <span className="text-2xl font-bold">Youtube</span>
          </div>
        </div>
        <div className="flex justify-center items-center rounded-3xl border border-[#222222] w-1/2">
          <input
            type="text"
            placeholder="Search"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="text-xl text-[#6a6a6a] outline-none px-7 py-2 w-full"
          />
          <div className="bg-[#222222] text-3xl py-2 px-5 rounded-r-3xl">
            <CiSearch className="text-[#e3e3e3]" />
          </div>
        </div>
        {!currentUser ? (
          <Link
            to="/signup"
            className="text-base flex justify-center gap-x-1 bg-gradient-to-r from-purple-400 to-yellow-600 border px-1 rounded-4xl items-center mx-3"
          >
            <CgProfile className="text-3xl" />
            <span>Sign Up</span>
          </Link>
        ) : (
          <div className="relative mx-3" ref={dropdownRef}>
            <div
              className="bg-[#8c6e62] flex justify-center items-center cursor-pointer w-10 h-10 text-xl rounded-full"
              onClick={() => setdropdownOpen((e) => !e)}
            >
              {username.toUpperCase().charAt(0) || ""}
            </div>

            <ul
              className={`flex origin-top transform justify-center flex-col items-start text-base absolute top-full right-0 bg-[rgb(40_40_40)] w-40 font-extralight rounded-xl transition-all duration-500 ${
                dropdownOpen
                  ? "scale-y-100 opacity-100"
                  : "scale-y-0 opacity-0 pointer-events-none"
              }`}
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
            >
              <li
                className="px-3 py-3  italic text-sm cursor-auto w-full transition-colors duration-500 rounded-t-2xl"
                onClick={() => setdropdownOpen(false)}
              >
                Welcome, {username}
              </li>
              <li
                className="px-3 py-1 hover:bg-[#0f0f0f] w-full transition-colors duration-500 cursor-pointer"
                onClick={() => {
                  setdropdownOpen(false);
                  navigate("/createChannel");
                }}
              >
                Your Channel
              </li>
              <li
                className="px-3 py-1 hover:bg-[#0f0f0f] w-full transition-colors duration-500 cursor-pointer"
                onClick={() => {
                  setdropdownOpen(false);
                  navigate("/upload");
                }}
              >
                Uplaod Video
              </li>
              <li
                className="px-3 py-1 hover:bg-[#0f0f0f] w-full transition-colors duration-500 cursor-pointer rounded-b-2xl"
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
      </nav>
    </>
  );
}
