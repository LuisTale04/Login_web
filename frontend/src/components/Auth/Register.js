import { useState } from 'react';
import authService from '../../services/authService';
import Modal from '../UI/Modal';
import './Login.css';

/**
 * Componente de registro de nuevos usuarios.
 * Campos: Nombre, Apellido, Usuario, Email, Contraseña.
 */
function Register({ onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ show: false, type: '', title: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.register(formData);

      setModal({
        show: true,
        type: 'success',
        title: '¡Cuenta Creada!',
        message: 'Tu cuenta ha sido creada exitosamente. Ahora puedes iniciar sesión.',
      });

      // Limpiar formulario
      setFormData({ first_name: '', last_name: '', username: '', email: '', password: '' });

      // Redirigir al login después de cerrar el modal
      setTimeout(() => {
        onSwitchToLogin();
      }, 2500);

    } catch (error) {
      let errorMsg = 'Ocurrió un error al crear la cuenta. Intenta nuevamente.';

      if (error.response?.data) {
        const errors = error.response.data;
        if (errors.username) errorMsg = errors.username[0];
        else if (errors.email) errorMsg = errors.email[0];
        else if (errors.password) errorMsg = errors.password[0];
        else if (errors.first_name) errorMsg = errors.first_name[0];
        else if (errors.last_name) errorMsg = errors.last_name[0];
      }

      setModal({
        show: true,
        type: 'error',
        title: 'Error en Registro',
        message: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container animate-fade-in-up">
        {/* Back button */}
        <button
          type="button"
          className="auth-back-btn"
          onClick={onSwitchToLogin}
        >
          <span className="material-icons-outlined">arrow_back</span>
        </button>

        {/* Header */}
        <div className="auth-header">
          <div className="auth-logo">
            <span className="material-icons-outlined">storefront</span>
          </div>
          <h1 className="auth-header-title">Bienvenido a BRIAROS</h1>
          <p className="auth-header-desc">Regístrate para acceder al sistema POS</p>
        </div>

        {/* Formulario */}
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-firstname">Nombre</label>
            <div className="input-wrapper">
              <span className="material-icons-outlined input-icon">badge</span>
              <input
                id="reg-firstname"
                type="text"
                name="first_name"
                className="form-input"
                placeholder="Ingresa tu nombre"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-lastname">Apellido</label>
            <div className="input-wrapper">
              <span className="material-icons-outlined input-icon">badge</span>
              <input
                id="reg-lastname"
                type="text"
                name="last_name"
                className="form-input"
                placeholder="Ingresa tu apellido"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-username">Usuario</label>
            <div className="input-wrapper">
              <span className="material-icons-outlined input-icon">person</span>
              <input
                id="reg-username"
                type="text"
                name="username"
                className="form-input"
                placeholder="Elige un nombre de usuario"
                value={formData.username}
                onChange={handleChange}
                required
                autoComplete="username"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">Correo Electrónico</label>
            <div className="input-wrapper">
              <span className="material-icons-outlined input-icon">mail</span>
              <input
                id="reg-email"
                type="email"
                name="email"
                className="form-input"
                placeholder="correo@ejemplo.com"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">Contraseña</label>
            <div className="input-wrapper">
              <span className="material-icons-outlined input-icon">lock</span>
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                className="form-input"
                placeholder="Crea una contraseña"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={4}
                autoComplete="new-password"
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
            className="auth-btn secondary-btn"
            disabled={loading}
          >
            {loading ? (
              <span className="btn-loader"></span>
            ) : (
              <>
                Crear Cuenta
                <span className="material-icons-outlined btn-icon">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="auth-footer">
          <span>¿Ya tienes cuenta?</span>
          <button
            type="button"
            className="switch-link"
            onClick={onSwitchToLogin}
          >
            Iniciar Sesión
          </button>
        </div>
      </div>

      <Modal
        show={modal.show}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onClose={() => setModal({ ...modal, show: false })}
        autoClose={modal.type === 'success' ? 2500 : 0}
      />
    </div>
  );
}

export default Register;
