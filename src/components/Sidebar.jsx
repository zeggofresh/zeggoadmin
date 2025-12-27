import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaBox,
  FaFolder,
  FaChartLine,
  FaBell,
  FaImage,
  FaCog,
  FaCreditCard,
  FaTruck,
  FaTruckLoading,
  FaBars,
  FaTimes,
  FaSearch,
  FaTools,
  FaSignOutAlt
} from "react-icons/fa";

const Sidebar = ({ activeComponent, setActiveComponent, onLogout, isSidebarOpen, setIsSidebarOpen }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <FaHome /> },
    { id: "user", label: "User", icon: <FaUser /> },
    { id: "product", label: "Product", icon: <FaBox /> },
    { id: "category", label: "Category", icon: <FaFolder /> },
    { id: "trendingcategory", label: "Trending Category", icon: <FaChartLine /> },
    { id: "notification", label: "Notification", icon: <FaBell /> },
    { id: "banner", label: "Banner", icon: <FaImage /> },
    { id: "appsetting", label: "App Setting", icon: <FaCog /> },
    { id: "payment", label: "Payments", icon: <FaCreditCard /> },
    { id: "paymenthistory", label: "Payment History", icon: <FaCreditCard /> },
    { id: "setting", label: "Setting", icon: <FaTools /> }
  ];

  // Filter menu items for collapsed view (show only icons)
  const filteredMenuItems = isSidebarOpen ? menuItems : menuItems.slice(0, 6);

  return (
    <>
      {/* ================= HEADER ================= */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-[#3a3a4b] border-b border-gray-600 flex items-center justify-between px-4 z-30">
        {/* Left - Moved Zeggo name here */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-lg text-white"
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>

          {/* Logo and Zeggo name moved to left */}
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="w-2 h-2 rounded-full bg-orange-500" />
            </div>
            {isSidebarOpen && (
              // Increased font size for app name from text-lg to text-xl
              <span className="font-semibold text-white text-xl">
                Zeggo
              </span>
            )}
          </div>
        </div>

        {/* Center - Dynamic page title */}
        <div className="hidden md:flex items-center gap-2 text-sm text-gray-300">
          {isSidebarOpen && (
            // Increased font size for page title from font-medium to font-semibold and text-lg
            <span className="font-semibold text-white text-lg capitalize">
              {activeComponent.replace(/([A-Z])/g, ' $1').trim()}
            </span>
          )}
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {isSidebarOpen && (
            <div className="hidden md:flex items-center bg-gray-700 px-3 py-1.5 rounded-md w-48">
              <FaSearch className="text-gray-400 text-sm" />
              <input
                placeholder="Search"
                className="bg-transparent outline-none text-sm px-2 w-full text-white placeholder-gray-400"
              />
            </div>
          )}

          <div className="flex items-center gap-2">
            {isSidebarOpen && (
              <span className="text-sm text-white hidden lg:block">Admin</span>
            )}
            <div className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">
              A
            </div>
          </div>
        </div>
      </header>

      {/* ================= MOBILE SIDEBAR ================= */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden pt-14">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <aside className="relative w-56 bg-[#3a3a4b] h-full border-r border-gray-600">
            <SidebarMenu
              menuItems={menuItems}
              activeComponent={activeComponent}
              setActiveComponent={setActiveComponent}
              closeMenu={() => setIsMobileMenuOpen(false)}
              onLogout={onLogout}
              isSidebarOpen={true} // Always expanded in mobile
            />
          </aside>
        </div>
      )}

      {/* ================= DESKTOP SIDEBAR ================= */}
      <SidebarMenu
        menuItems={filteredMenuItems}
        activeComponent={activeComponent}
        setActiveComponent={setActiveComponent}
        onLogout={onLogout}
        isSidebarOpen={isSidebarOpen}
      />

      {/* Spacer to maintain layout */}
      <div className="hidden md:block flex-shrink-0" style={{ width: isSidebarOpen ? '14rem' : '5rem' }} />
    </>
  );
};

const SidebarMenu = ({
  menuItems,
  activeComponent,
  setActiveComponent,
  onLogout,
  closeMenu,
  isSidebarOpen = true
}) => (
  <div className="flex flex-col h-full pt-14">
    <nav className="px-2 py-4 space-y-1">
      {menuItems.map(item => (
        <button
          key={item.id}
          onClick={() => {
            setActiveComponent(item.id);
            closeMenu && closeMenu();
          }}
          className={`relative flex items-center gap-3 px-4 py-2 text-sm w-full rounded-md transition-all
            ${
              activeComponent === item.id
                ? "bg-blue-500 text-white font-medium"
                : "text-gray-300 hover:bg-gray-700"
            }`}
          title={!isSidebarOpen ? item.label : ""}
        >
          {activeComponent === item.id && (
            <span className="absolute left-0 top-0 h-full w-1 bg-blue-600 rounded-r" />
          )}
          <span className="text-base">{item.icon}</span>
          {isSidebarOpen && (
            <span className="whitespace-nowrap overflow-hidden">
              {item.label}
            </span>
          )}
        </button>
      ))}
    </nav>

    <div className="mt-auto p-4 border-t border-gray-600">
      <button
        onClick={onLogout}
        className="flex items-center gap-3 text-sm text-red-400 hover:bg-red-900 px-4 py-2 rounded-md w-full"
      >
        <FaSignOutAlt />
        {isSidebarOpen && <span>Logout</span>}
      </button>
    </div>
  </div>
);

export default Sidebar;