import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    alert('Logged out');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <h2>☁️ Axiona</h2>
      <div className="links">
        {token && (
          <>
            <Link to="/">Dashboard</Link>
            <Link to="/upload">Upload</Link>
            <Link to="/recover">Recover</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
        {!token && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}
