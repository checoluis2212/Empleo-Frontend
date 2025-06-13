// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

/**
 * En localStorage guardaremos:
 *    - token (string)
 *    - role  (string): 'CANDIDATE' o 'RECRUITER'
 *    - uid   (string): el ID único de Firestore
 */

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [uid, setUid] = useState(null); // <--- NUEVO
  const nav = useNavigate();

  // Al montar, leer de localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    const storedUid = localStorage.getItem('uid'); // <--- NUEVO
    if (storedToken && storedRole && storedUid) {
      setToken(storedToken);
      setRole(storedRole);
      setUid(storedUid); // <--- NUEVO
    }
  }, []);

  // Función para hacer login. Recibe un objeto { email, password }
  async function login({ email, password }) {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Error al iniciar sesión');
    }

    const body = await res.json();
    // body = { token: '...', role: 'CANDIDATE', uid: '...' }
    setToken(body.token);
    setRole(body.role);
    setUid(body.uid); // <--- NUEVO

    localStorage.setItem('token', body.token);
    localStorage.setItem('role', body.role);
    localStorage.setItem('uid', body.uid); // <--- NUEVO
  }

  // Función para hacer logout
  function logout() {
    setToken(null);
    setRole(null);
    setUid(null); // <--- NUEVO
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('uid'); // <--- NUEVO
    nav('/auth/login');
  }

  return (
    <AuthContext.Provider value={{ token, role, uid, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para usar el contexto
export function useAuth() {
  return useContext(AuthContext);
}
