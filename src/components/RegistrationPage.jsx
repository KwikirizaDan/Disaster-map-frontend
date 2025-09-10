import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RegistrationPage = () => {
  const { register } = useAuth();
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setFeedback('');
    setLoading(true);

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (password !== confirmPassword) {
      setFeedback('Passwords do not match.');
      setLoading(false);
      return;
    }

    const result = await register(name, email, password);
    setFeedback(result.message);
    setLoading(false);
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
          {feedback && <p className="text-center text-sm text-red-500 mb-4">{feedback}</p>}
          <button type="submit" disabled={loading} className="w-full bg-[var(--accent-blue)] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:bg-gray-500">
            {loading ? 'Creating Account...' : 'Create Account'}
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
