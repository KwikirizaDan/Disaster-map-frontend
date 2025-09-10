import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setFeedback('');
    setLoading(true);

    const email = e.target.email.value;
    const password = e.target.password.value;

    const result = await login(email, password);

    if (result.success) {
      navigate('/');
    } else {
      setFeedback(result.message);
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--dark-bg)] text-white flex items-center justify-center h-screen">
      <div className="bg-[var(--main-container-bg)] p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-center mb-6">
          <span className="material-icons text-[var(--accent-green)] text-6xl">public</span>
        </div>
        <h2 className="text-2xl font-bold text-center mb-2">Welcome Back!</h2>
        <p className="text-center text-[var(--text-secondary)] mb-6">Login to your EnviroMon account</p>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Email</label>
            <input type="email" id="email" name="email" required className="w-full bg-[var(--surface-2)] border border-[var(--border-color)] rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Password</label>
            <input type="password" id="password" name="password" required className="w-full bg-[var(--surface-2)] border border-[var(--border-color)] rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          {feedback && <p className="text-center text-sm text-red-500 mb-4">{feedback}</p>}
          <button type="submit" disabled={loading} className="w-full bg-[var(--accent-blue)] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:bg-gray-500">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-center text-sm text-[var(--text-secondary)] mt-6">
          Don't have an account? <Link to="/register" className="text-[var(--accent-blue)] hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
