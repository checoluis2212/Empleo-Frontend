import React, { useState } from 'react'
import { useVacancies } from '../api/vacancies.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Vacancies() {
  const { role, token } = useAuth()
  const { vacancies, isLoading, isError, mutate } = useVacancies()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/vacancies`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
          body: JSON.stringify(form),
        }
      )
      if (!res.ok) {
        const errJson = await res.json()
        return alert(errJson.error || 'Error creando vacante')
      }
      const newVac = await res.json()
      mutate((curr = []) => [newVac, ...curr], { revalidate: false })
      setForm({ title: '', company: '', location: '', description: '' })
      setShowForm(false)
    } catch (err) {
      alert(err.message)
    }
  }

  const handlePostularme = async (vac) => {
    const resumeUrl = prompt("Pega la URL de tu CV (Google Drive, Dropbox, etc):")
    if (!resumeUrl) {
      alert("No se envió la postulación porque falta la URL del CV.")
      return
    }
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/applications`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
          body: JSON.stringify({
            vacancyId: vac.id,
            resumeUrl
          }),
        }
      )
      if (!res.ok) {
        const errJson = await res.json()
        return alert(errJson.error || 'Error al postularte')
      }
      alert(`¡Te postulaste a "${vac.title}" exitosamente!`)
    } catch (err) {
      alert("Error al postularte: " + err.message)
    }
  }

  if (!token) {
    return (
      <div className="mt-5">
        <p className="text-danger">Debes iniciar sesión para ver vacantes.</p>
      </div>
    )
  }

  if (isLoading) return <p>Cargando vacantes…</p>
  if (isError)
    return (
      <p className="text-danger">
        Error cargando vacantes: {isError.message || 'Algo salió mal'}
      </p>
    )

  return (
    <div>
      <h2 className="mb-4">Vacantes</h2>
      {role === 'RECRUITER' && (
        <>
          <button
            onClick={() => setShowForm(!showForm)}
            className="mb-3 btn btn-primary"
          >
            {showForm ? 'Cancelar' : 'Crear vacante'}
          </button>
          {showForm && (
            <form
              onSubmit={handleSubmit}
              className="mb-5 border p-4 rounded shadow-sm"
            >
              <div className="mb-3">
                <input
                  name="title"
                  placeholder="Título"
                  value={form.title}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  name="company"
                  placeholder="Empresa"
                  value={form.company}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  name="location"
                  placeholder="Ubicación"
                  value={form.location}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <textarea
                  name="description"
                  placeholder="Descripción"
                  value={form.description}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <button type="submit" className="btn btn-success">
                Guardar vacante
              </button>
            </form>
          )}
        </>
      )}
      {vacancies.length === 0 ? (
        <p>No hay vacantes disponibles.</p>
      ) : (
        vacancies.map((vac) => (
          <div
            key={vac.id}
            className="border p-4 rounded mb-4 shadow-sm"
          >
            <h5 className="fw-bold">{vac.title}</h5>
            <p className="text-muted">
              {vac.company} — {vac.location}
            </p>
            <p>{vac.description}</p>
            {role === 'CANDIDATE' && (
              <button
                onClick={() => handlePostularme(vac)}
                className="btn btn-outline-success btn-sm"
              >
                Postularme
              </button>
            )}
          </div>
        ))
      )}
    </div>
  )
}
