import React from 'react';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const handleLogin = (e) => {
    e.preventDefault();
    // In a real app, you would handle authentication here
    alert('Logged in successfully (simulation)!');
    // Here you would redirect the user, e.g., history.push('/')
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
          <button type="submit" className="w-full bg-[var(--accent-blue)] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
            Login
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
