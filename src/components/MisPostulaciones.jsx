import React, { useEffect, useState } from "react";

export default function MisPostulaciones() {
  const [postulaciones, setPostulaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPostulaciones() {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/applications`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (!res.ok) throw new Error("No se pudieron cargar tus postulaciones");
        const data = await res.json();
        setPostulaciones(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPostulaciones();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (postulaciones.length === 0) return <div>No tienes postulaciones aún.</div>;

  return (
    <div className="row">
      {postulaciones.map((post) => (
        <div className="card col-md-4 m-2" key={post.id}>
          <div className="card-body">
            <h5 className="card-title">{post.vacancy?.title || "Sin título"}</h5>
            <p><b>Empresa:</b> {post.vacancy?.company || "N/A"}</p>
            <p><b>Ubicación:</b> {post.vacancy?.location || "N/A"}</p>
            <p><b>Estado:</b> {post.status}</p>
            <p className="text-muted" style={{ fontSize: "0.9em" }}>
              Postulado: {post.createdAt && new Date(post.createdAt).toLocaleString()}
            </p>
            <a href={post.resumeUrl} target="_blank" rel="noopener noreferrer">Ver CV adjunto</a>
          </div>
        </div>
      ))}
    </div>
  );
}
