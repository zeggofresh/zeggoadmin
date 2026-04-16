import React from "react";
import {
  FaHome,
  FaUser,
  FaBox,
  FaFolder,
  FaChartLine,
  FaBell,
  FaEnvelope,
  FaImage,
  FaCog,
  FaCreditCard,
  FaTruckLoading,
  FaTools,
  FaSignOutAlt,
  FaFileExcel,
} from "react-icons/fa";

const Sidebar = ({
  activeComponent,
  setActiveComponent,
  onLogout,
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  const menuItems = [
    { id: "dashboard",        label: "Dashboard",         icon: <FaHome /> },
    { id: "user",             label: "User",              icon: <FaUser /> },
    { id: "product",          label: "Product",           icon: <FaBox /> },
    { id: "order",            label: "Order",             icon: <FaTruckLoading /> },
    { id: "category",         label: "Category",          icon: <FaFolder /> },
    { id: "subcategory",      label: "Subcategory",       icon: <FaFolder /> },
    { id: "trendingcategory", label: "Trending Category", icon: <FaChartLine /> },
    { id: "notification",     label: "Notification",      icon: <FaBell /> },
    { id: "contactmessages",  label: "Contact Messages",  icon: <FaEnvelope /> },
    { id: "banner",           label: "Banner",            icon: <FaImage /> },
    { id: "appsetting",       label: "App Setting",       icon: <FaCog /> },
    { id: "payment",          label: "Payments",          icon: <FaCreditCard /> },
    { id: "paymenthistory",   label: "Payment History",   icon: <FaCreditCard /> },
    { id: "reports",          label: "Reports",           icon: <FaFileExcel /> },
    { id: "setting",          label: "Setting",           icon: <FaTools /> },
  ];

  const handleClick = (id) => {
    setActiveComponent(id);
    // Mobile pe item click karo toh close
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="flex flex-col h-full">

      {/* ── Logo / Zeggo — click to toggle ── */}
      <div className="flex-shrink-0 border-b border-gray-600 bg-[#3a3a4b]">
        <button
          onClick={() => setIsSidebarOpen((prev) => !prev)}
          className={`flex items-center gap-2 w-full p-4 hover:opacity-80 transition-opacity
            ${!isSidebarOpen ? "justify-center" : ""}
          `}
        >
          {/* Dots always visible */}
          <div className="flex gap-1 flex-shrink-0">
            <span className="w-2 h-2 bg-blue-500 rounded-full" />
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="w-2 h-2 bg-orange-500 rounded-full" />
          </div>
          {/* Zeggo text only when open */}
          {isSidebarOpen && (
            <span className="text-white font-semibold text-lg whitespace-nowrap">
              Zeggo
            </span>
          )}
        </button>
      </div>

      {/* ── Nav Menu ── */}
      <nav
        className="flex-1 px-2 py-4 space-y-1 overflow-y-auto"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style>{`nav::-webkit-scrollbar { display: none; }`}</style>

        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleClick(item.id)}
            title={!isSidebarOpen ? item.label : ""}
            className={`
              relative flex items-center gap-3 px-3 py-2 w-full text-sm rounded-md
              transition-all duration-150 outline-none
              ${activeComponent === item.id
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"}
              ${!isSidebarOpen ? "justify-center" : ""}
            `}
          >
            {activeComponent === item.id && (
              <span className="absolute left-0 top-0 h-full w-1 bg-blue-400 rounded-r" />
            )}
            <span className="flex-shrink-0 text-base">{item.icon}</span>
            {isSidebarOpen && (
              <span className="whitespace-nowrap overflow-hidden text-ellipsis text-left">
                {item.label}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* ── Logout ── */}
      <div className="flex-shrink-0 p-3 border-t border-gray-600 bg-[#3a3a4b]">
        <button
          onClick={onLogout}
          title={!isSidebarOpen ? "Logout" : ""}
          className={`
            flex items-center gap-2 text-red-400 hover:bg-red-900/40 hover:text-red-300
            px-3 py-2 rounded-md w-full transition-all duration-150
            ${!isSidebarOpen ? "justify-center" : ""}
          `}
        >
          <FaSignOutAlt className="flex-shrink-0" />
          {isSidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;