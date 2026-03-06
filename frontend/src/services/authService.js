import api from './api';

/**
 * Servicio de autenticación.
 * Centraliza todas las llamadas al API relacionadas con auth.
 */
const authService = {
  /**
   * Inicia sesión con usuario y contraseña.
   * @param {string} username
   * @param {string} password
   * @returns {Promise} Respuesta con tokens JWT { access, refresh }
   */
  login: (username, password) => {
    return api.post('/login/', { username, password });
  },

  /**
   * Registra un nuevo usuario.
   * @param {object} userData - { username, first_name, email, password }
   * @returns {Promise} Respuesta con mensaje de éxito
   */
  register: (userData) => {
    return api.post('/register/', userData);
  },

  /**
   * Solicita el envío de un código de recuperación al email.
   * @param {string} email
   * @returns {Promise} Respuesta con mensaje de éxito
   */
  forgotPassword: (email) => {
    return api.post('/forgot-password/', { email });
  },

  /**
   * Verifica el código de recuperación ingresado por el usuario.
   * @param {string} email
   * @param {string} code
   * @returns {Promise} Respuesta con mensaje de éxito
   */
  verifyCode: (email, code) => {
    return api.post('/verify-code/', { email, code });
  },

  /**
   * Restablece la contraseña del usuario.
   * @param {object} data - { email, code, new_password, confirm_password }
   * @returns {Promise} Respuesta con mensaje de éxito
   */
  resetPassword: (data) => {
    return api.post('/reset-password/', data);
  },

  /**
   * Cierra la sesión del usuario (limpia tokens del localStorage).
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('user_fullname');
  },

  /**
   * Verifica si el usuario está autenticado.
   * @returns {boolean}
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  /**
   * Obtiene el nombre del usuario logueado.
   * @returns {string}
   */
  getUsername: () => {
    return localStorage.getItem('username') || '';
  },

  /**
   * Obtiene el nombre completo del usuario logueado.
   * @returns {string}
   */
  getFullName: () => {
    return localStorage.getItem('user_fullname') || '';
  },
};

export default authService;
