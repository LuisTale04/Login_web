import axios from 'axios';

/**
 * Instancia de Axios configurada con la URL base del backend.
 * Todas las peticiones al API deben usar esta instancia.
 */
const api = axios.create({
  baseURL: 'http://127.0.0.1:8005/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor de peticiones: agrega el token JWT automáticamente
 * a todas las peticiones si existe en el localStorage.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Interceptor de respuestas: manejo global de errores.
 * Si el servidor responde con 401, limpia el token y redirige al login.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
    }
    return Promise.reject(error);
  }
);

export default api;
