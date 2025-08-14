
import { Link } from 'react-router-dom';
import { useCart } from '../../context/AppContext';
import { products } from '../../data/mockData';

export default function CartComponent() {
  const { cart, updateQuantity, removeFromCart, clearCart, getCartTotal } = useCart();

  const formatPrice = (price: number): string => {
    return `S/ ${price.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const cartItemsWithDetails = cart.map(item => {
    const product = products.find(p => p.id === item.id);
    return { ...item, product };
  }).filter(item => item.product);

  if (cartItemsWithDetails.length === 0) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-6 text-center">
            <div className="empty-cart">
              <i className="fas fa-shopping-cart text-muted mb-4" style={{ fontSize: '5rem' }}></i>
              <h2 className="text-muted mb-3">Tu carrito está vacío</h2>
              <p className="text-muted mb-4">
                Descubre nuestros productos hechos con materiales reciclados y comienza a comprar
              </p>
              <Link to="/product" className="btn btn-success btn-lg">
                <i className="fas fa-recycle me-2"></i>
                Explorar Productos
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = getCartTotal(products);
  const shipping = subtotal > 150 ? 0 : 15; // Envío gratis por compras mayores a S/ 150
  const tax = subtotal * 0.18; // IGV 18%
  const total = subtotal + shipping + tax;

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="text-success">
              <i className="fas fa-shopping-cart me-2"></i>
              Mi Carrito
            </h1>
            <Link to="/product" className="btn btn-outline-success">
              <i className="fas fa-arrow-left me-2"></i>
              Seguir Comprando
            </Link>
          </div>
          <p className="text-muted">
            {cartItemsWithDetails.length} producto{cartItemsWithDetails.length !== 1 ? 's' : ''} en tu carrito
          </p>
        </div>
      </div>

      <div className="row">
        {/* Lista de Productos */}
        <div className="col-lg-8 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-white">
              <div className="row text-muted fw-semibold">
                <div className="col-2">Imagen</div>
                <div className="col-4">Producto</div>
                <div className="col-2 text-center">Precio</div>
                <div className="col-2 text-center">Cantidad</div>
                <div className="col-2 text-center">Total</div>
              </div>
            </div>
            <div className="card-body p-0">
              {cartItemsWithDetails.map((item) => (
                <div key={item.id} className="cart-item border-bottom p-3">
                  <div className="row align-items-center">
                    {/* Imagen */}
                    <div className="col-2">
                      <Link to={`/product/${item.product?.id}`}>
                        <img 
                          src={item.product?.image} 
                          alt={item.product?.name}
                          className="img-fluid rounded"
                          style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                        />
                      </Link>
                    </div>

                    {/* Información del Producto */}
                    <div className="col-4">
                      <h6 className="mb-1">
                        <Link 
                          to={`/product/${item.product?.id}`} 
                          className="text-decoration-none text-dark"
                        >
                          {item.product?.name}
                        </Link>
                      </h6>
                      <p className="text-muted small mb-1">
                        <i className="fas fa-leaf me-1"></i>
                        {item.product?.material}
                      </p>
                      <div className="sustainability-rating">
                        {[...Array(5)].map((_, i) => (
                          <i 
                            key={i} 
                            className={`fas fa-leaf ${i < (item.product?.sustainabilityRating || 0) ? 'text-success' : 'text-muted'}`}
                            style={{ fontSize: '0.8rem' }}
                          ></i>
                        ))}
                      </div>
                    </div>

                    {/* Precio Unitario */}
                    <div className="col-2 text-center">
                      <span className="fw-semibold text-success">
                        {formatPrice(item.product?.price || 0)}
                      </span>
                    </div>

                    {/* Controles de Cantidad */}
                    <div className="col-2 text-center">
                      <div className="input-group" style={{ maxWidth: '120px', margin: '0 auto' }}>
                        <button 
                          className="btn btn-outline-secondary btn-sm"
                          type="button"
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          disabled={item.quantity <= 1}
                        >
                          <i className="fas fa-minus"></i>
                        </button>
                        <input 
                          type="number" 
                          className="form-control form-control-sm text-center"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, Math.max(1, parseInt(e.target.value) || 1))}
                          min="1"
                          max={item.product?.stock || 1}
                        />
                        <button 
                          className="btn btn-outline-secondary btn-sm"
                          type="button"
                          onClick={() => updateQuantity(item.id, Math.min(item.product?.stock || 1, item.quantity + 1))}
                          disabled={item.quantity >= (item.product?.stock || 1)}
                        >
                          <i className="fas fa-plus"></i>
                        </button>
                      </div>
                      <button 
                        className="btn btn-link text-danger p-0 mt-2 small"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <i className="fas fa-trash me-1"></i>Eliminar
                      </button>
                    </div>

                    {/* Total del Item */}
                    <div className="col-2 text-center">
                      <span className="fw-bold text-success">
                        {formatPrice((item.product?.price || 0) * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Acciones del Carrito */}
          <div className="d-flex justify-content-between mt-3">
            <button 
              className="btn btn-outline-danger"
              onClick={clearCart}
            >
              <i className="fas fa-trash me-2"></i>
              Vaciar Carrito
            </button>
            <Link to="/product" className="btn btn-outline-success">
              <i className="fas fa-plus me-2"></i>
              Agregar Más Productos
            </Link>
          </div>
        </div>

        {/* Resumen del Pedido */}
        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-header bg-success text-white">
              <h5 className="card-title mb-0">
                <i className="fas fa-calculator me-2"></i>
                Resumen del Pedido
              </h5>
            </div>
            <div className="card-body">
              <div className="order-summary">
                {/* Subtotal */}
                <div className="d-flex justify-content-between mb-3">
                  <span>Subtotal ({cartItemsWithDetails.length} productos):</span>
                  <span className="fw-semibold">{formatPrice(subtotal)}</span>
                </div>

                {/* Envío */}
                <div className="d-flex justify-content-between mb-3">
                  <span>
                    Envío:
                    {shipping === 0 && (
                      <span className="badge bg-success ms-2 small">GRATIS</span>
                    )}
                  </span>
                  <span className="fw-semibold">
                    {shipping === 0 ? 'Gratis' : formatPrice(shipping)}
                  </span>
                </div>

                {/* IGV */}
                <div className="d-flex justify-content-between mb-3">
                  <span>IGV (18%):</span>
                  <span className="fw-semibold">{formatPrice(tax)}</span>
                </div>

                <hr />

                {/* Total */}
                <div className="d-flex justify-content-between mb-4">
                  <span className="h5 fw-bold">Total:</span>
                  <span className="h5 fw-bold text-success">{formatPrice(total)}</span>
                </div>

                {/* Información de Envío */}
                {shipping === 0 ? (
                  <div className="alert alert-success small">
                    <i className="fas fa-truck me-2"></i>
                    ¡Felicidades! Tienes envío gratis por comprar más de S/ 150
                  </div>
                ) : (
                  <div className="alert alert-info small">
                    <i className="fas fa-info-circle me-2"></i>
                    Agrega {formatPrice(150 - subtotal)} más para obtener envío gratis
                  </div>
                )}

                {/* Botón de Checkout */}
                <Link 
                  to="/checkout" 
                  className="btn btn-success w-100 btn-lg mb-3"
                >
                  <i className="fas fa-credit-card me-2"></i>
                  Proceder al Pago
                </Link>

                {/* Métodos de Pago */}
                <div className="payment-methods text-center">
                  <small className="text-muted d-block mb-2">Métodos de pago aceptados:</small>
                  <div className="payment-icons">
                    <i className="fab fa-cc-visa text-primary me-2" style={{ fontSize: '1.5rem' }}></i>
                    <i className="fab fa-cc-mastercard text-warning me-2" style={{ fontSize: '1.5rem' }}></i>
                    <i className="fas fa-university text-info me-2" style={{ fontSize: '1.2rem' }}></i>
                    <i className="fas fa-mobile-alt text-success" style={{ fontSize: '1.2rem' }}></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Beneficios Ambientales */}
          <div className="card shadow-sm mt-3">
            <div className="card-header bg-light">
              <h6 className="card-title mb-0 text-success">
                <i className="fas fa-leaf me-2"></i>
                Impacto Ambiental
              </h6>
            </div>
            <div className="card-body">
              <div className="environmental-impact text-center">
                <div className="row g-3">
                  <div className="col-6">
                    <div className="impact-metric">
                      <i className="fas fa-recycle text-success" style={{ fontSize: '2rem' }}></i>
                      <h6 className="mt-2 text-success">{cartItemsWithDetails.length} kg</h6>
                      <small className="text-muted">Material reciclado</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="impact-metric">
                      <i className="fas fa-tree text-success" style={{ fontSize: '2rem' }}></i>
                      <h6 className="mt-2 text-success">0.5 kg</h6>
                      <small className="text-muted">CO₂ evitado</small>
                    </div>
                  </div>
                </div>
                <p className="small text-muted mt-3 mb-0">
                  Con tu compra contribuyes a la economía circular y reduces residuos industriales.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
