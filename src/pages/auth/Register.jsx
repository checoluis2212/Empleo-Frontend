// src/pages/auth/Register.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [errorMessage, setErrorMessage] = React.useState('');
  const nav = useNavigate();

  // Detecta utm_source/utm_medium o asigna 'direct'
  function getSignupSource() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('utm_source')) {
      return params.get('utm_source');
    }
    if (params.get('utm_medium')) {
      return params.get('utm_medium');
    }
    return 'direct'; // Valor por defecto si no hay nada
  }

  const onSubmit = async (data) => {
    try {
      setErrorMessage('');
      // Añadir signupSource (fuente/medio)
      const payload = {
        ...data,
        signupSource: getSignupSource(),
      };
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Error al registrarse');
      }

      alert('¡Registrado correctamente! Puedes iniciar sesión.');
      nav('/auth/login');
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-5">
        <h1 className="mb-4">Regístrate</h1>
        {errorMessage && (
          <div className="alert alert-danger">{errorMessage}</div>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Correo electrónico
            </label>
            <input
              {...register('email', { required: true })}
              type="email"
              className="form-control"
              id="email"
              placeholder="usuario@ejemplo.com"
            />
            {errors.email && (
              <small className="text-danger">El email es obligatorio.</small>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
            <input
              {...register('password', { required: true, minLength: 8 })}
              type="password"
              className="form-control"
              id="password"
              placeholder="Mín. 8 caracteres"
            />
            {errors.password && (
              <small className="text-danger">
                La contraseña debe tener al menos 8 caracteres.
              </small>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="role" className="form-label">
              Selecciona rol
            </label>
            <select
              {...register('role', { required: true })}
              id="role"
              className="form-select"
            >
              <option value="">--Selecciona rol--</option>
              <option value="CANDIDATE">Candidato</option>
              <option value="RECRUITER">Reclutador</option>
            </select>
            {errors.role && (
              <small className="text-danger">El rol es obligatorio.</small>
            )}
          </div>

          <button type="submit" className="btn btn-success w-100">
            Crear cuenta
          </button>
        </form>
        <div className="mt-3 text-center">
          ¿Ya tienes cuenta?{' '}
          <Link to="/auth/login" className="link-primary">
            Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
