import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function RecruiterApplications() {
  const { token } = useAuth();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carga postulaciones recibidas (de las vacantes del recruiter)
  useEffect(() => {
    async function fetchApps() {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/applications/recruiter`,
        {
          headers: { Authorization: 'Bearer ' + token }
        }
      );
      const data = await res.json();
      setApps(Array.isArray(data) ? data : []);
      setLoading(false);
    }
    if (token) fetchApps();
  }, [token]);

  // Cambiar estado de postulación
  const updateStatus = async (id, status) => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/applications/${id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        },
        body: JSON.stringify({ status })
      }
    );
    if (res.ok) {
      setApps(apps => apps.map(a => a.id === id ? { ...a, status } : a));
    } else {
      alert('Error al cambiar estado');
    }
  };

  if (loading) return <p>Cargando postulaciones…</p>;
  if (!apps.length) return <p>No hay postulaciones recibidas.</p>;

  return (
    <div>
      <h2>Postulaciones Recibidas</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Vacante</th>
            <th>Candidato (ID)</th>
            <th>CV</th>
            <th>Estado</th>
            <th>Cambiar estado</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {apps.map(app => (
            <tr key={app.id}>
              <td>{app.vacancy?.title || app.vacancyId}</td>
              <td>{app.userId}</td>
              <td>
                <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer">
                  Ver CV
                </a>
              </td>
              <td><b>{app.status}</b></td>
              <td>
                <select
                  value={app.status}
                  onChange={e => updateStatus(app.id, e.target.value)}
                  className="form-select"
                  style={{ width: 130 }}
                >
                  <option value="PENDIENTE">PENDIENTE</option>
                  <option value="APROBADO">APROBADO</option>
                  <option value="RECHAZADO">RECHAZADO</option>
                </select>
              </td>
              <td>{app.createdAt && new Date(app.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
