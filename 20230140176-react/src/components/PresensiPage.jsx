// src/components/PresensiPage.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import Webcam from 'react-webcam';
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const PresensiPage = () => {
  const [coords, setCoords] = useState(null); // { lat, lng }
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [image, setImage] = useState(null);
  const webcamRef = useRef(null);
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  }, [webcamRef]);


  // Fungsi ambil token dari localStorage (bisa ganti sesuai proyekmu)
  const getToken = () => {
    return localStorage.getItem("token");
  };

  // Fungsi untuk mendapatkan lokasi pengguna
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (err) => {
          setError("Gagal mendapatkan lokasi: " + err.message);
        }
      );
    } else {
      setError("Geolocation tidak didukung oleh browser ini.");
    }
  };

  // Dapatkan lokasi saat komponen dimuat
  useEffect(() => {
    getLocation();
  }, []);

  const buildAuthConfig = () => {
    const token = getToken();
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // Modifikasi handleCheckIn untuk mengirim lokasi
  const handleCheckIn = async () => {
    setError("");
    setMessage("");

    if (!coords || !image) {
      setError("Lokasi dan Foto wajib ada!");
      return;
    }

    try {
      const blob = await (await fetch(image)).blob();
      const formData = new FormData();
      formData.append("latitude", coords.lat);
      formData.append("longitude", coords.lng);
      formData.append("image", blob, "selfie.jpg");

      const authConfig = buildAuthConfig();

      const response = await axios.post(
        "http://localhost:3001/api/presensi/check-in",
        formData,
        {
          ...authConfig,
          headers: {
            ...authConfig.headers,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage(response.data.message || "Check-in berhasil.");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        "Check-in gagal. Silakan coba lagi."
      );
    }
  };

  const handleCheckOut = async () => {
    setError("");
    setMessage("");

    if (!coords) {
      setError("Lokasi belum didapatkan. Mohon izinkan akses lokasi.");
      return;
    }

    try {
      const config = buildAuthConfig();

      const response = await axios.post(
        "http://localhost:3001/api/presensi/check-out",
        {
          latitude: coords.lat,
          longitude: coords.lng,
        },
        config
      );

      setMessage(response.data.message || "Check-out berhasil.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Check-out gagal. Silakan coba lagi."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        {/* Peta di atas card */}
        {coords && (
          <div className="my-4 border rounded-lg overflow-hidden bg-white shadow-md">
            <MapContainer
              center={[coords.lat, coords.lng]}
              zoom={15}
              style={{ height: "300px", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[coords.lat, coords.lng]}>
                <Popup>Lokasi Presensi Anda</Popup>
              </Marker>
            </MapContainer>
          </div>
        )}

        <div className="my-4 border rounded-lg overflow-hidden bg-black">
          {image ? (
            <img src={image} alt="Selfie" className="w-full" />
          ) : (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-full"
            />
          )}
        </div>

        <div className="mb-4">
          {!image ? (
            <button
              onClick={capture}
              className="bg-blue-500 text-white px-4 py-2 rounded w-full"
            >
              Ambil Foto 📸
            </button>
          ) : (
            <button
              onClick={() => setImage(null)}
              className="bg-gray-500 text-white px-4 py-2 rounded w-full"
            >
              Foto Ulang 📸
            </button>
          )}
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md w-full text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            Lakukan Presensi
          </h2>

          {message && (
            <p className="text-green-600 mb-4 font-semibold">{message}</p>
          )}
          {error && (
            <p className="text-red-600 mb-4 font-semibold">{error}</p>
          )}

          <div className="flex space-x-4">
            <button
              onClick={handleCheckIn}
              className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-md shadow-sm hover:bg-green-700 transition"
            >
              Check-In
            </button>
            <button
              onClick={handleCheckOut}
              className="w-full py-3 px-4 bg-red-600 text-white font-semibold rounded-md shadow-sm hover:bg-red-700 transition"
            >
              Check-Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresensiPage;