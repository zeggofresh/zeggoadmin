import React, { useEffect, useState } from "react";

// ── Inline cart SVG — no react-icons import needed, zero 504 errors ──
const CartIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#60a5fa"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const LoadingAnimation = () => {
  const [progress, setProgress] = useState(0);
  const [currentText, setCurrentText] = useState(0);

  const loadingTexts = [
    "Syncing inventory data...",
    "Loading product catalog...",
    "Fetching order history...",
    "Preparing your dashboard...",
  ];

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        const remaining = 100 - prev;
        return prev + remaining * 0.03 + 0.3;
      });
    }, 40);

    const textInterval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % loadingTexts.length);
    }, 1800);

    return () => {
      clearInterval(progressInterval);
      clearInterval(textInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d1117]">

      {/* Ambient background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute rounded-full"
          style={{
            width: 500,
            height: 500,
            top: "10%",
            left: "15%",
            background: "radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)",
            animation: "orbDrift1 8s ease-in-out infinite",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 400,
            height: 400,
            bottom: "10%",
            right: "15%",
            background: "radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 70%)",
            animation: "orbDrift2 10s ease-in-out infinite",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* Main content */}
      <div
        className="relative flex flex-col items-center"
        style={{ animation: "fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both" }}
      >

        {/* Spinner Assembly */}
        <div className="relative flex items-center justify-center" style={{ width: 120, height: 120 }}>

          {/* Outer slow ring */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: "1px solid rgba(59,130,246,0.15)",
              animation: "spinSlow 6s linear infinite",
            }}
          >
            <div
              className="absolute rounded-full bg-blue-400"
              style={{ width: 6, height: 6, top: -3, left: "50%", marginLeft: -3 }}
            />
          </div>

          {/* Middle ring counter-rotate */}
          <div
            className="absolute rounded-full"
            style={{
              inset: 12,
              border: "1px solid rgba(6,182,212,0.2)",
              animation: "spinReverse 4s linear infinite",
            }}
          >
            <div
              className="absolute rounded-full bg-cyan-400"
              style={{ width: 5, height: 5, bottom: -2.5, left: "50%", marginLeft: -2.5 }}
            />
          </div>

          {/* Gradient arc */}
          <svg
            className="absolute inset-0"
            width="120"
            height="120"
            viewBox="0 0 120 120"
            style={{ animation: "spinFast 1.4s linear infinite" }}
          >
            <defs>
              <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
                <stop offset="60%" stopColor="#3b82f6" stopOpacity="1" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="1" />
              </linearGradient>
            </defs>
            <circle
              cx="60" cy="60" r="44"
              fill="none"
              stroke="url(#arcGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="200 76"
            />
          </svg>

          {/* Inner circle */}
          <div
            className="absolute rounded-full flex items-center justify-center"
            style={{
              inset: 28,
              background: "linear-gradient(135deg, #161b27, #0d1117)",
              border: "1px solid rgba(255,255,255,0.06)",
              boxShadow: "inset 0 1px 3px rgba(0,0,0,0.5), 0 0 20px rgba(59,130,246,0.15)",
              animation: "iconFloat 2.5s ease-in-out infinite",
            }}
          >
            <CartIcon />
          </div>
        </div>

        {/* Text block */}
        <div className="mt-10 text-center" style={{ minWidth: 260 }}>
          <h2
            className="text-white font-semibold"
            style={{ fontSize: 18, letterSpacing: "0.01em", marginBottom: 8 }}
          >
            Preparing Dashboard
          </h2>

          <div style={{ height: 20, overflow: "hidden" }}>
            <p
              key={currentText}
              className="text-center"
              style={{
                fontSize: 13,
                color: "rgba(148,163,184,0.8)",
                margin: 0,
                animation: "textSlide 0.4s cubic-bezier(0.16,1,0.3,1) both",
              }}
            >
              {loadingTexts[currentText]}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-8" style={{ width: 260 }}>
          <div
            className="relative overflow-hidden"
            style={{ height: 3, borderRadius: 99, background: "rgba(255,255,255,0.06)" }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                right: `${100 - progress}%`,
                background: "linear-gradient(90deg, #2563eb, #06b6d4)",
                borderRadius: 99,
                transition: "right 0.1s linear",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                right: `${100 - progress}%`,
                background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)",
                backgroundSize: "60% 100%",
                animation: "shimmer 1.5s linear infinite",
                borderRadius: 99,
              }}
            />
          </div>
          <div
            className="flex justify-between mt-2"
            style={{ fontSize: 11, color: "rgba(100,116,139,0.8)" }}
          >
            <span>Loading</span>
            <span>{Math.min(Math.round(progress), 100)}%</span>
          </div>
        </div>

        {/* Floating dots */}
        <div className="flex gap-2 mt-6">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-full"
              style={{
                width: 4,
                height: 4,
                background: i % 2 === 0 ? "#3b82f6" : "#06b6d4",
                opacity: 0.4,
                animation: `dotPulse 1.4s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes spinFast    { to { transform: rotate(360deg); } }
        @keyframes spinSlow    { to { transform: rotate(360deg); } }
        @keyframes spinReverse { to { transform: rotate(-360deg); } }
        @keyframes iconFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-4px); }
        }
        @keyframes shimmer {
          0%   { background-position: -100% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes dotPulse {
          0%, 80%, 100% { transform: scale(1);   opacity: 0.4; }
          40%            { transform: scale(1.6); opacity: 1;   }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes textSlide {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
        @keyframes orbDrift1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%       { transform: translate(30px, -20px) scale(1.05); }
          66%       { transform: translate(-20px, 15px) scale(0.97); }
        }
        @keyframes orbDrift2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%       { transform: translate(-25px, 20px) scale(1.04); }
          66%       { transform: translate(20px, -15px) scale(0.98); }
        }
      `}</style>
    </div>
  );
};

export default LoadingAnimation;