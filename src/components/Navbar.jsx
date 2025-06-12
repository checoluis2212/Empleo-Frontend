// src/components/Navbar.jsx
import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function Navbar() {
  const { token, role, logout } = useAuth();
  const nav = useNavigate();

  const handleLogout = () => {
    logout();
    nav('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link to="/" className="navbar-brand">
          EmpleoMKT
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMenu"
          aria-controls="navbarMenu"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarMenu">
          {token && (
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink
                  to="/vacantes"
                  className={({ isActive }) =>
                    isActive ? 'nav-link active' : 'nav-link'
                  }
                >
                  Vacantes
                </NavLink>
              </li>

              {role === 'CANDIDATE' && (
                <li className="nav-item">
                  <NavLink
                    to="/postulaciones"
                    className={({ isActive }) =>
                      isActive ? 'nav-link active' : 'nav-link'
                    }
                  >
                    Mis postulaciones
                  </NavLink>
                </li>
              )}

              {role === 'RECRUITER' && (
                <>
                  <li className="nav-item">
                    <NavLink
                      to="/postulaciones-reclutador"
                      className={({ isActive }) =>
                        isActive ? 'nav-link active' : 'nav-link'
                      }
                    >
                      Postulaciones recibidas
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to="/recruiter"
                      className={({ isActive }) =>
                        isActive ? 'nav-link active' : 'nav-link'
                      }
                    >
                      Panel Recruiter
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          )}

          {token && (
            <div className="d-flex">
              <button
                onClick={handleLogout}
                className="btn btn-outline-light"
              >
                Cerrar sesión
              </button>
            </div>
          )}

          {!token && (
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <NavLink
                  to="/auth/login"
                  className={({ isActive }) =>
                    isActive ? 'nav-link active' : 'nav-link'
                  }
                >
                  Iniciar sesión
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/auth/register"
                  className={({ isActive }) =>
                    isActive ? 'nav-link active' : 'nav-link'
                  }
                >
                  Regístrate
                </NavLink>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
