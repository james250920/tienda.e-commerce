import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products, reviews, categories } from '../../data/mockData';
import { useCart, useFavorites } from '../../context/AppContext';
import type { Product } from '../../data/mockData';

export default function ProductDetailsComponent() {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    if (id) {
      const foundProduct = products.find(p => p.id === parseInt(id));
      setProduct(foundProduct || null);
    }
  }, [id]);

  if (!product) {
    return (
      <div className="container py-5 text-center">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <i className="fas fa-exclamation-triangle text-warning" style={{ fontSize: '4rem' }}></i>
            <h3 className="mt-3">Producto no encontrado</h3>
            <p className="text-muted">El producto que buscas no existe o ha sido removido.</p>
            <Link to="/product" className="btn btn-success">
              <i className="fas fa-arrow-left me-2"></i> Volver a Productos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const productReviews = reviews.filter(r => r.productId === product.id);
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const category = categories.find(c => c.id === product.category);

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  const handleToggleFavorite = () => {
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product.id);
    }
  };

  const formatPrice = (price: number): string => {
    return `S/ ${price.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const images = [product.image, product.image, product.image]; // En un proyecto real tendrías múltiples imágenes

  return (
    <div className="container py-4">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/" className="text-decoration-none">Inicio</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/product" className="text-decoration-none">Productos</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to={`/product?category=${product.category}`} className="text-decoration-none">
              {category?.name}
            </Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="row">
        {/* Galería de Imágenes */}
        <div className="col-lg-6 mb-4">
          <div className="product-gallery">
            {/* Imagen Principal */}
            <div className="main-image mb-3">
              <img 
                src={images[selectedImage]} 
                alt={product.name}
                className="img-fluid rounded shadow"
                style={{ width: '100%', height: '400px', objectFit: 'cover' }}
              />
            </div>
            
            {/* Thumbnails */}
            <div className="thumbnail-images d-flex gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  className={`btn p-0 ${selectedImage === index ? 'border-success' : 'border-light'}`}
                  style={{ width: '80px', height: '80px' }}
                  onClick={() => setSelectedImage(index)}
                >
                  <img 
                    src={image} 
                    alt={`${product.name} ${index + 1}`}
                    className="img-fluid rounded"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Información del Producto */}
        <div className="col-lg-6 mb-4">
          <div className="product-info">
            {/* Badges y Categoría */}
            <div className="mb-3">
              <span className="badge bg-light text-dark me-2">
                <i className={`${category?.icon} me-1`}></i>
                {category?.name}
              </span>
              {product.isOnSale && (
                <span className="badge bg-danger me-2">OFERTA</span>
              )}
              {product.isFeatured && (
                <span className="badge bg-success">DESTACADO</span>
              )}
            </div>

            {/* Título */}
            <h1 className="product-title h2 text-dark mb-3">{product.name}</h1>

            {/* Rating */}
            <div className="rating mb-3">
              <div className="d-flex align-items-center">
                <div className="stars me-2">
                  {[...Array(5)].map((_, i) => (
                    <i 
                      key={i} 
                      className={`fas fa-star ${i < Math.floor(product.rating) ? 'text-warning' : 'text-muted'}`}
                    ></i>
                  ))}
                </div>
                <span className="rating-value fw-bold me-2">{product.rating}</span>
                <span className="text-muted">({product.reviews} reseñas)</span>
              </div>
            </div>

            {/* Precio */}
            <div className="price-section mb-4">
              <div className="current-price">
                <span className="h2 text-success fw-bold">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="original-price text-muted text-decoration-line-through ms-3 h5">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="badge bg-success ms-2 fs-6">
                      -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Descripción */}
            <div className="description mb-4">
              <h5>Descripción</h5>
              <p className="text-muted">{product.description}</p>
            </div>

            {/* Características */}
            <div className="product-features mb-4">
              <h5>Características</h5>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <i className="fas fa-leaf text-success me-2"></i>
                  <strong>Material:</strong> {product.material}
                </li>
                <li className="mb-2">
                  <i className="fas fa-recycle text-success me-2"></i>
                  <strong>Categoría:</strong> {category?.name}
                </li>
                <li className="mb-2">
                  <i className="fas fa-star text-warning me-2"></i>
                  <strong>Calificación de Sostenibilidad:</strong>
                  <div className="d-inline-block ms-2">
                    {[...Array(5)].map((_, i) => (
                      <i 
                        key={i} 
                        className={`fas fa-leaf ${i < product.sustainabilityRating ? 'text-success' : 'text-muted'}`}
                        style={{ fontSize: '0.9rem' }}
                      ></i>
                    ))}
                  </div>
                </li>
                <li>
                  <i className="fas fa-tags text-primary me-2"></i>
                  <strong>Tags:</strong> 
                  {product.tags.map((tag) => (
                    <span key={tag} className="badge bg-light text-dark ms-1">
                      {tag}
                    </span>
                  ))}
                </li>
              </ul>
            </div>

            {/* Stock */}
            <div className="stock-info mb-4">
              <div className="d-flex align-items-center">
                <i className="fas fa-box text-info me-2"></i>
                <span className="fw-semibold">Stock disponible:</span>
                <span className={`ms-2 badge ${product.stock > 10 ? 'bg-success' : product.stock > 0 ? 'bg-warning' : 'bg-danger'}`}>
                  {product.stock > 0 ? `${product.stock} unidades` : 'Agotado'}
                </span>
              </div>
            </div>

            {/* Selector de Cantidad y Botones */}
            <div className="purchase-section">
              <div className="row g-3 mb-3">
                <div className="col-md-4">
                  <label className="form-label">Cantidad</label>
                  <div className="input-group">
                    <button 
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <i className="fas fa-minus"></i>
                    </button>
                    <input 
                      type="number" 
                      className="form-control text-center"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                      min="1"
                      max={product.stock}
                    />
                    <button 
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div className="row g-3">
                <div className="col-md-8">
                  <button 
                    className={`btn w-100 ${addedToCart ? 'btn-success' : 'btn-success'} btn-lg`}
                    onClick={handleAddToCart}
                    disabled={product.stock === 0 || addedToCart}
                  >
                    {addedToCart ? (
                      <>
                        <i className="fas fa-check me-2"></i> ¡Agregado al Carrito!
                      </>
                    ) : product.stock === 0 ? (
                      <>
                        <i className="fas fa-times me-2"></i> Agotado
                      </>
                    ) : (
                      <>
                        <i className="fas fa-cart-plus me-2"></i> Agregar al Carrito
                      </>
                    )}
                  </button>
                </div>
                <div className="col-md-4">
                  <button 
                    className={`btn w-100 ${isFavorite(product.id) ? 'btn-danger' : 'btn-outline-danger'} btn-lg`}
                    onClick={handleToggleFavorite}
                  >
                    <i className={`fas fa-heart${isFavorite(product.id) ? '' : '-o'}`}></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs de Información Adicional */}
      <div className="row mt-5">
        <div className="col-12">
          <ul className="nav nav-tabs" id="productTabs" role="tablist">
            <li className="nav-item" role="presentation">
              <button 
                className="nav-link active" 
                id="description-tab" 
                data-bs-toggle="tab" 
                data-bs-target="#description" 
                type="button" 
                role="tab"
              >
                Descripción Detallada
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button 
                className="nav-link" 
                id="reviews-tab" 
                data-bs-toggle="tab" 
                data-bs-target="#reviews" 
                type="button" 
                role="tab"
              >
                Reseñas ({productReviews.length})
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button 
                className="nav-link" 
                id="sustainability-tab" 
                data-bs-toggle="tab" 
                data-bs-target="#sustainability" 
                type="button" 
                role="tab"
              >
                Impacto Ambiental
              </button>
            </li>
          </ul>
          
          <div className="tab-content" id="productTabsContent">
            {/* Descripción Detallada */}
            <div className="tab-pane fade show active" id="description" role="tabpanel">
              <div className="p-4 bg-white rounded-bottom shadow-sm">
                <h5>Descripción Completa</h5>
                <p>{product.description}</p>
                <p>
                  Este producto es parte de nuestra iniciativa de economía circular, 
                  donde transformamos materiales de merma industrial en productos útiles 
                  y de alta calidad. Al elegir este producto, contribuyes a reducir los 
                  residuos industriales y apoyas la sostenibilidad en el Perú.
                </p>
                <h6>Especificaciones:</h6>
                <ul>
                  <li><strong>Material:</strong> {product.material}</li>
                  <li><strong>Origen:</strong> Merma industrial recuperada</li>
                  <li><strong>Proceso:</strong> Reciclado y reacondicionado</li>
                  <li><strong>Certificación:</strong> Producto eco-friendly certificado</li>
                </ul>
              </div>
            </div>

            {/* Reseñas */}
            <div className="tab-pane fade" id="reviews" role="tabpanel">
              <div className="p-4 bg-white rounded-bottom shadow-sm">
                <h5>Reseñas de Clientes</h5>
                {productReviews.length === 0 ? (
                  <p className="text-muted">Aún no hay reseñas para este producto. ¡Sé el primero en opinar!</p>
                ) : (
                  <div className="reviews-list">
                    {productReviews.map(review => (
                      <div key={review.id} className="review-item border-bottom pb-3 mb-3">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <h6 className="mb-1">{review.userName}</h6>
                            <div className="rating">
                              {[...Array(5)].map((_, i) => (
                                <i 
                                  key={i} 
                                  className={`fas fa-star ${i < review.rating ? 'text-warning' : 'text-muted'}`}
                                ></i>
                              ))}
                            </div>
                          </div>
                          <small className="text-muted">{review.date}</small>
                        </div>
                        <p className="mb-0">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Impacto Ambiental */}
            <div className="tab-pane fade" id="sustainability" role="tabpanel">
              <div className="p-4 bg-white rounded-bottom shadow-sm">
                <h5>Impacto Ambiental Positivo</h5>
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="sustainability-metric text-center p-3 bg-light rounded">
                      <i className="fas fa-recycle text-success" style={{ fontSize: '3rem' }}></i>
                      <h6 className="mt-2">Material Reciclado</h6>
                      <p className="text-muted mb-0">100% fabricado con materiales recuperados</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="sustainability-metric text-center p-3 bg-light rounded">
                      <i className="fas fa-leaf text-success" style={{ fontSize: '3rem' }}></i>
                      <h6 className="mt-2">Huella de Carbono</h6>
                      <p className="text-muted mb-0">60% menos emisiones que productos nuevos</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <h6>Al comprar este producto:</h6>
                  <ul className="list-unstyled">
                    <li><i className="fas fa-check text-success me-2"></i> Evitas que materiales terminen en vertederos</li>
                    <li><i className="fas fa-check text-success me-2"></i> Reduces la demanda de materiales vírgenes</li>
                    <li><i className="fas fa-check text-success me-2"></i> Apoyas la economía circular en el Perú</li>
                    <li><i className="fas fa-check text-success me-2"></i> Contribuyes a la creación de empleos verdes</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Productos Relacionados */}
      {relatedProducts.length > 0 && (
        <div className="row mt-5">
          <div className="col-12">
            <h3 className="text-success mb-4">Productos Relacionados</h3>
            <div className="row g-4">
              {relatedProducts.map(relatedProduct => (
                <div key={relatedProduct.id} className="col-lg-3 col-md-6">
                  <div className="product-card h-100 bg-white rounded-3 shadow-sm">
                    <div className="product-image text-center p-3">
                      <Link to={`/product/${relatedProduct.id}`}>
                        <img 
                          src={relatedProduct.image} 
                          alt={relatedProduct.name}
                          className="img-fluid rounded"
                          style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                        />
                      </Link>
                    </div>
                    <div className="product-info p-3">
                      <h6 className="product-title">
                        <Link to={`/product/${relatedProduct.id}`} className="text-decoration-none text-dark">
                          {relatedProduct.name}
                        </Link>
                      </h6>
                      <div className="price-container">
                        <span className="product-price fw-bold text-success">
                          {formatPrice(relatedProduct.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
