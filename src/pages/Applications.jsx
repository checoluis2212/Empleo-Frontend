// src/pages/Applications.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Applications() {
  const { token, role } = useAuth();
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token || role !== 'CANDIDATE') return;

    const fetchApplications = async () => {
      setIsLoading(true);
      setError('');
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/applications`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Error cargando postulaciones');
        }
        const data = await res.json();
        setApplications(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [token, role]);

  if (!token) {
    return (
      <div className="mt-5 text-danger">
        Debes iniciar sesión como candidato para ver tus postulaciones.
      </div>
    );
  }

  if (role !== 'CANDIDATE') {
    return (
      <div className="mt-5 text-warning">
        Solo los candidatos pueden ver esta sección.
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Mis postulaciones</h2>
      {isLoading && <p>Cargando postulaciones…</p>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!isLoading && !error && (
        <>
          {applications.length === 0 ? (
            <div className="alert alert-info">Aún no tienes postulaciones.</div>
          ) : (
            <div className="row">
              {applications.map((app) => (
                <div key={app.id} className="col-md-6 col-lg-4 mb-4">
                  <div className="card h-100">
                    <div className="card-body">
                      <h5 className="card-title">{app.vacancy?.title || 'Vacante eliminada'}</h5>
                      <p className="card-text">
                        <strong>Empresa:</strong> {app.vacancy?.company || 'N/A'}<br />
                        <strong>Ubicación:</strong> {app.vacancy?.location || 'N/A'}
                      </p>
                      <p className="card-text">
                        <strong>Estado:</strong> {app.status}
                      </p>
                      <p className="card-text">
                        <small className="text-muted">
                          Postulado: {app.createdAt ? new Date(app.createdAt).toLocaleString() : 'N/A'}
                        </small>
                      </p>
                      {app.resumeUrl && (
                        <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-link btn-sm">
                          Ver CV adjunto
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
