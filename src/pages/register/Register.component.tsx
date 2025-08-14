import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AppContext';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export default function RegisterComponent() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpiar error cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido';
    }

    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Debes aceptar los términos y condiciones';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simular llamada a API para registro
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // En un proyecto real, aquí registrarías al usuario en el servidor
      // Por ahora, vamos a simular un registro exitoso y hacer login automático
      login(formData.email, formData.password);
      navigate('/');
    } catch {
      setErrors({
        general: 'Error al crear la cuenta. Inténtalo de nuevo.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-success text-white text-center py-4">
              <h3 className="mb-0">
                <i className="fas fa-user-plus me-2"></i>
                Crear Cuenta
              </h3>
              <p className="mb-0 mt-2">Únete a la comunidad EcoMerma</p>
            </div>
            
            <div className="card-body p-5">
              {errors.general && (
                <div className="alert alert-danger" role="alert">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {errors.general}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Nombre y Apellido */}
                <div className="row mb-4">
                  <div className="col-md-6">
                    <label htmlFor="firstName" className="form-label fw-semibold">
                      <i className="fas fa-user me-2 text-success"></i>
                      Nombre
                    </label>
                    <input
                      type="text"
                      className={`form-control form-control-lg ${errors.firstName ? 'is-invalid' : ''}`}
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Tu nombre"
                      disabled={isLoading}
                    />
                    {errors.firstName && (
                      <div className="invalid-feedback">
                        {errors.firstName}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="lastName" className="form-label fw-semibold">
                      <i className="fas fa-user me-2 text-success"></i>
                      Apellido
                    </label>
                    <input
                      type="text"
                      className={`form-control form-control-lg ${errors.lastName ? 'is-invalid' : ''}`}
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Tu apellido"
                      disabled={isLoading}
                    />
                    {errors.lastName && (
                      <div className="invalid-feedback">
                        {errors.lastName}
                      </div>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="mb-4">
                  <label htmlFor="email" className="form-label fw-semibold">
                    <i className="fas fa-envelope me-2 text-success"></i>
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    className={`form-control form-control-lg ${errors.email ? 'is-invalid' : ''}`}
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="tu@email.com"
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">
                      {errors.email}
                    </div>
                  )}
                </div>

                {/* Contraseñas */}
                <div className="row mb-4">
                  <div className="col-md-6">
                    <label htmlFor="password" className="form-label fw-semibold">
                      <i className="fas fa-lock me-2 text-success"></i>
                      Contraseña
                    </label>
                    <input
                      type="password"
                      className={`form-control form-control-lg ${errors.password ? 'is-invalid' : ''}`}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Mínimo 6 caracteres"
                      disabled={isLoading}
                    />
                    {errors.password && (
                      <div className="invalid-feedback">
                        {errors.password}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="confirmPassword" className="form-label fw-semibold">
                      <i className="fas fa-lock me-2 text-success"></i>
                      Confirmar Contraseña
                    </label>
                    <input
                      type="password"
                      className={`form-control form-control-lg ${errors.confirmPassword ? 'is-invalid' : ''}`}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Repite tu contraseña"
                      disabled={isLoading}
                    />
                    {errors.confirmPassword && (
                      <div className="invalid-feedback">
                        {errors.confirmPassword}
                      </div>
                    )}
                  </div>
                </div>

                {/* Términos y Condiciones */}
                <div className="mb-4">
                  <div className="form-check">
                    <input 
                      className={`form-check-input ${errors.acceptTerms ? 'is-invalid' : ''}`}
                      type="checkbox" 
                      id="acceptTerms"
                      name="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                    <label className="form-check-label" htmlFor="acceptTerms">
                      Acepto los{' '}
                      <Link to="/terms" className="text-success text-decoration-none">
                        términos y condiciones
                      </Link>
                      {' '}y la{' '}
                      <Link to="/privacy" className="text-success text-decoration-none">
                        política de privacidad
                      </Link>
                    </label>
                    {errors.acceptTerms && (
                      <div className="invalid-feedback">
                        {errors.acceptTerms}
                      </div>
                    )}
                  </div>
                </div>

                {/* Botón de Registro */}
                <button 
                  type="submit" 
                  className="btn btn-success btn-lg w-100 mb-3"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Creando cuenta...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-user-plus me-2"></i>
                      Crear Mi Cuenta
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="text-center mb-3">
                <small className="text-muted">¿Ya tienes una cuenta?</small>
              </div>

              {/* Link a Login */}
              <Link to="/login" className="btn btn-outline-success btn-lg w-100">
                <i className="fas fa-sign-in-alt me-2"></i>
                Iniciar Sesión
              </Link>
            </div>

            {/* Footer de la tarjeta */}
            <div className="card-footer bg-light text-center py-3">
              <small className="text-muted">
                <i className="fas fa-shield-alt me-1"></i>
                Al registrarte, ayudas a crear un futuro más sostenible
              </small>
            </div>
          </div>

          {/* Beneficios de Registrarse */}
          <div className="row mt-4 g-3">
            <div className="col-12">
              <div className="card bg-light">
                <div className="card-body">
                  <h6 className="text-success mb-3">
                    <i className="fas fa-gift me-2"></i>
                    Beneficios de crear tu cuenta:
                  </h6>
                  <div className="row g-3">
                    <div className="col-md-4 text-center">
                      <i className="fas fa-heart text-success" style={{ fontSize: '2rem' }}></i>
                      <h6 className="mt-2 small">Lista de Favoritos</h6>
                      <p className="small text-muted mb-0">Guarda productos que te interesan</p>
                    </div>
                    <div className="col-md-4 text-center">
                      <i className="fas fa-shipping-fast text-success" style={{ fontSize: '2rem' }}></i>
                      <h6 className="mt-2 small">Envíos Rápidos</h6>
                      <p className="small text-muted mb-0">Direcciones guardadas para compras rápidas</p>
                    </div>
                    <div className="col-md-4 text-center">
                      <i className="fas fa-tree text-success" style={{ fontSize: '2rem' }}></i>
                      <h6 className="mt-2 small">Impacto Ambiental</h6>
                      <p className="small text-muted mb-0">Rastrea tu contribución al reciclaje</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
