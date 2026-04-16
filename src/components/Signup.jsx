import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/api";
import { toast } from 'react-toastify';

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    setLoading(true);

    try {
      // Get all input values
      const nameInput = document.querySelector('input[type="text"]');
      const emailInput = document.querySelector('input[type="email"]');
      const phoneInput = document.querySelector('input[type="tel"]');
      const passwordInputs = document.querySelectorAll('input[type="password"]');
      
      const name = nameInput.value;
      const email = emailInput.value;
      const phone = phoneInput.value;
      const password = passwordInputs[0].value;
      const confirmPassword = passwordInputs[1].value;

      // Validation
      if (!name || !email || !phone || !password || !confirmPassword) {
        toast.error('Please fill in all fields');
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        toast.error('Passwords do not match!');
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        toast.error('Password must be at least 6 characters long');
        setLoading(false);
        return;
      }

      // Call signup API
      const response = await api.post('/api/zeggo/users/register', {
        name: name,
        email: email,
        phone: phone,
        password: password
      });

      console.log('Signup Response:', response.data);

      // Check if signup was successful
      if (response.data && (response.data.token || response.data.message)) {
        // If token is returned, save it
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        
        toast.success(response.data.message || 'Signup successful! Please login.');
        navigate("/login");
      } else {
        toast.error('Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Signup Error:', error);
      toast.error(error.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#464859] px-2 sm:px-4"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <div className="w-full max-w-6xl min-h-[500px] sm:min-h-[560px] bg-[#464859] rounded-3xl shadow-xl overflow-hidden flex border border-gray-600 my-4 sm:my-0">
        {/* LEFT BLUE PANEL */}
        <div className="hidden lg:flex w-1/2 relative bg-gradient-to-b from-[#4fa3ff] to-[#2f80ed]">
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
              Join Zeggo grocery platform and start managing your business efficiently today.
            </p>
          </div>
        </div>

        {/* RIGHT SIGNUP FORM */}
        <div className="w-full lg:w-1/2 flex items-center justify-center">
          <div className="w-full max-w-md px-6 sm:px-10 py-8 sm:py-0">
            <h2 className="text-center text-2xl font-semibold text-blue-400">
              Create Account
            </h2>
            <p className="text-center text-xs text-gray-300 mb-8">
              sign up to get started with zeggo
            </p>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full py-3 px-5 rounded-full bg-gray-700 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />

              <input
                type="email"
                placeholder="Email"
                className="w-full py-3 px-5 rounded-full bg-gray-700 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />

              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full py-3 px-5 rounded-full bg-gray-700 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />

              <input
                type="password"
                placeholder="Password"
                className="w-full py-3 px-5 rounded-full bg-gray-700 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />

              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full py-3 px-5 rounded-full bg-gray-700 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />

              <button
                onClick={handleSignup}
                disabled={loading}
                className="w-full py-3 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 
                text-white text-sm font-semibold flex items-center justify-center gap-2
                transition-all duration-300 hover:scale-[1.02] active:scale-95"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  "SIGN UP"
                )}
              </button>
            </div>

            <p className="text-center text-xs text-gray-400 mt-6">
              Already have an account?
              <span 
                className="text-blue-400 ml-1 cursor-pointer hover:text-blue-300 font-medium"
                onClick={goToLogin}
              >
                Log In
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
