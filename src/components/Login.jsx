import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [loading, setLoading] = useState(false);
const navigate = useNavigate();
const handleLogin = () => {
  setLoading(true);

  setTimeout(() => {
    setLoading(false);
    navigate("/dashboard"); // 👈 ONLY CHANGE
  }, 2000);
};


  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#eaf3ff] px-4"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <div className="w-full max-w-6xl min-h-[560px] bg-white rounded-3xl shadow-xl overflow-hidden flex">

        {/* LEFT BLUE PANEL */}
        <div className="hidden md:flex w-1/2 relative bg-gradient-to-b from-[#4fa3ff] to-[#2f80ed]">
          <svg
            className="absolute top-0 left-0 w-full"
            viewBox="0 0 500 150"
            preserveAspectRatio="none"
          >
            <path
              d="M0,80 C150,120 350,0 500,60 L500,0 L0,0 Z"
              fill="#6fb9ff"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <div className="text-6xl font-bold mb-2">Z</div>
            <div className="tracking-widest text-sm font-semibold">
              ZEGGO
            </div>

            <p className="absolute bottom-6 px-12 text-[11px] opacity-80 text-center">
              Zeggo grocery platform helps you manage your daily orders,
              customers and delivery efficiently.
            </p>
          </div>
        </div>

        {/* RIGHT LOGIN FORM */}
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <div className="w-full max-w-md px-10">
            <h2 className="text-center text-2xl font-semibold text-blue-600">
              Welcome
            </h2>
            <p className="text-center text-xs text-gray-500 mb-8">
              login in to your account to continue
            </p>

            <div className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                className="w-full py-3 px-5 rounded-full bg-green-100 text-sm text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />

              <input
                type="password"
                placeholder="Password"
                className="w-full py-3 px-5 rounded-full bg-green-100 text-sm text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />

              <div className="text-right text-xs text-gray-400 cursor-pointer">
                forgot your password?
              </div>

              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full py-3 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 
                text-white text-sm font-semibold flex items-center justify-center gap-2
                transition-all duration-300 hover:scale-[1.02] active:scale-95"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  "LOG IN"
                )}
              </button>
            </div>

            <p className="text-center text-xs text-gray-400 mt-6">
              Don’t have an account?
              <span className="text-blue-500 ml-1 cursor-pointer">
                Sign Up
              </span>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
