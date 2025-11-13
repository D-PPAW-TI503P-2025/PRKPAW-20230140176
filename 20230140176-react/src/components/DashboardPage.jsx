// DashboardPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

function DashboardPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 text-slate-50 flex items-center justify-center relative">
      {/* Neon ambient (halus saja) */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="w-72 h-72 bg-cyan-500/25 rounded-full blur-3xl absolute -top-10 left-0" />
        <div className="w-64 h-64 bg-emerald-500/25 rounded-full blur-3xl absolute bottom-0 right-0" />
      </div>

      {/* Tombol Logout di pojok kanan atas */}
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-[11px] font-semibold text-slate-950 shadow-lg shadow-cyan-900/70 border border-cyan-300/40 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-cyan-400 focus:ring-offset-slate-950 transition"
      >
        Logout
      </button>

      {/* Card tengah: Selamat Datang */}
      <div className="relative w-full max-w-md">
        <div className="bg-gradient-to-br from-cyan-500/80 via-slate-900/95 to-slate-950 rounded-3xl p-[1px] shadow-[0_0_35px_rgba(34,211,238,0.55)] border border-cyan-500/50">
          <div className="bg-slate-950/95 rounded-3xl px-8 py-10 flex flex-col items-center justify-center">
            <h1 className="text-3xl font-extrabold text-center drop-shadow-[0_0_12px_rgba(34,211,238,0.7)]">
              Selamat Datang
            </h1>
            <p className="text-[11px] text-slate-400 mt-3 text-center max-w-xs">
              Anda berhasil login.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
