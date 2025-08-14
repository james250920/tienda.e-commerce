import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AppContext';

export default function LoginComponent() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // En un proyecto real, aquí validarías las credenciales con el servidor
      // Por ahora, vamos a simular un login exitoso
      if (formData.email === 'admin@merma.pe' && formData.password === '123456') {
        login(formData.email, formData.password);
        navigate('/');
      } else {
        setErrors({
          general: 'Credenciales incorrectas. Prueba con admin@merma.pe / 123456'
        });
      }
    } catch {
      setErrors({
        general: 'Error al iniciar sesión. Inténtalo de nuevo.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-5 col-md-7">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-success text-white text-center py-4">
              <h3 className="mb-0">
                <i className="fas fa-leaf me-2"></i>
                Iniciar Sesión
              </h3>
              <p className="mb-0 mt-2">Accede a tu cuenta de EcoMerma</p>
            </div>
            
            <div className="card-body p-5">
              {errors.general && (
                <div className="alert alert-danger" role="alert">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {errors.general}
                </div>
              )}

              <form onSubmit={handleSubmit}>
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

                {/* Contraseña */}
                <div className="mb-4">
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
                    placeholder="Tu contraseña"
                    disabled={isLoading}
                  />
                  {errors.password && (
                    <div className="invalid-feedback">
                      {errors.password}
                    </div>
                  )}
                </div>

                {/* Recordar y Olvidé mi contraseña */}
                <div className="row mb-4">
                  <div className="col-6">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="remember" />
                      <label className="form-check-label small" htmlFor="remember">
                        Recordarme
                      </label>
                    </div>
                  </div>
                  <div className="col-6 text-end">
                    <Link to="/forgot-password" className="text-success text-decoration-none small">
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>
                </div>

                {/* Botón de Login */}
                <button 
                  type="submit" 
                  className="btn btn-success btn-lg w-100 mb-3"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Iniciando sesión...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-sign-in-alt me-2"></i>
                      Iniciar Sesión
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="text-center mb-3">
                <small className="text-muted">¿No tienes una cuenta?</small>
              </div>

              {/* Link a Registro */}
              <Link to="/register" className="btn btn-outline-success btn-lg w-100">
                <i className="fas fa-user-plus me-2"></i>
                Crear Cuenta Nueva
              </Link>
            </div>

            {/* Footer de la tarjeta */}
            <div className="card-footer bg-light text-center py-3">
              <small className="text-muted">
                <i className="fas fa-shield-alt me-1"></i>
                Tus datos están protegidos con nosotros
              </small>
            </div>
          </div>

          {/* Datos de prueba */}
          <div className="card mt-3 border-info">
            <div className="card-header bg-info text-white">
              <h6 className="mb-0">
                <i className="fas fa-info-circle me-2"></i>
                Datos de Prueba
              </h6>
            </div>
            <div className="card-body">
              <p className="mb-2"><strong>Email:</strong> admin@merma.pe</p>
              <p className="mb-0"><strong>Contraseña:</strong> 123456</p>
            </div>
          </div>

          {/* Beneficios */}
          <div className="row mt-4 g-3">
            <div className="col-4 text-center">
              <div className="p-3">
                <i className="fas fa-recycle text-success" style={{ fontSize: '2rem' }}></i>
                <h6 className="mt-2 small">Productos Eco</h6>
              </div>
            </div>
            <div className="col-4 text-center">
              <div className="p-3">
                <i className="fas fa-truck text-success" style={{ fontSize: '2rem' }}></i>
                <h6 className="mt-2 small">Envío Gratis</h6>
              </div>
            </div>
            <div className="col-4 text-center">
              <div className="p-3">
                <i className="fas fa-heart text-success" style={{ fontSize: '2rem' }}></i>
                <h6 className="mt-2 small">Impacto Positivo</h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
