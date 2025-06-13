// src/pages/RecruiterApplications.jsx
import React from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function RecruiterApplications() {
  const { token, role } = useAuth();
  const [apps, setApps] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (role !== "RECRUITER") return;
    async function fetchApps() {
      setIsLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/applications/recruiter`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      if (res.ok) {
        setApps(await res.json());
      } else {
        setApps([]);
      }
      setIsLoading(false);
    }
    fetchApps();
  }, [token, role]);

  if (role !== "RECRUITER") {
    return <div>No tienes permiso para ver esto.</div>;
  }
  if (isLoading) return <div>Cargando postulaciones...</div>;
  if (!apps.length) return <div>No hay postulaciones recibidas.</div>;

  return (
    <div>
      <h3>Postulaciones recibidas</h3>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Candidato (userId)</th>
            <th>Vacante</th>
            <th>CV</th>
            <th>Status</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {apps.map((app) => (
            <tr key={app.id}>
              <td>{app.userId}</td>
              <td>{app.vacancy?.title || app.vacancyId}</td>
              <td>
                {app.resumeUrl ? (
                  <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer">
                    Ver CV
                  </a>
                ) : (
                  "Sin CV"
                )}
              </td>
              <td>{app.status}</td>
              <td>{app.createdAt ? new Date(app.createdAt).toLocaleString() : ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
