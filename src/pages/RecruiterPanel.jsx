import React from 'react';
import { useRecruiterVacancies } from '../api/vacancies.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function RecruiterPanel() {
  const { vacancies, isLoading, isError } = useRecruiterVacancies();
  const { user } = useAuth();

  return (
    <div>
      <h2>Panel del Reclutador</h2>
      <p>
        {user?.email ? (
          <>Vacantes publicadas por <b>{user.email}</b>:</>
        ) : (
          <>Tus vacantes:</>
        )}
      </p>

      {isLoading && <p>Cargando vacantes…</p>}
      {isError && <p className="text-danger">Error cargando vacantes.</p>}
      {!isLoading && !isError && vacancies.length === 0 && (
        <p>No tienes vacantes publicadas aún.</p>
      )}

      {!isLoading && !isError && vacancies.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Empresa</th>
              <th>Ubicación</th>
              <th>Fecha</th>
              <th>Postulaciones</th>
            </tr>
          </thead>
          <tbody>
            {vacancies.map(vac => (
              <tr key={vac.id}>
                <td>{vac.title}</td>
                <td>{vac.company}</td>
                <td>{vac.location}</td>
                <td>
                  {vac.createdAt && vac.createdAt.seconds
                    ? new Date(vac.createdAt.seconds * 1000).toLocaleString()
                    : ''}
                </td>
                <td>
                  <b>{vac.applicationsCount}</b>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
