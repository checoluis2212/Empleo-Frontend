// src/pages/auth/Login.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const nav = useNavigate();
  const [errorMessage, setErrorMessage] = React.useState('');

  const onSubmit = async (data) => {
    try {
      setErrorMessage('');
      await login(data); // data = { email, password }
      nav('/vacantes');
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-5">
        <h1 className="mb-4">Inicia sesión</h1>
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
              {...register('password', { required: true })}
              type="password"
              className="form-control"
              id="password"
              placeholder="********"
            />
            {errors.password && (
              <small className="text-danger">
                La contraseña es obligatoria.
              </small>
            )}
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Iniciar sesión
          </button>
        </form>
        <div className="mt-3 text-center">
          ¿No tienes cuenta?{' '}
          <Link to="/auth/register" className="link-primary">
            Regístrate
          </Link>
        </div>
      </div>
    </div>
  );
}
