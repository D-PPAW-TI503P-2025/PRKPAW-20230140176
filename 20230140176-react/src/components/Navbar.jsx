import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // gunakan named import

const API_BASE_URL = "http://localhost:3001";

const getPhotoUrl = (buktiFoto) => {
  if (!buktiFoto) return null;

  // kalau sudah full URL
  if (/^https?:\/\//i.test(buktiFoto)) return buktiFoto;

  // kalau sudah ada /uploads di depannya
  if (buktiFoto.startsWith("/uploads")) {
    return `${API_BASE_URL}${buktiFoto}`;
  }

  // kalau cuma nama file
  return `${API_BASE_URL}/uploads/${buktiFoto}`;
};

const AdminPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterNama, setFilterNama] = useState("");
  const [filterTanggal, setFilterTanggal] = useState("");

  // Cek role admin
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    try {
      const decoded = jwtDecode(token);
      if (decoded.role !== "admin") {
        alert("Akses ditolak! Hanya admin yang bisa membuka halaman ini.");
        window.location.href = "/login";
      }
    } catch (err) {
      console.error(err);
      window.location.href = "/login";
    }
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");

      let url = `${API_BASE_URL}/api/reports/daily`;
      const params = new URLSearchParams();
      if (filterNama) params.append("nama", filterNama);
      if (filterTanggal) params.append("tanggal", filterTanggal);
      if ([...params].length) url += `?${params.toString()}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal mengambil laporan presensi.");
      }

      setReports(data.data || []);
    } catch (err) {
      setError(err.message);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const formatDate = (dateStr) =>
    dateStr
      ? new Date(dateStr).toLocaleString("id-ID", {
          timeZone: "Asia/Jakarta",
        })
      : "-";

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black text-slate-100 flex justify-center items-start py-10 px-4">
      <div className="w-full max-w-6xl bg-slate-900/80 border border-yellow-500/40 rounded-3xl shadow-[0_0_40px_rgba(250,204,21,0.35)] p-6 md:p-8 backdrop-blur">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.6)]">
              🎰 Admin Panel
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              Laporan Presensi.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-600/30 border border-emerald-400/60 text-emerald-200 text-xs uppercase tracking-wide shadow-[0_0_12px_rgba(16,185,129,0.6)]">
              Mode: Admin
            </span>
            <span className="px-3 py-1 rounded-full bg-yellow-600/30 border border-yellow-400/60 text-yellow-200 text-xs uppercase tracking-wide shadow-[0_0_12px_rgba(250,204,21,0.6)]">
              Live Report
            </span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mb-5 flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-[180px] relative">
            <input
              type="text"
              placeholder="🎲 Cari nama pemain..."
              value={filterNama}
              onChange={(e) => setFilterNama(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-700 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/60 text-slate-100 placeholder:text-slate-500 rounded-full px-4 py-2.5 text-sm outline-none shadow-inner"
            />
          </div>
          <div className="flex-none relative">
            <input
              type="date"
              value={filterTanggal}
              onChange={(e) => setFilterTanggal(e.target.value)}
              className="bg-slate-900/80 border border-slate-700 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/60 text-slate-100 rounded-full px-4 py-2.5 text-sm outline-none shadow-inner"
            />
          </div>
          <button
            onClick={fetchReports}
            className="flex-none bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-900 font-semibold px-6 py-2.5 rounded-full shadow-[0_0_18px_rgba(250,204,21,0.8)] transition-transform transform hover:-translate-y-0.5 text-sm"
          >
            💰 Filter
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <p className="text-slate-200 text-sm">Loading...</p>
        ) : error ? (
          <p className="text-red-400 text-sm">{error}</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-yellow-500/40 shadow-[0_0_25px_rgba(15,23,42,0.9)] bg-slate-950/70">
            <table className="w-full text-sm">
              <thead className="bg-gradient-to-r from-yellow-500/90 via-amber-500/90 to-yellow-400/90 text-slate-900">
                <tr>
                  <th className="px-3 py-2.5 text-left font-semibold">ID</th>
                  <th className="px-3 py-2.5 text-left font-semibold">Nama</th>
                  <th className="px-3 py-2.5 text-left font-semibold">Email</th>
                  <th className="px-3 py-2.5 text-left font-semibold">Role</th>
                  <th className="px-3 py-2.5 text-left font-semibold">
                    Check-In
                  </th>
                  <th className="px-3 py-2.5 text-left font-semibold">
                    Check-Out
                  </th>
                  <th className="px-3 py-2.5 text-left font-semibold">
                    Latitude
                  </th>
                  <th className="px-3 py-2.5 text-left font-semibold">
                    Longitude
                  </th>
                  <th className="px-3 py-2.5 text-left font-semibold">
                    Bukti Foto
                  </th>
                </tr>
              </thead>
              <tbody>
                {reports.length === 0 ? (
                  <tr>
                    <td
                      colSpan="9"
                      className="text-center p-5 text-slate-300 bg-slate-900/60"
                    >
                      Tidak ada data presensi.
                    </td>
                  </tr>
                ) : (
                  reports.map((item, idx) => {
                    const photoUrl = getPhotoUrl(item.buktiFoto);

                    return (
                      <tr
                        key={item.id}
                        className={
                          idx % 2 === 0
                            ? "bg-slate-900/70 hover:bg-slate-800/80 transition-colors"
                            : "bg-slate-950/70 hover:bg-slate-800/80 transition-colors"
                        }
                      >
                        <td className="px-3 py-2 border-t border-slate-800 text-slate-200">
                          {item.id}
                        </td>
                        <td className="px-3 py-2 border-t border-slate-800 text-slate-100">
                          {item.user?.nama || "-"}
                        </td>
                        <td className="px-3 py-2 border-t border-slate-800 text-slate-300">
                          {item.user?.email || "-"}
                        </td>
                        <td className="px-3 py-2 border-t border-slate-800">
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-emerald-600/30 border border-emerald-400/60 text-emerald-200">
                            {item.user?.role || "-"}
                          </span>
                        </td>
                        <td className="px-3 py-2 border-t border-slate-800 text-slate-200">
                          {formatDate(item.checkIn)}
                        </td>
                        <td className="px-3 py-2 border-t border-slate-800 text-slate-200">
                          {formatDate(item.checkOut)}
                        </td>
                        <td className="px-3 py-2 border-t border-slate-800 text-amber-300">
                          {item.latitude ?? "-"}
                        </td>
                        <td className="px-3 py-2 border-t border-slate-800 text-amber-300">
                          {item.longitude ?? "-"}
                        </td>
                        <td className="px-3 py-2 border-t border-slate-800">
                          {photoUrl ? (
                            <a
                              href={photoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-block"
                            >
                              <img
                                src={photoUrl}
                                alt="Bukti presensi"
                                className="h-10 w-10 md:h-12 md:w-12 object-cover rounded-lg border border-slate-700"
                              />
                            </a>
                          ) : (
                            <span className="text-slate-500 text-xs">
                              Tidak ada
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
