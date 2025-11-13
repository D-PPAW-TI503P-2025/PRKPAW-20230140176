// LoginPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post(
        'http://localhost:3001/api/auth/login',
        { email, password }
      );

      const token = response.data.token;
      localStorage.setItem('token', token);

      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Login gagal, periksa kembali email dan password.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 flex items-center justify-center px-4">
      {/* Neon blobs */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="w-72 h-72 bg-cyan-500/30 rounded-full blur-3xl absolute -top-10 -left-10" />
        <div className="w-80 h-80 bg-emerald-500/25 rounded-full blur-3xl absolute bottom-0 right-0" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-gradient-to-br from-cyan-500/80 via-slate-900/95 to-slate-950 rounded-3xl p-[1px] shadow-[0_0_40px_rgba(34,211,238,0.5)] border border-cyan-500/50">
          <div className="bg-slate-950/95 rounded-3xl px-8 py-7">
            {/* Header */}
            <div className="flex flex-col items-center mb-6">
              <div className="h-11 w-11 rounded-2xl bg-slate-900 border border-cyan-400/70 flex items-center justify-center shadow-lg shadow-cyan-900/70 mb-3">
                <span className="text-[10px] font-semibold tracking-[0.25em] text-cyan-400">
                  SP
                </span>
              </div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-cyan-400/80 mb-1">
                SILAKAN LOGIN TERLEBIH DAHULU
              </p>
              <h2 className="text-3xl font-extrabold text-slate-50 drop-shadow-[0_0_12px_rgba(34,211,238,0.7)]">
                Login
              </h2>
              <p className="text-[12px] text-slate-400 mt-2 text-center">
                Autentikasi untuk mengakses{' '}
                <span className="text-cyan-300 font-semibold">
                  SIMPRAK Dashboard
                </span>{' '}
                versi robotic modern.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-slate-300 mb-1.5 tracking-wide"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  placeholder="contoh@kampus.ac.id"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-sm text-slate-50 placeholder:text-slate-500 shadow-inner shadow-black/70 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-slate-300 mb-1.5 tracking-wide"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-sm text-slate-50 placeholder:text-slate-500 shadow-inner shadow-black/70 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition"
                />
              </div>

              {/* Error */}
              {error && (
                <p className="text-[11px] text-center text-rose-400 bg-rose-950/40 border border-rose-700/60 rounded-lg px-3 py-1.5">
                  {error}
                </p>
              )}

              {/* Button */}
              <button
                type="submit"
                className="w-full py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-emerald-500 text-slate-950 shadow-lg shadow-cyan-900/70 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-cyan-400 focus:ring-offset-slate-950 transition"
              >
                Enter System
              </button>
            </form>

            {/* Link Register */}
            <p className="mt-5 text-[11px] text-center text-slate-400">
              Belum terdaftar?{' '}
              <Link
                to="/register"
                className="font-semibold text-cyan-300 hover:text-cyan-200 underline underline-offset-4"
              >
                Buat akun baru
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-3 text-[10px] text-center text-slate-500">
          Dark Robotic Modern · SIMPRAK Auth Module
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
