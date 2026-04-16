import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout = ({ onLogout, theme, toggleTheme }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeComponent, setActiveComponent] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Closed by default
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);

  // Handle window resize and set initial state
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      // Auto open sidebar on desktop, close on mobile
      if (width >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    // Set initial state
    handleResize();

    // Listen for resize events
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
  }, [navigate]);

  // Update active component based on current route
  useEffect(() => {
    const path = location.pathname.split("/")[2]; // Extract component name from /dashboard/component
    if (path) {
      setActiveComponent(path);
    } else {
      setActiveComponent("dashboard");
    }
  }, [location]);

  // Get display name for current page
  const getPageDisplayName = () => {
    const names = {
      'dashboard': 'Dashboard',
      'user': 'User Management',
      'product': 'Product Management',
      'order': 'Order Management',
      'category': 'Category Management',
      'subcategory': 'Subcategory Management',
      'trendingcategory': 'Trending Category',
      'notification': 'Notifications & Messages',
      'contactmessages': 'Contact Messages',
      'banner': 'Banner Management',
      'appsetting': 'App Settings',
      'payment': 'Payment',
      'paymenthistory': 'Payment History',
      'setting': 'Settings',
      'reports': 'Reports'
    };
    const name = names[activeComponent] || 'Dashboard';
    console.log('Active Component:', activeComponent, 'Display Name:', name);
    return name;
  };

  const handleNavigation = (itemId) => {
    setActiveComponent(itemId);
    navigate(`/dashboard/${itemId}`);
  };

  return (
    <div className="flex h-screen bg-[#464859] overflow-hidden">
      {/* Sidebar Overlay - Mobile only */}
      {isSidebarOpen && windowWidth < 1024 && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full bg-[#3a3a4b] border-r border-gray-600 z-40 transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 lg:static lg:block`}>
        <Sidebar 
          activeComponent={activeComponent} 
          setActiveComponent={handleNavigation} 
          onLogout={onLogout}
          isSidebarOpen={isSidebarOpen && windowWidth >= 1024}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </div>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300 ${
        windowWidth >= 1024 && isSidebarOpen ? 'lg:ml-0' : 'lg:ml-0'
      }`}>
        {/* Top Header Bar */}
        <div className="h-[60.5px] bg-[#3a3a4b] border-b border-gray-600 flex items-center justify-between px-4 flex-shrink-0 relative">
          {/* Mobile Menu Toggle - Only show on mobile/tablet */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden text-white text-lg p-2 hover:bg-gray-700 rounded-lg transition"
          >
            ☰
          </button>
          
          {/* Page Name - Center */}
          <div className="absolute left-1/2 transform -translate-x-1/2 text-center z-10">
            <h1 className="text-xl  text-white whitespace-nowrap drop-shadow-lg">
              {getPageDisplayName()}
            </h1>
          </div>
          
          {/* Theme Toggle & User Info - Right side */}
          <div className="flex items-center gap-3 ml-auto">
          
            <div className="flex items-center gap-2">
              <span className="text-sm text-white hidden sm:block">Admin</span>
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                A
              </div>
            </div>
          </div>
        </div>
        
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden bg-[#464859]">
          <main className="p-4 md:p-6 min-h-full">
            <Outlet context={[activeComponent, setActiveComponent]} />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;