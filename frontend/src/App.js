import { useState, useEffect, useCallback } from 'react';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ForgotPassword from './components/Auth/ForgotPassword';
import Dashboard from './components/Dashboard/Dashboard';
import authService from './services/authService';
import './App.css';

/**
 * Componente raíz de la aplicación BRIAROS POS.
 * Controla la navegación entre vistas de autenticación y el dashboard.
 */
function App() {
  // Vista activa: 'login' | 'register' | 'forgot' | 'dashboard'
  const [currentView, setCurrentView] = useState('login');
  const [username, setUsername] = useState('');

  // Verificar si hay sesión activa al cargar la app
  useEffect(() => {
    if (authService.isAuthenticated()) {
      setUsername(authService.getUsername());
      setCurrentView('dashboard');
    }
  }, []);

  // ── Handlers de navegación ──
  const handleLogin = useCallback((user) => {
    setUsername(user);
    setCurrentView('dashboard');
  }, []);

  const handleLogout = useCallback(() => {
    authService.logout();
    setUsername('');
    setCurrentView('login');
  }, []);

  const switchToLogin = useCallback(() => setCurrentView('login'), []);
  const switchToRegister = useCallback(() => setCurrentView('register'), []);
  const switchToForgot = useCallback(() => setCurrentView('forgot'), []);

  // ── Render según la vista activa ──
  const renderView = () => {
    switch (currentView) {
      case 'login':
        return (
          <Login
            onLogin={handleLogin}
            onSwitchToRegister={switchToRegister}
            onSwitchToForgot={switchToForgot}
          />
        );
      case 'register':
        return (
          <Register onSwitchToLogin={switchToLogin} />
        );
      case 'forgot':
        return (
          <ForgotPassword onSwitchToLogin={switchToLogin} />
        );
      case 'dashboard':
        return (
          <Dashboard
            username={username}
            onLogout={handleLogout}
          />
        );
      default:
        return null;
    }
  };

  return renderView();
}

export default App;
