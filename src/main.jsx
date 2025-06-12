// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';

// IMPORTANTE: BrowserRouter viene de react-router-dom
import { BrowserRouter } from 'react-router-dom';

import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

// Si quisieras importar Bootstrap desde npm (opcional):
// import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 
      1. BrowserRouter debe envolver a todo el árbol de rutas.
      2. AuthProvider puede ir dentro, pero BrowserRouter siempre debe estar definido.
    */}
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
