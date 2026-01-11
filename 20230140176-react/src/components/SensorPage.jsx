// src/components/SensorPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function SensorPage() {
  const [chartTH, setChartTH] = useState({ labels: [], datasets: [] });
  const [chartLux, setChartLux] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/iot/history');
      const data = res.data.data;

      const labels = data.map(item =>
        new Date(item.createdAt).toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );

      setChartTH({
        labels,
        datasets: [
          {
            label: 'Suhu (°C)',
            data: data.map(i => i.suhu),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.4)',
            tension: 0.3,
          },
          {
            label: 'Kelembaban (%)',
            data: data.map(i => i.kelembaban),
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.4)',
            tension: 0.3,
          },
        ],
      });

      setChartLux({
        labels,
        datasets: [
          {
            label: 'Cahaya (Lux)',
            data: data.map(i => i.cahaya),
            borderColor: 'rgb(253, 253, 150)',
            backgroundColor: 'rgba(253, 253, 150, 0.5)',
            tension: 0.3,
          },
        ],
      });

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const i = setInterval(fetchData, 5000);
    return () => clearInterval(i);
  }, []);

  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
    },
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-white-500 mb-8">
        Dashboard IoT
      </h1>

      {/* 👇 GRID HORIZONTAL */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Suhu & Kelembaban */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-4 text-black">
            Suhu & Kelembaban
          </h2>

          {loading ? (
            <p className="text-center">Memuat data...</p>
          ) : (
            <div className="h-[380px]">
              <Line
                data={chartTH}
                options={{
                  ...baseOptions,
                  plugins: {
                    ...baseOptions.plugins,
                    title: {
                      display: true,
                      text: 'Monitoring Suhu & Kelembaban',
                    },
                  },
                }}
              />
            </div>
          )}
        </div>

        {/* Cahaya */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-4 text-black">
            Intensitas Cahaya
          </h2>

          {loading ? (
            <p className="text-center">Memuat data...</p>
          ) : (
            <div className="h-[380px]">
              <Line
                data={chartLux}
                options={{
                  ...baseOptions,
                  plugins: {
                    ...baseOptions.plugins,
                    title: {
                      display: true,
                      text: 'Monitoring Cahaya (Lux)',
                    },
                  },
                }}
              />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default SensorPage;