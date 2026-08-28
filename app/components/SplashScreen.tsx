"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function SplashScreen() {
  const [visible, setVisible] = useState(false);
  const [hiding, setHiding] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("splashShown")) return;
    sessionStorage.setItem("splashShown", "1");
    setVisible(true);
    const timer = setTimeout(() => {
      setHiding(true);
      setTimeout(() => setVisible(false), 700);
    }, 3200);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <>
      <div className={`splash-root ${hiding ? "splash-hide" : ""}`}>
        {/* Background gradient circles */}
        <div className="splash-circle splash-circle-1" />
        <div className="splash-circle splash-circle-2" />

        {/* Content */}
        <div className="splash-content">
          {/* Logo card */}
          <div className="splash-logo-wrap">
            <Image src="/logo.webp" alt="البلاد" fill className="object-contain" />
          </div>

          {/* Divider */}
          <div className="splash-divider" />

          {/* Text */}
          <h1 className="splash-title">مؤسسة البلاد الحديثة</h1>
          <p className="splash-sub">للإلكترونيات</p>
          <p className="splash-tag">✦ أجهزة إلكترونية بالتقسيط المريح ✦</p>

          {/* Dots loader */}
          <div className="splash-dots">
            <span className="splash-dot" style={{ animationDelay: "0s" }} />
            <span className="splash-dot" style={{ animationDelay: "0.2s" }} />
            <span className="splash-dot" style={{ animationDelay: "0.4s" }} />
          </div>
        </div>
      </div>

      <style>{`
        .splash-root {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(145deg, #0a3540 0%, #155E6F 50%, #0d4a58 100%);
          opacity: 1;
          transition: opacity 0.7s ease;
          overflow: hidden;
        }
        .splash-hide { opacity: 0; pointer-events: none; }

        .splash-circle {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.25;
        }
        .splash-circle-1 {
          width: 400px; height: 400px;
          background: #6DBE00;
          top: -100px; right: -100px;
          animation: floatCircle 4s ease-in-out infinite;
        }
        .splash-circle-2 {
          width: 300px; height: 300px;
          background: #1F7A8C;
          bottom: -80px; left: -80px;
          animation: floatCircle 5s ease-in-out infinite reverse;
        }

        .splash-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
          animation: splashContentIn 0.7s ease both;
          position: relative;
          z-index: 1;
        }

        .splash-logo-wrap {
          position: relative;
          width: 120px; height: 120px;
          background: white;
          border-radius: 28px;
          padding: 12px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1);
          animation: logoPop 0.6s cubic-bezier(0.34,1.56,0.64,1) both;
          margin-bottom: 24px;
        }

        .splash-divider {
          width: 50px; height: 2px;
          background: linear-gradient(90deg, transparent, #6DBE00, transparent);
          margin-bottom: 16px;
          animation: splashFade 0.5s 0.5s ease both;
          opacity: 0;
        }

        .splash-title {
          color: #ffffff;
          font-size: 1.6rem;
          font-weight: 800;
          letter-spacing: 0.5px;
          margin: 0 0 4px;
          text-shadow: 0 2px 20px rgba(0,0,0,0.4);
          animation: splashFade 0.5s 0.6s ease both;
          opacity: 0;
        }

        .splash-sub {
          color: rgba(255,255,255,0.7);
          font-size: 1rem;
          font-weight: 500;
          margin: 0 0 20px;
          animation: splashFade 0.5s 0.7s ease both;
          opacity: 0;
        }

        .splash-tag {
          color: #6DBE00;
          font-size: 0.82rem;
          font-weight: 600;
          letter-spacing: 0.3px;
          background: rgba(109,190,0,0.1);
          border: 1px solid rgba(109,190,0,0.3);
          border-radius: 50px;
          padding: 6px 18px;
          margin-bottom: 32px;
          animation: splashFade 0.5s 0.85s ease both;
          opacity: 0;
        }

        .splash-dots {
          display: flex;
          gap: 8px;
          animation: splashFade 0.5s 1s ease both;
          opacity: 0;
        }
        .splash-dot {
          width: 8px; height: 8px;
          background: #6DBE00;
          border-radius: 50%;
          animation: dotBounce 0.8s ease-in-out infinite;
        }

        @keyframes logoPop {
          from { opacity: 0; transform: scale(0.5) translateY(20px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes splashContentIn {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes splashFade {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatCircle {
          0%, 100% { transform: translate(0, 0); }
          50%       { transform: translate(20px, 20px); }
        }
        @keyframes dotBounce {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50%       { transform: translateY(-8px); opacity: 1; }
        }
      `}</style>
    </>
  );
}
