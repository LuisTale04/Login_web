import { useEffect } from 'react';
import './Modal.css';

/**
 * Componente Modal reutilizable para alertas y mensajes del sistema.
 * 
 * @param {string} type    - Tipo de modal: 'success', 'error', 'warning', 'info'
 * @param {string} title   - Título del modal
 * @param {string} message - Mensaje descriptivo
 * @param {boolean} show   - Controla la visibilidad
 * @param {function} onClose - Callback al cerrar
 * @param {number} autoClose - Milisegundos para cerrar automáticamente (0 = desactivado)
 */
function Modal({ type = 'info', title, message, show, onClose, autoClose = 0 }) {

  useEffect(() => {
    if (show && autoClose > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, autoClose);
      return () => clearTimeout(timer);
    }
  }, [show, autoClose, onClose]);

  // Cerrar con Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && show) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [show, onClose]);

  if (!show) return null;

  const icons = {
    success: 'check_circle',
    error: 'error',
    warning: 'warning',
    info: 'info',
  };

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div
        className={`modal-container modal-${type} animate-scale-in`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`modal-icon-wrapper modal-icon-${type}`}>
          <span className="material-icons-outlined modal-icon">
            {icons[type]}
          </span>
        </div>

        <h3 className="modal-title">{title}</h3>
        <p className="modal-message">{message}</p>

        <button className={`modal-btn modal-btn-${type}`} onClick={onClose}>
          Aceptar
        </button>
      </div>
    </div>
  );
}

export default Modal;
