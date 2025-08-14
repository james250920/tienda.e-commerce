import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart, useAuth } from '../../context/AppContext';
import { products } from '../../data/mockData';

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  district: string;
  province: string;
  department: string;
  postalCode: string;
}

interface PaymentInfo {
  method: 'card' | 'bank' | 'yape' | 'plin';
  cardNumber: string;
  cardName: string;
  cardExpiry: string;
  cardCvv: string;
  bankAccount: string;
  phoneNumber: string;
}

export default function CheckoutComponent() {
  const { cart, clearCart, getCartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: '',
    address: '',
    district: '',
    province: '',
    department: 'Lima',
    postalCode: ''
  });

  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    method: 'card',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: '',
    bankAccount: '',
    phoneNumber: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const cartItemsWithDetails = cart.map(item => {
    const product = products.find(p => p.id === item.id);
    return { ...item, product };
  }).filter(item => item.product);

  const formatPrice = (price: number): string => {
    return `S/ ${price.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const subtotal = getCartTotal(products);
  const shipping = subtotal > 150 ? 0 : 15;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  if (cartItemsWithDetails.length === 0) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-6 text-center">
            <i className="fas fa-shopping-cart text-muted mb-4" style={{ fontSize: '5rem' }}></i>
            <h2 className="text-muted mb-3">Tu carrito está vacío</h2>
            <p className="text-muted mb-4">
              Agrega algunos productos antes de proceder al checkout
            </p>
            <Link to="/product" className="btn btn-success btn-lg">
              <i className="fas fa-recycle me-2"></i>
              Explorar Productos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPaymentInfo(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateShipping = () => {
    const newErrors: {[key: string]: string} = {};

    if (!shippingInfo.firstName.trim()) newErrors.firstName = 'Nombre requerido';
    if (!shippingInfo.lastName.trim()) newErrors.lastName = 'Apellido requerido';
    if (!shippingInfo.email.trim()) newErrors.email = 'Email requerido';
    if (!shippingInfo.phone.trim()) newErrors.phone = 'Teléfono requerido';
    if (!shippingInfo.address.trim()) newErrors.address = 'Dirección requerida';
    if (!shippingInfo.district.trim()) newErrors.district = 'Distrito requerido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePayment = () => {
    const newErrors: {[key: string]: string} = {};

    if (paymentInfo.method === 'card') {
      if (!paymentInfo.cardNumber) newErrors.cardNumber = 'Número de tarjeta requerido';
      if (!paymentInfo.cardName) newErrors.cardName = 'Nombre del titular requerido';
      if (!paymentInfo.cardExpiry) newErrors.cardExpiry = 'Fecha de expiración requerida';
      if (!paymentInfo.cardCvv) newErrors.cardCvv = 'CVV requerido';
    } else if (paymentInfo.method === 'yape' || paymentInfo.method === 'plin') {
      if (!paymentInfo.phoneNumber) newErrors.phoneNumber = 'Número de teléfono requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateShipping()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validatePayment()) {
      setCurrentStep(3);
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    try {
      // Simular procesamiento de pago
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Limpiar carrito
      clearCart();
      
      // Redirigir a página de confirmación
      navigate('/order-confirmation');
    } catch {
      setErrors({ general: 'Error al procesar el pago. Inténtalo de nuevo.' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="text-success">
            <i className="fas fa-credit-card me-2"></i>
            Finalizar Compra
          </h1>
          
          {/* Progress Steps */}
          <div className="checkout-steps mt-3">
            <div className="row">
              <div className="col-4">
                <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
                  <span className="step-number">1</span>
                  <span className="step-label">Envío</span>
                </div>
              </div>
              <div className="col-4">
                <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
                  <span className="step-number">2</span>
                  <span className="step-label">Pago</span>
                </div>
              </div>
              <div className="col-4">
                <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
                  <span className="step-number">3</span>
                  <span className="step-label">Confirmar</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Formulario */}
        <div className="col-lg-8">
          {/* Paso 1: Información de Envío */}
          {currentStep === 1 && (
            <div className="card shadow-sm">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="fas fa-shipping-fast me-2"></i>
                  Información de Envío
                </h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Nombre</label>
                    <input
                      type="text"
                      className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                      name="firstName"
                      value={shippingInfo.firstName}
                      onChange={handleShippingChange}
                    />
                    {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Apellido</label>
                    <input
                      type="text"
                      className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                      name="lastName"
                      value={shippingInfo.lastName}
                      onChange={handleShippingChange}
                    />
                    {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      name="email"
                      value={shippingInfo.email}
                      onChange={handleShippingChange}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Teléfono</label>
                    <input
                      type="tel"
                      className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleShippingChange}
                    />
                    {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                  </div>
                  <div className="col-12">
                    <label className="form-label">Dirección</label>
                    <input
                      type="text"
                      className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleShippingChange}
                      placeholder="Av. Principal 123, Miraflores"
                    />
                    {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Distrito</label>
                    <input
                      type="text"
                      className={`form-control ${errors.district ? 'is-invalid' : ''}`}
                      name="district"
                      value={shippingInfo.district}
                      onChange={handleShippingChange}
                    />
                    {errors.district && <div className="invalid-feedback">{errors.district}</div>}
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Provincia</label>
                    <input
                      type="text"
                      className="form-control"
                      name="province"
                      value={shippingInfo.province}
                      onChange={handleShippingChange}
                      placeholder="Lima"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Departamento</label>
                    <select
                      className="form-control"
                      name="department"
                      value={shippingInfo.department}
                      onChange={handleShippingChange}
                    >
                      <option value="Lima">Lima</option>
                      <option value="Arequipa">Arequipa</option>
                      <option value="Trujillo">Trujillo</option>
                      <option value="Chiclayo">Chiclayo</option>
                      <option value="Piura">Piura</option>
                    </select>
                  </div>
                </div>
                
                <div className="d-flex justify-content-end mt-4">
                  <button className="btn btn-success" onClick={handleNextStep}>
                    Continuar al Pago
                    <i className="fas fa-arrow-right ms-2"></i>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Paso 2: Información de Pago */}
          {currentStep === 2 && (
            <div className="card shadow-sm">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="fas fa-credit-card me-2"></i>
                  Método de Pago
                </h5>
              </div>
              <div className="card-body">
                {/* Selector de método de pago */}
                <div className="mb-4">
                  <div className="row g-3">
                    <div className="col-md-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="paymentMethod"
                          id="card"
                          value="card"
                          checked={paymentInfo.method === 'card'}
                          onChange={() => setPaymentInfo(prev => ({ ...prev, method: 'card' }))}
                        />
                        <label className="form-check-label" htmlFor="card">
                          <i className="fas fa-credit-card me-2"></i>
                          Tarjeta
                        </label>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="paymentMethod"
                          id="yape"
                          value="yape"
                          checked={paymentInfo.method === 'yape'}
                          onChange={() => setPaymentInfo(prev => ({ ...prev, method: 'yape' }))}
                        />
                        <label className="form-check-label" htmlFor="yape">
                          <i className="fas fa-mobile-alt me-2"></i>
                          Yape
                        </label>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="paymentMethod"
                          id="plin"
                          value="plin"
                          checked={paymentInfo.method === 'plin'}
                          onChange={() => setPaymentInfo(prev => ({ ...prev, method: 'plin' }))}
                        />
                        <label className="form-check-label" htmlFor="plin">
                          <i className="fas fa-mobile-alt me-2"></i>
                          Plin
                        </label>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="paymentMethod"
                          id="bank"
                          value="bank"
                          checked={paymentInfo.method === 'bank'}
                          onChange={() => setPaymentInfo(prev => ({ ...prev, method: 'bank' }))}
                        />
                        <label className="form-check-label" htmlFor="bank">
                          <i className="fas fa-university me-2"></i>
                          Transferencia
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Formulario según método de pago */}
                {paymentInfo.method === 'card' && (
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label">Número de Tarjeta</label>
                      <input
                        type="text"
                        className={`form-control ${errors.cardNumber ? 'is-invalid' : ''}`}
                        name="cardNumber"
                        value={paymentInfo.cardNumber}
                        onChange={handlePaymentChange}
                        placeholder="1234 5678 9012 3456"
                      />
                      {errors.cardNumber && <div className="invalid-feedback">{errors.cardNumber}</div>}
                    </div>
                    <div className="col-12">
                      <label className="form-label">Nombre del Titular</label>
                      <input
                        type="text"
                        className={`form-control ${errors.cardName ? 'is-invalid' : ''}`}
                        name="cardName"
                        value={paymentInfo.cardName}
                        onChange={handlePaymentChange}
                        placeholder="Como aparece en la tarjeta"
                      />
                      {errors.cardName && <div className="invalid-feedback">{errors.cardName}</div>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Fecha de Expiración</label>
                      <input
                        type="text"
                        className={`form-control ${errors.cardExpiry ? 'is-invalid' : ''}`}
                        name="cardExpiry"
                        value={paymentInfo.cardExpiry}
                        onChange={handlePaymentChange}
                        placeholder="MM/AA"
                      />
                      {errors.cardExpiry && <div className="invalid-feedback">{errors.cardExpiry}</div>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">CVV</label>
                      <input
                        type="text"
                        className={`form-control ${errors.cardCvv ? 'is-invalid' : ''}`}
                        name="cardCvv"
                        value={paymentInfo.cardCvv}
                        onChange={handlePaymentChange}
                        placeholder="123"
                      />
                      {errors.cardCvv && <div className="invalid-feedback">{errors.cardCvv}</div>}
                    </div>
                  </div>
                )}

                {(paymentInfo.method === 'yape' || paymentInfo.method === 'plin') && (
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label">Número de Teléfono</label>
                      <input
                        type="tel"
                        className={`form-control ${errors.phoneNumber ? 'is-invalid' : ''}`}
                        name="phoneNumber"
                        value={paymentInfo.phoneNumber}
                        onChange={handlePaymentChange}
                        placeholder="987654321"
                      />
                      {errors.phoneNumber && <div className="invalid-feedback">{errors.phoneNumber}</div>}
                    </div>
                    <div className="col-12">
                      <div className="alert alert-info">
                        <i className="fas fa-info-circle me-2"></i>
                        Recibirás una notificación para confirmar el pago en tu aplicación {paymentInfo.method === 'yape' ? 'Yape' : 'Plin'}.
                      </div>
                    </div>
                  </div>
                )}

                {paymentInfo.method === 'bank' && (
                  <div className="alert alert-info">
                    <i className="fas fa-info-circle me-2"></i>
                    Te enviaremos los datos bancarios para realizar la transferencia.
                  </div>
                )}

                <div className="d-flex justify-content-between mt-4">
                  <button className="btn btn-outline-secondary" onClick={() => setCurrentStep(1)}>
                    <i className="fas fa-arrow-left me-2"></i>
                    Volver
                  </button>
                  <button className="btn btn-success" onClick={handleNextStep}>
                    Revisar Pedido
                    <i className="fas fa-arrow-right ms-2"></i>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Paso 3: Confirmación */}
          {currentStep === 3 && (
            <div className="card shadow-sm">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="fas fa-check-circle me-2"></i>
                  Confirmar Pedido
                </h5>
              </div>
              <div className="card-body">
                {errors.general && (
                  <div className="alert alert-danger">
                    {errors.general}
                  </div>
                )}

                {/* Información de envío */}
                <h6 className="text-success mb-3">Información de Envío</h6>
                <div className="mb-4">
                  <p className="mb-1"><strong>{shippingInfo.firstName} {shippingInfo.lastName}</strong></p>
                  <p className="mb-1">{shippingInfo.address}</p>
                  <p className="mb-1">{shippingInfo.district}, {shippingInfo.province}</p>
                  <p className="mb-1">{shippingInfo.department}</p>
                  <p className="mb-1">{shippingInfo.email}</p>
                  <p className="mb-0">{shippingInfo.phone}</p>
                </div>

                {/* Método de pago */}
                <h6 className="text-success mb-3">Método de Pago</h6>
                <div className="mb-4">
                  <p className="mb-0">
                    <i className={`fas ${paymentInfo.method === 'card' ? 'fa-credit-card' : paymentInfo.method === 'bank' ? 'fa-university' : 'fa-mobile-alt'} me-2`}></i>
                    {paymentInfo.method === 'card' && 'Tarjeta de Crédito/Débito'}
                    {paymentInfo.method === 'yape' && 'Yape'}
                    {paymentInfo.method === 'plin' && 'Plin'}
                    {paymentInfo.method === 'bank' && 'Transferencia Bancaria'}
                  </p>
                </div>

                <div className="d-flex justify-content-between">
                  <button className="btn btn-outline-secondary" onClick={() => setCurrentStep(2)}>
                    <i className="fas fa-arrow-left me-2"></i>
                    Volver
                  </button>
                  <button 
                    className="btn btn-success btn-lg"
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Procesando...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-check me-2"></i>
                        Confirmar Pedido - {formatPrice(total)}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Resumen del Pedido */}
        <div className="col-lg-4">
          <div className="card shadow-sm position-sticky" style={{ top: '20px' }}>
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">
                <i className="fas fa-receipt me-2"></i>
                Resumen del Pedido
              </h5>
            </div>
            <div className="card-body">
              {/* Productos */}
              <div className="order-items mb-3">
                {cartItemsWithDetails.map(item => (
                  <div key={item.id} className="d-flex align-items-center mb-2">
                    <img 
                      src={item.product?.image} 
                      alt={item.product?.name}
                      className="rounded me-2"
                      style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                    />
                    <div className="flex-grow-1">
                      <h6 className="mb-0 small">{item.product?.name}</h6>
                      <small className="text-muted">Cantidad: {item.quantity}</small>
                    </div>
                    <span className="fw-semibold">
                      {formatPrice((item.product?.price || 0) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <hr />

              {/* Totales */}
              <div className="order-totals">
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Envío:</span>
                  <span>{shipping === 0 ? 'Gratis' : formatPrice(shipping)}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>IGV (18%):</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <span className="h6 fw-bold">Total:</span>
                  <span className="h6 fw-bold text-success">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


