import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { RoomProvider } from './context/RoomContext';
import { PlayerProvider } from './context/PlayerContext';
import axios from 'axios';

// ✅ Set base URL depending on environment
axios.defaults.baseURL =
  import.meta.env.MODE === 'production'
    ? 'https://chor-police-backend.onrender.com'
    : '';

ReactDOM.createRoot(document.getElementById('root')).render(
  <PlayerProvider>
    <RoomProvider>
      <App />
    </RoomProvider>
  </PlayerProvider>
);
