import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout = ({ onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeComponent, setActiveComponent] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar open by default as per user preference

  // Update active component based on current route
  useEffect(() => {
    const path = location.pathname.split("/")[2]; // Extract component name from /dashboard/component
    if (path) {
      setActiveComponent(path);
    } else {
      setActiveComponent("dashboard");
    }
  }, [location]);

  const handleNavigation = (itemId) => {
    setActiveComponent(itemId);
    navigate(`/dashboard/${itemId}`);
  };

  return (
    <div className="flex h-screen bg-[#464859]">
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full bg-[#3a3a4b] border-r border-gray-600 z-20 transition-all duration-300 ${
        isSidebarOpen ? "w-56" : "w-20"
      }`}>
        <Sidebar 
          activeComponent={activeComponent} 
          setActiveComponent={handleNavigation} 
          onLogout={onLogout}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </div>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 pt-14 h-screen ${
        isSidebarOpen ? "ml-56" : "ml-20"
      }`}>
        <main className="flex-1 overflow-y-auto bg-[#464859] h-full scrollbar-hide">
          {/* Pass activeComponent to Outlet so child routes can access it */}
          <Outlet context={[activeComponent, setActiveComponent]} />
        </main>
      </div>
    </div>
  );
};

export default Layout;