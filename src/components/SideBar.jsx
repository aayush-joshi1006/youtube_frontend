import { CgProfile } from "react-icons/cg";
import { HiHome } from "react-icons/hi";
import { NavLink } from "react-router-dom";

export default function SideBar({ sidebar }) {
  return (
    <div
      className={`transition-all origin-left transform duration-700 bg-[rgb(15_15_15)] text-[#ffffff] h-screen text-xl fixed top-0 left-0 bottom-0 z-30 ${
        sidebar.toggleSidebar ? "w-20" : " w-72"
      }`}
    >
      <ul className="mt-24">
        <li>
          <NavLink to="/">
            {({ isActive }) => (
              <div className="flex justify-between items-center w-full">
                <div
                  className={`flex items-center gap-4 w-full hover:bg-gray-700 cursor-pointer my-5 transition-all duration-500 rounded-xl ${
                    isActive ? "font-bold" : "font-extralight"
                  } ${
                    sidebar.toggleSidebar
                      ? "p-1 justify-center"
                      : "px-3 py-2 justify-start"
                  }`}
                >
                  <HiHome className="text-3xl" />
                  {!sidebar.toggleSidebar && <p>Home</p>}
                </div>

                <div
                  className={`w-1 h-9 rounded-lg mx-1 transition-colors duration-500 ${
                    isActive ? "bg-blue-600" : "bg-black"
                  }`}
                ></div>
              </div>
            )}
          </NavLink>
        </li>
        <li>
          <NavLink to="/channel/id">
            {({ isActive }) => (
              <div className="flex justify-between items-center w-full">
                <div
                  className={`flex items-center gap-4 w-full hover:bg-gray-700 cursor-pointer my-1 transition-all duration-500 rounded-xl ${
                    isActive ? "font-bold" : "font-extralight"
                  } ${
                    sidebar.toggleSidebar
                      ? "p-1 justify-center"
                      : "px-3 py-2 justify-start"
                  }`}
                >
                  <CgProfile className="text-3xl" />
                  {!sidebar.toggleSidebar && <p>Your Channel</p>}
                </div>

                <div
                  className={`w-1 h-9 rounded-lg mx-1 transition-colors duration-500 ${
                    isActive ? "bg-blue-600" : "bg-black"
                  }`}
                ></div>
              </div>
            )}
          </NavLink>
        </li>
      </ul>
    </div>
  );
}
