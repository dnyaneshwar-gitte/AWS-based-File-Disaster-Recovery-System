import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', plan: 'free' });
  const navigate = useNavigate();

  // ✅ Redirect to dashboard if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) navigate('/');
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/signup', form);
      alert('Signup successful');
      navigate('/login');
    } catch (err) {
  console.error('Signup error:', err.response?.data || err.message);
  alert(err.response?.data?.message || 'Signup failed');
}
  };

  return (
    <div className="form-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <input name="name" placeholder="Name" required onChange={handleChange} />
        <input name="email" type="email" placeholder="Email" required onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" required onChange={handleChange} />
        <select name="plan" onChange={handleChange}>
          <option value="free">Free</option>
          <option value="premium_1m">Premium 1 Month</option>
          <option value="premium_3m">Premium 3 Months</option>
        </select>
        <button type="submit">Signup</button>
      </form>
    </div>
  );
}
