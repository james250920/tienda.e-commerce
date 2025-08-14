import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.component.css';
import { products, categories } from '../../data/mockData';
import { useCart, useFavorites } from '../../context/AppContext';

function HomeComponent() {
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const [addedProducts, setAddedProducts] = useState<Set<number>>(new Set());

  // Productos destacados y en oferta
  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 8);
  const saleProducts = products.filter(p => p.isOnSale).slice(0, 4);

  useEffect(() => {
    // Smooth scrolling para los enlaces del navbar
    const handleSmoothScroll = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      if (target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const targetElement = document.querySelector(target.getAttribute('href') || '');
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    };

    // Animación de aparición al hacer scroll
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).style.animationPlayState = 'running';
        }
      });
    }, observerOptions);

    // Event listeners
    document.addEventListener('click', handleSmoothScroll);

    // Observer para animaciones
    document.querySelectorAll('.fade-in-up').forEach(el => {
      (el as HTMLElement).style.animationPlayState = 'paused';
      observer.observe(el);
    });

    // Cleanup
    return () => {
      document.removeEventListener('click', handleSmoothScroll);
      observer.disconnect();
    };
  }, []);

  const handleAddToCart = (productId: number) => {
    addToCart(productId, 1);
    setAddedProducts((prev: Set<number>) => new Set(prev).add(productId));
    
    // Resetear el estado después de 2 segundos
    setTimeout(() => {
      setAddedProducts((prev: Set<number>) => {
        const newSet: Set<number> = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }, 2000);
  };

  const handleToggleFavorite = (productId: number) => {
    if (isFavorite(productId)) {
      removeFromFavorites(productId);
    } else {
      addToFavorites(productId);
    }
  };

  const formatPrice = (price: number): string => {
    return `S/ ${price.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section" id="inicio">
        <div className="container">
          <div className="row align-items-center min-vh-75">
            <div className="col-lg-6">
              <div className="hero-content">
                <h1 className="hero-title display-4 fw-bold text-success mb-4">
                  ¡Descubre el Poder de la Merma!
                </h1>
                <p className="hero-subtitle lead text-muted mb-4">
                  Materiales Reciclados a Precios Increíbles.<br/>
                  Tu aliado para transformar residuos en oportunidades sostenibles.
                </p>
                <div className="d-flex flex-wrap gap-3">
                  <Link to="/product" className="btn btn-success btn-lg">
                    <i className="fas fa-recycle me-2"></i> Explorar Productos
                  </Link>
                  <Link to="/register" className="btn btn-outline-success btn-lg">
                    <i className="fas fa-user-plus me-2"></i> Únete a la Familia
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <div className="hero-visual d-flex flex-column align-items-center">
                <div className="hero-icon mb-4">
                  <i className="fas fa-recycle text-success" style={{ fontSize: '8rem' }}></i>
                </div>
                <div className="qr-section bg-white rounded-3 p-4 shadow">
                  <img 
                    src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://mermayreciclaje.pe/app" 
                    alt="QR descarga app" 
                    className="mb-3"
                    style={{ width: '180px', height: '180px' }} 
                  />
                  <div className="fw-bold text-dark">
                    Descarga la app<br />para ser parte de nuestra<br />familia recicladora
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">¿Por qué elegir Merma y Reciclaje?</h2>
            <p className="text-muted">Comprometidos con un futuro más sostenible para el Perú</p>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="feature-card h-100 text-center p-4 bg-white rounded-3 shadow-sm">
                <div className="feature-icon mb-3">
                  <i className="fas fa-shipping-fast text-success" style={{ fontSize: '3rem' }}></i>
                </div>
                <h3 className="feature-title h5">Envío Sostenible</h3>
                <p className="text-muted">Entregas responsables en Lima y provincias, reduciendo la huella ambiental.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card h-100 text-center p-4 bg-white rounded-3 shadow-sm">
                <div className="feature-icon mb-3">
                  <i className="fas fa-recycle text-success" style={{ fontSize: '3rem' }}></i>
                </div>
                <h3 className="feature-title h5">Economía Circular</h3>
                <p className="text-muted">Promovemos el reciclaje y la reutilización de materiales en todo el Perú.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card h-100 text-center p-4 bg-white rounded-3 shadow-sm">
                <div className="feature-icon mb-3">
                  <i className="fas fa-users text-success" style={{ fontSize: '3rem' }}></i>
                </div>
                <h3 className="feature-title h5">Comunidad Recicladora</h3>
                <p className="text-muted">Únete a miles de peruanos que apuestan por un futuro más verde y sostenible.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">Categorías de Productos</h2>
            <p className="text-muted">Explora nuestras categorías de materiales reciclados</p>
          </div>
          <div className="row g-4">
            {categories.map((category) => (
              <div key={category.id} className="col-lg-4 col-md-6">
                <Link to={`/product?category=${category.id}`} className="text-decoration-none">
                  <div className="category-card h-100 p-4 bg-white rounded-3 shadow-sm hover-lift">
                    <div className="d-flex align-items-center mb-3">
                      <div className="category-icon me-3">
                        <i className={`${category.icon} text-success`} style={{ fontSize: '2.5rem' }}></i>
                      </div>
                      <div>
                        <h4 className="category-title h5 mb-1 text-dark">{category.name}</h4>
                        <p className="text-muted mb-0 small">{category.description}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sale Products Section */}
      <section className="sale-section py-5 bg-success text-white">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">¡Ofertas Especiales!</h2>
            <p className="mb-0">Productos con descuentos increíbles por tiempo limitado</p>
          </div>
          <div className="row g-4">
            {saleProducts.map((product) => (
              <div key={product.id} className="col-lg-3 col-md-6">
                <div className="product-card h-100 bg-white rounded-3 shadow position-relative">
                  <div className="position-absolute top-0 start-0 bg-danger text-white px-2 py-1 rounded-bottom-end">
                    <small className="fw-bold">
                      -{Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)}%
                    </small>
                  </div>
                  <div className="product-image text-center p-4">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="img-fluid rounded"
                      style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="product-info p-3">
                    <h5 className="product-title text-dark">{product.name}</h5>
                    <div className="price-container mb-2">
                      <span className="product-price fw-bold text-success fs-5">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="original-price text-muted text-decoration-line-through ms-2">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <button 
                        className={`btn ${addedProducts.has(product.id) ? 'btn-success' : 'btn-outline-success'} btn-sm`}
                        onClick={() => handleAddToCart(product.id)}
                        disabled={addedProducts.has(product.id)}
                      >
                        {addedProducts.has(product.id) ? (
                          <>
                            <i className="fas fa-check me-1"></i> Agregado
                          </>
                        ) : (
                          <>
                            <i className="fas fa-cart-plus me-1"></i> Agregar
                          </>
                        )}
                      </button>
                      <button 
                        className={`btn ${isFavorite(product.id) ? 'btn-danger' : 'btn-outline-danger'} btn-sm`}
                        onClick={() => handleToggleFavorite(product.id)}
                      >
                        <i className={`fas fa-heart${isFavorite(product.id) ? '' : '-o'}`}></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="products-section py-5" id="productos">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">Productos Destacados</h2>
            <p className="text-muted">Los mejores productos de merma y reciclaje en Perú</p>
          </div>
          <div className="row g-4">
            {featuredProducts.map((product) => (
              <div key={product.id} className="col-lg-3 col-md-6">
                <div className="product-card h-100 bg-white rounded-3 shadow position-relative">
                  {product.isOnSale && (
                    <div className="position-absolute top-0 start-0 bg-danger text-white px-2 py-1 rounded-bottom-end">
                      <small className="fw-bold">OFERTA</small>
                    </div>
                  )}
                  <div className="product-image text-center p-3">
                    <Link to={`/product/${product.id}`}>
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="img-fluid rounded"
                        style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                      />
                    </Link>
                  </div>
                  <div className="product-info p-3">
                    <h5 className="product-title">
                      <Link to={`/product/${product.id}`} className="text-decoration-none text-dark">
                        {product.name}
                      </Link>
                    </h5>
                    <div className="rating mb-2">
                      {[...Array(5)].map((_, i) => (
                        <i 
                          key={i} 
                          className={`fas fa-star ${i < Math.floor(product.rating) ? 'text-warning' : 'text-muted'}`}
                        ></i>
                      ))}
                      <small className="text-muted ms-1">({product.reviews})</small>
                    </div>
                    <div className="price-container mb-3">
                      <span className="product-price fw-bold text-success fs-5">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="original-price text-muted text-decoration-line-through ms-2">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                    <p className="text-muted small mb-3">{product.description.substring(0, 80)}...</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <button 
                        className={`btn ${addedProducts.has(product.id) ? 'btn-success' : 'btn-outline-success'} btn-sm`}
                        onClick={() => handleAddToCart(product.id)}
                        disabled={addedProducts.has(product.id)}
                      >
                        {addedProducts.has(product.id) ? (
                          <>
                            <i className="fas fa-check me-1"></i> Agregado
                          </>
                        ) : (
                          <>
                            <i className="fas fa-cart-plus me-1"></i> Agregar
                          </>
                        )}
                      </button>
                      <button 
                        className={`btn ${isFavorite(product.id) ? 'btn-danger' : 'btn-outline-danger'} btn-sm`}
                        onClick={() => handleToggleFavorite(product.id)}
                      >
                        <i className={`fas fa-heart${isFavorite(product.id) ? '' : '-o'}`}></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-5">
            <Link to="/product" className="btn btn-success btn-lg">
              <i className="fas fa-eye me-2"></i> Ver Todos los Productos
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section py-5 bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6 text-center">
              <h3 className="mb-3">¡Únete a nuestra familia recicladora!</h3>
              <p className="text-muted mb-4">
                Recibe ofertas exclusivas y noticias sobre sostenibilidad directamente en tu email
              </p>
              <form className="d-flex gap-2">
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="Tu email aquí..."
                  required
                />
                <button type="submit" className="btn btn-success">
                  <i className="fas fa-paper-plane me-1"></i> Suscribirse
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomeComponent;
