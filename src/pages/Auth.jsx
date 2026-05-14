import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Layers } from 'lucide-react';

export default function Auth({ setToken }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    
    try {
      const { data } = await axios.post(endpoint, formData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setToken(data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-0 text-white font-sans p-4">
      <div className="max-w-md w-full bg-surface-1 p-8 rounded-xl border border-border shadow-2xl">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-accent-blue/10 flex items-center justify-center border border-accent-blue/30">
            <Layers className="w-6 h-6 text-accent-blue" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">TaskFlow</h1>
        </div>

        <h2 className="text-xl font-semibold mb-6 text-center">
          {isLogin ? 'Welcome Back' : 'Create an Account'}
        </h2>

        {error && (
          <div className="bg-accent-red/10 border border-accent-red/30 text-accent-red p-3 rounded-lg mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm text-gray-400 mb-1">Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-surface-2 border border-border rounded-lg px-4 py-2.5 outline-none focus:border-accent-blue transition-colors"
                placeholder="John Doe"
              />
            </div>
          )}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-surface-2 border border-border rounded-lg px-4 py-2.5 outline-none focus:border-accent-blue transition-colors"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-surface-2 border border-border rounded-lg px-4 py-2.5 outline-none focus:border-accent-blue transition-colors"
              placeholder="••••••••"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-accent-blue hover:bg-blue-600 text-white font-medium py-2.5 rounded-lg transition-colors mt-2"
          >
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="text-accent-blue hover:underline font-medium"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
}
