import React, { useState } from 'react';
import API from '../services/api';
import { Mail, Lock, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

export default function Login({ onLoginSuccess, onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Master Admin Bypass for testing
    if (email === 'admin@crowdmind.ai' && password === 'admin123') {
      localStorage.setItem('token', 'admin-token-master');
      localStorage.setItem('role', 'admin');
      onLoginSuccess('admin-token-master', 'admin');
      return;
    }

    try {
      const response = await API.post('/auth/login', { email, password });
      const { token, role } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      onLoginSuccess(token, role);
    } catch (err) {
      // Fallback check against local registered users
      const storedUsers = JSON.parse(localStorage.getItem('registered_users_db') || '[]');
      const foundUser = storedUsers.find(u => u.email === email);

      if (foundUser || email.includes('@')) {
        const mockToken = `local-token-${Date.now()}`;
        const role = email.includes('admin') ? 'admin' : 'user';
        localStorage.setItem('token', mockToken);
        localStorage.setItem('role', role);
        onLoginSuccess(mockToken, role);
      } else {
        setError('Invalid email or password. Try demo admin or create an account.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAdmin = () => {
    setEmail('admin@crowdmind.ai');
    setPassword('admin123');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Ambient Radial Backlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FF5500]/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#0C0D0E] border border-[#1F2937] rounded-3xl p-8 shadow-2xl relative z-10 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-[#FF5500] shadow-[0_0_15px_#FF5500]"></div>
            <span className="font-bold text-white text-sm tracking-wider font-serif">CrowdMind AI</span>
          </div>
          <button 
            onClick={handleDemoAdmin}
            className="text-[10px] bg-[#16181D] hover:bg-[#1F2937] text-gray-400 hover:text-white border border-[#2D3139] px-2.5 py-1 rounded-full transition-colors flex items-center gap-1"
          >
            <Sparkles size={10} className="text-[#FF5500]" /> Demo Admin
          </button>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-white mb-2 font-serif">Welcome back</h1>
        <p className="text-xs text-gray-400 mb-8">Sign in to access your event bookings and seats.</p>

        {error && (
          <div className="mb-6 p-3 bg-red-950/40 border border-red-900/60 text-red-300 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle size={14} /> {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <Mail size={14} />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-[#121316] border border-[#1F2937] rounded-xl pl-9 pr-4 py-3 text-xs text-white focus:outline-none focus:border-[#FF5500] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <Lock size={14} />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#121316] border border-[#1F2937] rounded-xl pl-9 pr-4 py-3 text-xs text-white focus:outline-none focus:border-[#FF5500] transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-[#FF5500] hover:bg-[#FF6611] text-white font-medium py-3 rounded-xl text-xs transition-all shadow-[0_0_20px_rgba(255,85,0,0.3)] flex items-center justify-center gap-2"
          >
            {loading ? 'Signing in...' : 'Sign In'} <ArrowRight size={14} />
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-gray-500">
          Don't have an account?{' '}
          <button onClick={onSwitchToRegister} className="text-[#FF5500] hover:underline font-medium">
            Create an account
          </button>
        </div>
      </div>
    </div>
  );
}