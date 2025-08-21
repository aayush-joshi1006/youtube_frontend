import { useState } from "react";
import Header from "./components/Header";
import SideBar from "./components/SideBar";
import { Outlet } from "react-router-dom";

function App() {
  const [toggleSidebar, setToggleSidebar] = useState(true);

  return (
    
    <div className="h-screen w-full flex flex-col overflow-hidden transition-colors duration-500">
      {/* Header */}
      <Header sidebar={{ toggleSidebar, setToggleSidebar }} />

      {/* Sidebar + Main Content */}
      <div
        className="
          flex flex-1 mt-16 overflow-hidden
          flex-col-reverse sm:flex-row   /* mobile: sidebar below, desktop: sidebar left */
        "
      >
        {/* Sidebar */}
        <div
          className={`
            transition-all duration-500 shrink-0
            ${toggleSidebar ? "w-16" : "w-72"}
            sm:block hidden   /* hide sidebar by default on mobile */
          `}
        >
          <SideBar sidebar={{ toggleSidebar, setToggleSidebar }} />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>

        {/* Mobile Sidebar (below content) */}
        <div className="block sm:hidden">
          <SideBar sidebar={{ toggleSidebar, setToggleSidebar }} />
        </div>
      </div>
    </div>
  );
}

export default App;
