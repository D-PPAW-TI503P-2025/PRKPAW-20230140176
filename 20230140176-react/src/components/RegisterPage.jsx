// RegisterPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function RegisterPage() {
  const [name, setName] = useState('');
  const [role, setRole] = useState('mahasiswa','Admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    try {
      await axios.post('http://localhost:3001/api/auth/register', {
        nama: name,
        role,
        email,
        password,
      });

      setSuccessMsg('Registrasi berhasil. Akun baru siap di-autentikasi.');
      setTimeout(() => {
        navigate('/login');
      }, 1200);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Registrasi gagal, pastikan data yang diisi sudah benar.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 flex items-center justify-center px-4">
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="w-72 h-72 bg-emerald-500/25 rounded-full blur-3xl absolute -top-12 right-0" />
        <div className="w-80 h-80 bg-sky-500/25 rounded-full blur-3xl absolute bottom-0 left-0" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-gradient-to-br from-sky-500/80 via-slate-900/95 to-slate-950 rounded-3xl p-[1px] shadow-[0_0_40px_rgba(56,189,248,0.5)] border border-sky-500/50">
          <div className="bg-slate-950/95 rounded-3xl px-8 py-7">
            {/* Header */}
            <div className="flex flex-col items-center mb-6">
              <div className="flex items-center gap-2 mb-1">
                <div className="h-9 w-9 rounded-xl bg-slate-900 border border-cyan-400/70 flex items-center justify-center shadow-md shadow-cyan-900/70">
                  <span className="text-[10px] font-semibold text-cyan-300 tracking-[0.18em]">
                    SP
                  </span>
                </div>
                <span className="text-[11px] uppercase tracking-[0.3em] text-sky-300/80">
                  Node · Register
                </span>
              </div>
              <h2 className="text-3xl font-extrabold text-slate-50 drop-shadow-[0_0_12px_rgba(56,189,248,0.7)]">
                Register
              </h2>
              <p className="text-[12px] text-slate-400 mt-2 text-center">
                Daftarkan identitasmu dan tentukan peran sebagai{' '}
                <span className="text-cyan-300 font-semibold">Mahasiswa</span> atau{' '}
                <span className="text-emerald-300 font-semibold">Admin</span>.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nama */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs font-semibold text-slate-300 mb-1.5 tracking-wide"
                >
                  Nama Lengkap
                </label>
                <input
                  id="name"
                  type="text"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-sm text-slate-50 placeholder:text-slate-500 shadow-inner shadow-black/70 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition"
                  placeholder="Masukkan nama lengkap"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {/* Role */}
              <div>
                <label
                  htmlFor="role"
                  className="block text-xs font-semibold text-slate-300 mb-1.5 tracking-wide"
                >
                  Role
                </label>
                <select
                  id="role"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-sm text-slate-50 shadow-inner shadow-black/70 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option value="mahasiswa">Mahasiswa · Client Node</option>
                  <option value="admin">Admin · Control Node</option>
                </select>
              </div>

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
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-sm text-slate-50 placeholder:text-slate-500 shadow-inner shadow-black/70 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition"
                  placeholder="contoh@kampus.ac.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
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
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-sm text-slate-50 placeholder:text-slate-500 shadow-inner shadow-black/70 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition"
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Error / Success */}
              {error && (
                <p className="text-[11px] text-center text-rose-400 bg-rose-950/40 border border-rose-700/60 rounded-lg px-3 py-1.5">
                  {error}
                </p>
              )}
              {successMsg && (
                <p className="text-[11px] text-center text-emerald-300 bg-emerald-950/40 border border-emerald-700/60 rounded-lg px-3 py-1.5">
                  {successMsg}
                </p>
              )}

              {/* Button */}
              <button
                type="submit"
                className="w-full py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500 text-slate-950 shadow-lg shadow-sky-900/70 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-sky-400 focus:ring-offset-slate-950 transition"
              >
                Register Account
              </button>
            </form>

            {/* Link ke Login */}
            <p className="mt-5 text-[11px] text-center text-slate-400">
              Sudah punya akun?{' '}
              <Link
                to="/login"
                className="font-semibold text-sky-300 hover:text-sky-200 underline underline-offset-4"
              >
                Kembali ke Login
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-3 text-[10px] text-center text-slate-500">
          Dark Robotic Modern · Registration Node
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
