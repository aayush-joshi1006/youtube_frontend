import { CgProfile } from "react-icons/cg";
import { HiHome } from "react-icons/hi";
import { NavLink } from "react-router-dom";
import { FiUpload } from "react-icons/fi";
import { useSelector } from "react-redux";

export default function SideBar({ sidebar }) {
  const currentUser = useSelector((store) => store.user.user);

  let channelLink = "/login";
  let uploadLink = "/login";

  if (currentUser) {
    if (currentUser.isChannelCreated) {
      channelLink = `/channel/${currentUser.channel}`;
      uploadLink = "/upload";
    } else {
      channelLink = "/createChannel";
      uploadLink = "/createChannel";
    }
  }

  return (
    <>
      <div
        className={`hidden sm:block transition-all duration-500 ease-in-out bg-black text-white h-screen text-lg fixed top-0 left-0 z-30 shadow-lg ${
          sidebar.toggleSidebar ? "w-16" : "w-72"
        }`}
      >
        <ul className="mt-20 space-y-2">
          {/* Home */}
          <li>
            <NavLink to="/">
              {({ isActive }) => (
                <div
                  className={`flex items-center rounded-3xl mx-2 my-2 transition-all duration-300 ${
                    sidebar.toggleSidebar
                      ? "justify-center px-2 py-3"
                      : "px-4 py-3"
                  } ${
                    isActive
                      ? "bg-gray-800 font-semibold text-blue-500"
                      : "hover:bg-gray-800 text-gray-300"
                  }`}
                >
                  <HiHome className="text-2xl" />
                  {!sidebar.toggleSidebar && <p className="ml-3">Home</p>}
                </div>
              )}
            </NavLink>
          </li>

          {/* Your Channel */}
          <li>
            <NavLink to={channelLink}>
              {({ isActive }) => (
                <div
                  className={`flex rounded-3xl mx-2 items-center my-2 transition-all duration-300 ${
                    sidebar.toggleSidebar
                      ? "justify-center px-2 py-3"
                      : "px-4 py-3"
                  } ${
                    isActive && channelLink !== "/login"
                      ? "bg-gray-800 font-semibold text-blue-500"
                      : "hover:bg-gray-800 text-gray-300"
                  }`}
                >
                  <CgProfile className="text-2xl" />
                  {!sidebar.toggleSidebar && (
                    <p className="ml-3">Your Channel</p>
                  )}
                </div>
              )}
            </NavLink>
          </li>
          <li>
            <NavLink to={uploadLink}>
              {({ isActive }) => (
                <div
                  className={`flex items-center rounded-3xl mx-2 my-2 transition-all duration-300 ${
                    sidebar.toggleSidebar
                      ? "justify-center px-2 py-3"
                      : "px-4 py-3"
                  } ${
                    isActive &&
                    uploadLink !== "/login" &&
                    uploadLink !== "/createChannel"
                      ? "bg-gray-800 font-semibold text-blue-500"
                      : "hover:bg-gray-800 text-gray-300"
                  }`}
                >
                  <FiUpload className="text-2xl" />
                  {!sidebar.toggleSidebar && (
                    <p className="ml-3">Upload Video</p>
                  )}
                </div>
              )}
            </NavLink>
          </li>
        </ul>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="sm:hidden fixed bottom-0 left-0 w-full bg-black text-white flex justify-around items-center py-2 z-40 border-t border-gray-800">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center ${
              isActive ? "text-blue-500" : "text-gray-300"
            }`
          }
        >
          <HiHome className="text-2xl" />
          <span className="text-xs">Home</span>
        </NavLink>

        <NavLink
          to={channelLink}
          className={({ isActive }) =>
            `flex flex-col items-center ${
              isActive && channelLink !== "/login"
                ? "text-blue-500"
                : "text-gray-300"
            }`
          }
        >
          <CgProfile className="text-2xl" />
          <span className="text-xs">Channel</span>
        </NavLink>

        <NavLink
          to={uploadLink}
          className={({ isActive }) =>
            `flex flex-col items-center ${
              isActive &&
              uploadLink !== "/login" &&
              uploadLink !== "/createChannel"
                ? "text-blue-500"
                : "text-gray-300"
            }`
          }
        >
          <FiUpload className="text-2xl" />
          <span className="text-xs">Upload</span>
        </NavLink>
      </div>
    </>
  );
}
