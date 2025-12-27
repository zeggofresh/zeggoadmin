import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Login from "./components/Login";
import Layout from "./components/Layout";

// Import all the new components
import DashboardContent from "./components/dashboard/Dashboard";
import User from "./components/user/User";
import Product from "./components/product/Product";
import Category from "./components/category/Category";
import TrendingCategory from "./components/trendingcategory/TrendingCategory";
import Notification from "./components/notification/Notification";
import Banner from "./components/banner/Banner";
import AppSetting from "./components/appsetting/AppSetting";
import Payment from "./components/payment/Payment";
import PaymentHistory from "./components/paymenthistory/PaymentHistory";
import Setting from "./components/setting/Setting";

function App() {
  return (
    <Router>
      <Routes>
        {/* Login page (NO sidebar) */}
        <Route path="/login" element={<Login />} />

        {/* All protected pages WITH sidebar - using nested routes */}
        <Route path="/dashboard" element={<Layout />}>
          {/* Default dashboard route */}
          <Route index element={<DashboardContent />} />
          {/* Individual component routes */}
          <Route path="user" element={<User />} />
          <Route path="product" element={<Product />} />
          <Route path="category" element={<Category />} />
          <Route path="trendingcategory" element={<TrendingCategory />} />
          <Route path="notification" element={<Notification />} />
          <Route path="banner" element={<Banner />} />
          <Route path="appsetting" element={<AppSetting />} />
          <Route path="payment" element={<Payment />} />
          <Route path="paymenthistory" element={<PaymentHistory />} />
          <Route path="setting" element={<Setting />} />
          {/* Redirect /dashboard/dashboard to /dashboard */}
          <Route path="dashboard" element={<Navigate to="/dashboard" />} />
        </Route>

        {/* Default */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;