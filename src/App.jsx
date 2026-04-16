import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './responsive.css'; // Global responsive styles

import Login from "./components/Login";
import Signup from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";
import Layout from "./components/Layout";

// Import all the new components
import DashboardContent from "./components/dashboard/Dashboard";
import User from "./components/user/User";
import Product from "./components/product/Product";
import Order from "./components/order/Order";
import Category from "./components/category/Category";
import Subcategory from "./components/subcategory/Subcategory";
import TrendingCategory from "./components/trendingcategory/TrendingCategory";
import Notification from "./components/notification/Notification";
import ContactMessages from "./components/contactmessages/ContactMessages";
import Banner from "./components/banner/Banner";
import AppSetting from "./components/appsetting/AppSetting";
import Payment from "./components/payment/Payment";
import PaymentHistory from "./components/paymenthistory/PaymentHistory";
import Setting from "./components/setting/Setting";
import Reports from "./components/reports/Reports";

function App() {
  const [theme, setTheme] = useState('dark');

  // Load theme from localStorage on app start
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
  }, []);

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = () => {
    // Clear token and user data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Navigate to login
    window.location.href = '/login';
  };

  return (
    <>
      <Router>
        <Routes>
          {/* Login page (NO sidebar) */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* All protected pages WITH sidebar - using nested routes */}
          <Route path="/dashboard" element={<Layout theme={theme} toggleTheme={toggleTheme} onLogout={handleLogout} />}>
            {/* Default dashboard route */}
            <Route index element={<DashboardContent />} />
            {/* Individual component routes */}
            <Route path="user" element={<User />} />
            <Route path="product" element={<Product />} />
            <Route path="order" element={<Order />} />
            <Route path="category" element={<Category />} />
            <Route path="subcategory" element={<Subcategory />} />
            <Route path="trendingcategory" element={<TrendingCategory />} />
            <Route path="notification" element={<Notification />} />
            <Route path="contactmessages" element={<ContactMessages />} />
            <Route path="banner" element={<Banner />} />
            <Route path="appsetting" element={<AppSetting toggleTheme={toggleTheme} theme={theme} />} />
            <Route path="payment" element={<Payment />} />
            <Route path="paymenthistory" element={<PaymentHistory theme={theme} />} />
            <Route path="setting" element={<Setting />} />
            <Route path="reports" element={<Reports />} />
            {/* Redirect /dashboard/dashboard to /dashboard */}
            <Route path="dashboard" element={<Navigate to="/dashboard" />} />
            {/* Catch-all for unknown routes under /dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Route>

          {/* Default */}
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme}
      />
    </>
  );
}

export default App;