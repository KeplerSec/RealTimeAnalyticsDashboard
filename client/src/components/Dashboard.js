import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { io } from 'socket.io-client';
import axios from 'axios';
import { Chart as ChartJS, LineController, LineElement, PointElement, LinearScale, CategoryScale } from 'chart.js';
import './Dashboard.css';

ChartJS.register(LineController, LineElement, PointElement, LinearScale, CategoryScale);

const Dashboard = ({ token }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const socket = io('http://localhost:3000', {
      transports: ['websocket'],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });
    console.log('Tentative de connexion WebSocket');
    socket.on('connect', () => console.log('WebSocket connecté:', socket.id));
    socket.on('connect_error', (err) => console.error('Erreur WebSocket:', err.message));
    socket.on('disconnect', (reason) => console.log('WebSocket déconnecté:', reason));

    axios.get('/data', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        console.log('Données initiales:', res.data);
        setData(res.data.data);
      })
      .catch(err => console.error('Erreur axios:', err.message, err.response?.status, err.response?.data));

    socket.on('dataUpdate', (update) => {
      console.log('Mise à jour reçue:', update);
      setData(prev => [...prev, ...update.data].slice(-10));
    });

    return () => {
      socket.disconnect();
      ChartJS.instances[0]?.destroy();
    };
  }, [token]);

  const chartData = {
    labels: data.map((_, i) => new Date(Date.now() - (data.length - i - 1) * 5000).toLocaleTimeString()),
    datasets: [{
      label: 'Données en temps réel',
      data: data,
      borderColor: '#3b82f6',
      fill: false
    }]
  };

  const chartOptions = {
    scales: {
      y: { beginAtZero: true },
      x: { 
        type: 'category',
        title: { display: true, text: 'Temps' }
      }
    },
    plugins: {
      legend: { display: true }
    }
  };

  console.log('Chart data:', chartData);

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-3xl text-center mb-4">Tableau de bord</h2>
      <div className="bg-white rounded-lg shadow-lg p-4">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default Dashboard;