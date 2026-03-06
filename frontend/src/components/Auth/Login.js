import { useState } from 'react';
import authService from '../../services/authService';
import Modal from '../UI/Modal';
import './Login.css';

/**
 * Componente de inicio de sesión.
 * Permite al usuario autenticarse con usuario y contraseña.
 */
function Login({ onLogin, onSwitchToRegister, onSwitchToForgot }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ show: false, type: '', title: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await authService.login(username, password);

      // Guardar tokens y datos del usuario
      localStorage.setItem('token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);
      localStorage.setItem('username', username);

      setModal({
        show: true,
        type: 'success',
        title: '¡Bienvenido!',
        message: `Inicio de sesión exitoso. Bienvenido ${username}.`,
      });

      // Esperar a que cierre el modal antes de navegar
      setTimeout(() => {
        onLogin(username);
      }, 1500);

    } catch (error) {
      const errorMsg =
        error.response?.data?.detail ||
        error.response?.data?.error ||
        'Usuario o contraseña incorrectos. Verifica tus credenciales.';

      setModal({
        show: true,
        type: 'error',
        title: 'Error de Autenticación',
        message: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container animate-fade-in-up">
        {/* Logo y Brand */}
        <div className="auth-header">
          <div className="auth-logo">
            <span className="material-icons-outlined">store</span>
          </div>
          <h1 className="auth-brand">BRIAROS</h1>
          <p className="auth-subtitle">Point of Sale System</p>
        </div>

        {/* Formulario */}
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-username">Usuario</label>
            <div className="input-wrapper">
              <span className="material-icons-outlined input-icon">person</span>
              <input
                id="login-username"
                type="text"
                className="form-input"
                placeholder="Ingresa tu usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
          </div>

          <div className="form-group">
            <div className="form-label-row">
              <label className="form-label" htmlFor="login-password">Contraseña</label>
              <button
                type="button"
                className="forgot-link"
                onClick={onSwitchToForgot}
              >
                ¿Olvidaste?
              </button>
            </div>
            <div className="input-wrapper">
              <span className="material-icons-outlined input-icon">lock</span>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                <span className="material-icons-outlined">
                  {showPassword ? 'visibility' : 'visibility_off'}
                </span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="auth-btn primary-btn"
            disabled={loading}
          >
            {loading ? (
              <span className="btn-loader"></span>
            ) : (
              <>
                Iniciar Sesión
                <span className="material-icons-outlined btn-icon">login</span>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="auth-footer">
          <span>¿No tienes cuenta?</span>
          <button
            type="button"
            className="switch-link"
            onClick={onSwitchToRegister}
          >
            Crear Cuenta
          </button>
        </div>
      </div>

      {/* Modal de alertas */}
      <Modal
        show={modal.show}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onClose={() => setModal({ ...modal, show: false })}
        autoClose={modal.type === 'success' ? 1500 : 0}
      />
    </div>
  );
}

export default Login;
