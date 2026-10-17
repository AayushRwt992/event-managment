import React, { useState } from 'react';
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard"; // <-- Add "Dashboard" here

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [role, setRole] = useState(() => localStorage.getItem('role') || 'user');
  const [currentView, setCurrentView] = useState(() => (localStorage.getItem('token') ? 'dashboard' : 'login'));

  const handleLoginSuccess = (newToken, userRole) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('role', userRole);
    setToken(newToken);
    setRole(userRole);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken(null);
    setCurrentView('login');
  };

  if (token && currentView === 'dashboard') {
    return <Dashboard role={role} onLogout={handleLogout} />;
  }

  if (currentView === 'register') {
    return (
      <Register 
        onRegisterSuccess={handleLoginSuccess} 
        onSwitchToLogin={() => setCurrentView('login')} 
      />
    );
  }

  return (
    <Login 
      onLoginSuccess={handleLoginSuccess} 
      onSwitchToRegister={() => setCurrentView('register')} 
    />
  );
}