import { useState } from "react";
import Header from "./components/Header";
import SideBar from "./components/SideBar";
import { Outlet } from "react-router-dom";

function App() {
  const [toggleSidebar, setToggleSidebar] = useState(true);

  return (
    <>
      <Header sidebar={{ toggleSidebar, setToggleSidebar }} />
      <div className="flex">
        <SideBar sidebar={{ toggleSidebar }} />
        <div
          className={`transition-all duration-700 mt-16 py-2 w-full ${
            toggleSidebar ? "ml-16" : "ml-72"
          }`}
        >
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default App;
