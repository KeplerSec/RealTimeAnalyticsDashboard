import React, { useState } from 'react';
import axios from 'axios';
import Dashboard from './components/Dashboard';
import './index.css';

const App = () => {
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    console.log('Bouton Connexion cliqué', { email, password }); // Vérifie l'événement
    try {
      const res = await axios.post('http://localhost:3000/login', { email, password });
      setToken(res.data.token);
      console.log('Token stocké:', res.data.token);
    } catch (err) {
      console.error('Erreur login:', err.message, err.response?.status, err.response?.data);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {!token ? (
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
          <h2 className="text-2xl mb-4">Connexion</h2>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-2 mb-4 border rounded"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            className="w-full p-2 mb-4 border rounded"
          />
          <button
            onClick={login}
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Connexion
          </button>
        </div>
      ) : (
        <Dashboard token={token} />
      )}
    </div>
  );
};

export default App;