import { Link } from 'react-router-dom';
import { useFavorites, useCart } from '../../context/AppContext';
import { products } from '../../data/mockData';

export default function FavoriteComponent() {
  const { favorites, removeFromFavorites } = useFavorites();
  const { addToCart } = useCart();

  const favoriteProducts = products.filter(product => favorites.includes(product.id));

  const formatPrice = (price: number): string => {
    return `S/ ${price.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handleAddToCart = (productId: number) => {
    addToCart(productId, 1);
  };

  if (favoriteProducts.length === 0) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-6 text-center">
            <div className="empty-favorites">
              <i className="fas fa-heart text-muted mb-4" style={{ fontSize: '5rem' }}></i>
              <h2 className="text-muted mb-3">No tienes favoritos aún</h2>
              <p className="text-muted mb-4">
                Descubre nuestros productos hechos con materiales reciclados y agrega algunos a tu lista de favoritos
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

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="text-success">
              <i className="fas fa-heart me-2"></i>
              Mis Favoritos
            </h1>
            <Link to="/product" className="btn btn-outline-success">
              <i className="fas fa-arrow-left me-2"></i>
              Seguir Explorando
            </Link>
          </div>
          <p className="text-muted">
            {favoriteProducts.length} producto{favoriteProducts.length !== 1 ? 's' : ''} en tu lista de favoritos
          </p>
        </div>
      </div>

      {/* Grid de Productos Favoritos */}
      <div className="row g-4">
        {favoriteProducts.map(product => (
          <div key={product.id} className="col-lg-3 col-md-6 col-sm-6">
            <div className="product-card h-100 bg-white rounded-3 shadow-sm position-relative">
              {/* Badge de Favorito */}
              <div className="position-absolute top-0 end-0 p-2 z-index-1">
                <button 
                  className="btn btn-sm btn-danger rounded-circle p-2"
                  onClick={() => removeFromFavorites(product.id)}
                  title="Remover de favoritos"
                >
                  <i className="fas fa-heart"></i>
                </button>
              </div>

              {/* Badges del Producto */}
              <div className="position-absolute top-0 start-0 p-2 z-index-1">
                <div className="d-flex flex-column gap-1">
                  {product.isOnSale && (
                    <span className="badge bg-danger small">OFERTA</span>
                  )}
                  {product.isFeatured && (
                    <span className="badge bg-success small">DESTACADO</span>
                  )}
                </div>
              </div>

              {/* Imagen del Producto */}
              <div className="product-image text-center p-3">
                <Link to={`/product/${product.id}`}>
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="img-fluid rounded"
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                  />
                </Link>
              </div>

              <div className="product-info p-3">
                {/* Título del Producto */}
                <h6 className="product-title mb-2">
                  <Link to={`/product/${product.id}`} className="text-decoration-none text-dark">
                    {product.name}
                  </Link>
                </h6>

                {/* Material */}
                <p className="text-muted small mb-2">
                  <i className="fas fa-leaf me-1"></i>
                  {product.material}
                </p>

                {/* Rating */}
                <div className="rating mb-2">
                  <div className="d-flex align-items-center">
                    <div className="stars me-2">
                      {[...Array(5)].map((_, i) => (
                        <i 
                          key={i} 
                          className={`fas fa-star ${i < Math.floor(product.rating) ? 'text-warning' : 'text-muted'}`}
                          style={{ fontSize: '0.8rem' }}
                        ></i>
                      ))}
                    </div>
                    <span className="rating-value small text-muted">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>
                </div>

                {/* Calificación de Sostenibilidad */}
                <div className="sustainability-rating mb-3">
                  <div className="d-flex align-items-center">
                    <span className="small text-muted me-2">Sostenibilidad:</span>
                    <div className="sustainability-stars">
                      {[...Array(5)].map((_, i) => (
                        <i 
                          key={i} 
                          className={`fas fa-leaf ${i < product.sustainabilityRating ? 'text-success' : 'text-muted'}`}
                          style={{ fontSize: '0.8rem' }}
                        ></i>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Precio */}
                <div className="price-container mb-3">
                  <div className="d-flex align-items-center">
                    <span className="product-price fw-bold text-success h6 mb-0">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="original-price text-muted text-decoration-line-through ms-2 small">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  {product.originalPrice && (
                    <small className="text-success fw-semibold">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% de descuento
                    </small>
                  )}
                </div>

                {/* Stock */}
                <div className="stock-info mb-3">
                  <span className={`badge ${product.stock > 10 ? 'bg-success' : product.stock > 0 ? 'bg-warning' : 'bg-danger'}`}>
                    {product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}
                  </span>
                </div>

                {/* Acciones */}
                <div className="product-actions d-grid gap-2">
                  <button 
                    className="btn btn-success"
                    onClick={() => handleAddToCart(product.id)}
                    disabled={product.stock === 0}
                  >
                    <i className="fas fa-cart-plus me-2"></i>
                    {product.stock === 0 ? 'Agotado' : 'Agregar al Carrito'}
                  </button>
                  <Link 
                    to={`/product/${product.id}`} 
                    className="btn btn-outline-success"
                  >
                    <i className="fas fa-eye me-2"></i>
                    Ver Detalles
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sugerencias */}
      <div className="row mt-5">
        <div className="col-12">
          <div className="card bg-light">
            <div className="card-body text-center">
              <h5 className="text-success">
                <i className="fas fa-lightbulb me-2"></i>
                ¿Te gustaron estos productos?
              </h5>
              <p className="text-muted mb-3">
                Explora más productos similares hechos con materiales reciclados
              </p>
              <Link to="/product" className="btn btn-success">
                <i className="fas fa-search me-2"></i>
                Descubrir Más Productos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
