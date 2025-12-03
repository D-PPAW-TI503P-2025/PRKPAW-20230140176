import React, { useState, useEffect } from "react";
import axios from "axios";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ==== FIX LEAFLET ICON (WAJIB) ====
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

function PresensiPage() {
  const [coords, setCoords] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => setError("Gagal mendapatkan lokasi: " + err.message)
      );
    } else {
      setError("Browser tidak mendukung geolocation.");
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  const handlePresensi = async (type) => {
    if (!coords && type === "check-in")
      return setError("Lokasi belum didapatkan.");

    try {
      const data = {};
      if (type === "check-in") {
        data.latitude = coords.lat;
        data.longitude = coords.lng;
      }

      const url =
        type === "check-in"
          ? "http://localhost:3001/api/presensi/check-in"
          : "http://localhost:3001/api/presensi/check-out";

      const res = await axios.post(url, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage(res.data.message);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          `${type === "check-in" ? "Check-in" : "Check-out"} gagal`
      );
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Presensi Mahasiswa</h2>

      {coords && (
        <MapContainer
          center={[coords.lat, coords.lng]}
          zoom={16}
          style={{ height: "300px", width: "100%", marginBottom: "20px" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[coords.lat, coords.lng]}>
            <Popup>Lokasi Anda</Popup>
          </Marker>
        </MapContainer>
      )}

      {/* Tombol Presensi */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => handlePresensi("check-in")}
          className="flex-1 py-2 px-4 bg-green-600 text-white rounded-md"
        >
          Check-In
        </button>
        <button
          onClick={() => handlePresensi("check-out")}
          className="flex-1 py-2 px-4 bg-red-600 text-white rounded-md"
        >
          Check-Out
        </button>
      </div>

      {message && <p className="text-green-600">{message}</p>}
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}

export default PresensiPage;
