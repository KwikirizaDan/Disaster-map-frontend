import React from 'react';
import { Link } from 'react-router-dom';

const RegistrationPage = () => {
  const handleRegister = (e) => {
    e.preventDefault();
    // In a real app, you would handle registration here
    alert('Registration successful (simulation)!');
  };

  return (
    <div className="bg-[var(--dark-bg)] text-white flex items-center justify-center h-screen">
      <div className="bg-[var(--main-container-bg)] p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-center mb-6">
          <span className="material-icons text-[var(--accent-green)] text-6xl">public</span>
        </div>
        <h2 className="text-2xl font-bold text-center mb-2">Create an Account</h2>
        <p className="text-center text-[var(--text-secondary)] mb-6">Join EnviroMon today!</p>
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Full Name</label>
            <input type="text" id="name" name="name" required className="w-full bg-[var(--surface-2)] border border-[var(--border-color)] rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Email</label>
            <input type="email" id="email" name="email" required className="w-full bg-[var(--surface-2)] border border-[var(--border-color)] rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Password</label>
            <input type="password" id="password" name="password" required className="w-full bg-[var(--surface-2)] border border-[var(--border-color)] rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Confirm Password</label>
            <input type="password" id="confirmPassword" name="confirmPassword" required className="w-full bg-[var(--surface-2)] border border-[var(--border-color)] rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <button type="submit" className="w-full bg-[var(--accent-blue)] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
            Create Account
          </button>
        </form>
        <p className="text-center text-sm text-[var(--text-secondary)] mt-6">
          Already have an account? <Link to="/login" className="text-[var(--accent-blue)] hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegistrationPage;
