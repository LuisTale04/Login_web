import { useState, useRef, useCallback } from 'react';
import authService from '../../services/authService';
import Modal from '../UI/Modal';
import './Login.css';

/**
 * Componente de recuperación de contraseña.
 * Flujo de 3 pasos:
 *   1. Ingresar email
 *   2. Ingresar código de 6 dígitos
 *   3. Crear nueva contraseña (con confirmación)
 */
function ForgotPassword({ onSwitchToLogin }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [modal, setModal] = useState({ show: false, type: '', title: '', message: '' });
  const otpRefs = useRef([]);

  // ── Step 1: Enviar código al correo ──
  const handleSendCode = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.forgotPassword(email);
      setModal({
        show: true,
        type: 'success',
        title: 'Código Enviado',
        message: 'Hemos enviado un código de 6 dígitos a tu correo electrónico.',
      });
      setStep(2);
      startResendCooldown();
    } catch (error) {
      const errorMsg =
        error.response?.data?.email?.[0] ||
        error.response?.data?.error ||
        'No se encontró una cuenta con ese correo electrónico.';

      setModal({
        show: true,
        type: 'error',
        title: 'Error',
        message: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  // ── Resend Cooldown ──
  const startResendCooldown = useCallback(() => {
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const handleResendCode = async () => {
    try {
      await authService.forgotPassword(email);
      setModal({
        show: true,
        type: 'info',
        title: 'Código Reenviado',
        message: 'Se ha enviado un nuevo código a tu correo electrónico.',
      });
      startResendCooldown();
    } catch {
      setModal({
        show: true,
        type: 'error',
        title: 'Error',
        message: 'No se pudo reenviar el código. Intenta de nuevo.',
      });
    }
  };

  // ── OTP Input Handling ──
  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      // Handle paste
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newCode = [...code];
      digits.forEach((digit, i) => {
        if (index + i < 6) newCode[index + i] = digit;
      });
      setCode(newCode);
      const nextIndex = Math.min(index + digits.length, 5);
      otpRefs.current[nextIndex]?.focus();
      return;
    }

    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // ── Step 2: Verificar código ──
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length !== 6) return;

    setLoading(true);
    try {
      await authService.verifyCode(email, fullCode);
      setModal({
        show: true,
        type: 'success',
        title: '¡Código Verificado!',
        message: 'El código es correcto. Ahora puedes crear una nueva contraseña.',
      });
      setStep(3);
    } catch {
      setModal({
        show: true,
        type: 'error',
        title: 'Código Inválido',
        message: 'El código ingresado es incorrecto o ha expirado. Intenta nuevamente.',
      });
      setCode(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  // ── Step 3: Reset Password ──
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setModal({
        show: true,
        type: 'warning',
        title: 'Contraseñas no Coinciden',
        message: 'Las contraseñas ingresadas no son iguales. Verifica e intenta de nuevo.',
      });
      return;
    }

    if (newPassword.length < 4) {
      setModal({
        show: true,
        type: 'warning',
        title: 'Contraseña Débil',
        message: 'La contraseña debe tener al menos 4 caracteres.',
      });
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword({
        email,
        code: code.join(''),
        new_password: newPassword,
        confirm_password: confirmPassword,
      });

      setModal({
        show: true,
        type: 'success',
        title: '¡Contraseña Actualizada!',
        message: 'Tu contraseña ha sido restablecida exitosamente. Ahora puedes iniciar sesión.',
      });

      setTimeout(() => {
        onSwitchToLogin();
      }, 2500);

    } catch (error) {
      const errorMsg =
        error.response?.data?.error ||
        error.response?.data?.confirm_password?.[0] ||
        'Error al restablecer la contraseña. Intenta nuevamente.';

      setModal({
        show: true,
        type: 'error',
        title: 'Error',
        message: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  // ── Step Indicator ──
  const StepIndicator = () => (
    <div className="step-indicator">
      <div className={`step-dot ${step >= 1 ? 'active' : ''}`}></div>
      <div className={`step-line ${step >= 2 ? 'active' : ''}`}></div>
      <div className={`step-dot ${step >= 2 ? 'active' : ''}`}></div>
      <div className={`step-line ${step >= 3 ? 'active' : ''}`}></div>
      <div className={`step-dot ${step >= 3 ? 'active' : ''}`}></div>
    </div>
  );

  return (
    <div className="auth-page">
      <div className="auth-container animate-fade-in-up">
        {/* Back button */}
        <button
          type="button"
          className="auth-back-btn"
          onClick={step === 1 ? onSwitchToLogin : () => setStep(step - 1)}
        >
          <span className="material-icons-outlined">arrow_back</span>
        </button>

        {/* Header */}
        <div className="auth-header">
          <div className="auth-logo">
            <span className="material-icons-outlined">
              {step === 1 ? 'lock_reset' : step === 2 ? 'pin' : 'vpn_key'}
            </span>
          </div>

          <StepIndicator />

          <h1 className="auth-header-title">
            {step === 1 && 'Recuperar Contraseña'}
            {step === 2 && 'Verificar Código'}
            {step === 3 && 'Nueva Contraseña'}
          </h1>
          <p className="auth-header-desc">
            {step === 1 && 'Ingresa tu correo electrónico para recibir un código de recuperación.'}
            {step === 2 && 'Ingresa el código de 6 dígitos enviado a tu correo.'}
            {step === 3 && 'Crea una nueva contraseña segura para tu cuenta.'}
          </p>
        </div>

        {/* ─── Step 1: Email ─── */}
        {step === 1 && (
          <form className="auth-form" onSubmit={handleSendCode}>
            <div className="form-group">
              <label className="form-label" htmlFor="forgot-email">Correo Electrónico</label>
              <div className="input-wrapper">
                <span className="material-icons-outlined input-icon">mail</span>
                <input
                  id="forgot-email"
                  type="email"
                  className="form-input"
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <button type="submit" className="auth-btn secondary-btn" disabled={loading}>
              {loading ? (
                <span className="btn-loader"></span>
              ) : (
                <>
                  Enviar Código
                  <span className="material-icons-outlined btn-icon">send</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* ─── Step 2: OTP Code ─── */}
        {step === 2 && (
          <form className="auth-form" onSubmit={handleVerifyCode}>
            <div className="otp-container">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (otpRefs.current[index] = el)}
                  type="text"
                  maxLength={6}
                  className="otp-input"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  autoFocus={index === 0}
                />
              ))}
            </div>

            <p className="info-text">
              ¿No recibiste el código?{' '}
              {resendCooldown > 0 ? (
                <span style={{ color: 'var(--gray-400)' }}>
                  Reenviar en {resendCooldown}s
                </span>
              ) : (
                <button
                  type="button"
                  className="resend-link"
                  onClick={handleResendCode}
                >
                  Reenviar código
                </button>
              )}
            </p>

            <button
              type="submit"
              className="auth-btn secondary-btn"
              disabled={loading || code.join('').length !== 6}
            >
              {loading ? (
                <span className="btn-loader"></span>
              ) : (
                <>
                  Verificar Código
                  <span className="material-icons-outlined btn-icon">verified</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* ─── Step 3: New Password ─── */}
        {step === 3 && (
          <form className="auth-form" onSubmit={handleResetPassword}>
            <div className="form-group">
              <label className="form-label" htmlFor="new-password">Nueva Contraseña</label>
              <div className="input-wrapper">
                <span className="material-icons-outlined input-icon">lock</span>
                <input
                  id="new-password"
                  type={showNewPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Ingresa tu nueva contraseña"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={4}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  tabIndex={-1}
                >
                  <span className="material-icons-outlined">
                    {showNewPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirm-password">Confirmar Contraseña</label>
              <div className="input-wrapper">
                <span className="material-icons-outlined input-icon">lock_outline</span>
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Confirma tu nueva contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={4}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                >
                  <span className="material-icons-outlined">
                    {showConfirmPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
            </div>

            <button type="submit" className="auth-btn primary-btn" disabled={loading}>
              {loading ? (
                <span className="btn-loader"></span>
              ) : (
                <>
                  Restablecer Contraseña
                  <span className="material-icons-outlined btn-icon">vpn_key</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Footer */}
        <div className="auth-footer">
          <button
            type="button"
            className="switch-link"
            onClick={onSwitchToLogin}
          >
            Volver al Inicio de Sesión
          </button>
        </div>
      </div>

      <Modal
        show={modal.show}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onClose={() => setModal({ ...modal, show: false })}
        autoClose={modal.type === 'success' ? 2000 : 0}
      />
    </div>
  );
}

export default ForgotPassword;
