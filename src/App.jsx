import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Home from './pages/Home.jsx';
import Vacancies from './pages/Vacancies.jsx';
import RecruiterPanel from './pages/RecruiterPanel.jsx';
import RecruiterApplications from './pages/RecruiterApplications.jsx';
import Applications from './pages/Applications.jsx';
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import Navbar from './components/Navbar.jsx';

function Layout() {
  const { pathname } = useLocation();
  const hideNavbar = pathname.startsWith('/auth');

  return (
    <>
      {!hideNavbar && <Navbar />}
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vacantes" element={<Vacancies />} />
          <Route path="/recruiter" element={<RecruiterPanel />} />
          <Route path="/postulaciones-reclutador" element={<RecruiterApplications />} />
          <Route path="/postulaciones" element={<Applications />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
        </Routes>
      </div>
    </>
  );
}

export default function App() {
  return <Layout />;
}
