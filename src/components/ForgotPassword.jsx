import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setEmailSent(true);
      
      // Reset after showing success message
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    }, 2000);
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
              Reset your password to regain access to your Zeggo admin account.
            </p>
          </div>
        </div>

        {/* RIGHT FORGOT PASSWORD FORM */}
        <div className="w-full lg:w-1/2 flex items-center justify-center">
          <div className="w-full max-w-md px-6 sm:px-10 py-8 sm:py-0">
            <h2 className="text-center text-2xl font-semibold text-blue-400">
              Forgot Password?
            </h2>
            
            {!emailSent ? (
              <>
                <p className="text-center text-xs text-gray-300 mb-8">
                  enter your email to receive password reset instructions
                </p>

                <div className="space-y-4">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full py-3 px-5 rounded-full bg-gray-700 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />

                  <button
                    onClick={handleResetPassword}
                    disabled={loading}
                    className="w-full py-3 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 
                    text-white text-sm font-semibold flex items-center justify-center gap-2
                    transition-all duration-300 hover:scale-[1.02] active:scale-95"
                  >
                    {loading ? (
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      "Send Reset Link"
                    )}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Email Sent!
                </h3>
                <p className="text-sm text-gray-300 mb-4">
                  Check your inbox for password reset instructions.
                </p>
                <p className="text-xs text-gray-400">
                  Redirecting to login...
                </p>
              </div>
            )}

            <p className="text-center text-xs text-gray-400 mt-6">
              Remember your password?
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

export default ForgotPassword;
