import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { products, categories } from '../../data/mockData';
import { useCart, useFavorites } from '../../context/AppContext';
import type { Product } from '../../data/mockData';

export default function ProductComponent() {
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [addedProducts, setAddedProducts] = useState<Set<number>>(new Set());

  useEffect(() => {
    let filtered = [...products];

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filtrar por categoría
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filtrar por rango de precio
    filtered = filtered.filter(product => 
      product.price >= priceRange.min && product.price <= priceRange.max
    );

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return b.id - a.id;
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, sortBy, priceRange]);

  const handleAddToCart = (productId: number) => {
    addToCart(productId, 1);
    setAddedProducts(prev => new Set(prev).add(productId));
    
    setTimeout(() => {
      setAddedProducts(prev => {
        const newSet = new Set(prev);
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

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSortBy('name');
    setPriceRange({ min: 0, max: 1000 });
    setSearchParams({});
  };

  return (
    <div className="container-fluid py-4">
      <div className="row">
        {/* Sidebar de Filtros */}
        <div className="col-lg-3 col-md-4 mb-4">
          <div className="bg-white rounded-3 shadow-sm p-4 sticky-top">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="text-success mb-0">Filtros</h5>
              <button 
                className="btn btn-outline-secondary btn-sm"
                onClick={clearFilters}
              >
                Limpiar
              </button>
            </div>

            {/* Búsqueda */}
            <div className="mb-4">
              <label className="form-label fw-semibold">Buscar</label>
              <input
                type="text"
                className="form-control"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Categorías */}
            <div className="mb-4">
              <label className="form-label fw-semibold">Categoría</label>
              <select
                className="form-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Todas las categorías</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Rango de Precio */}
            <div className="mb-4">
              <label className="form-label fw-semibold">
                Precio: {formatPrice(priceRange.min)} - {formatPrice(priceRange.max)}
              </label>
              <div className="row g-2">
                <div className="col-6">
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    placeholder="Mín"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                  />
                </div>
                <div className="col-6">
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    placeholder="Máx"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                  />
                </div>
              </div>
            </div>

            {/* Categorías como botones */}
            <div className="mb-4">
              <label className="form-label fw-semibold">Categorías Populares</label>
              <div className="d-flex flex-column gap-2">
                {categories.slice(0, 4).map(category => (
                  <button
                    key={category.id}
                    className={`btn btn-outline-success btn-sm text-start ${selectedCategory === category.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category.id === selectedCategory ? '' : category.id)}
                  >
                    <i className={`${category.icon} me-2`}></i>
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="col-lg-9 col-md-8">
          {/* Header y Ordenamiento */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="text-success mb-1">Productos de Merma y Reciclaje</h2>
              <p className="text-muted mb-0">
                {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="d-flex align-items-center gap-3">
              <label className="form-label mb-0 text-nowrap">Ordenar por:</label>
              <select
                className="form-select form-select-sm"
                style={{ width: 'auto' }}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Nombre A-Z</option>
                <option value="price-low">Precio: Menor a Mayor</option>
                <option value="price-high">Precio: Mayor a Menor</option>
                <option value="rating">Mejor Calificados</option>
                <option value="newest">Más Recientes</option>
              </select>
            </div>
          </div>

          {/* Grid de Productos */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-search text-muted" style={{ fontSize: '4rem' }}></i>
              <h4 className="text-muted mt-3">No se encontraron productos</h4>
              <p className="text-muted">Intenta ajustar los filtros o cambiar el término de búsqueda</p>
              <button className="btn btn-success" onClick={clearFilters}>
                Ver todos los productos
              </button>
            </div>
          ) : (
            <div className="row g-4">
              {filteredProducts.map((product) => (
                <div key={product.id} className="col-xl-4 col-lg-6 col-md-6">
                  <div className="product-card h-100 bg-white rounded-3 shadow-sm position-relative">
                    {/* Badges */}
                    <div className="position-absolute top-0 start-0 p-2 d-flex flex-column gap-1" style={{ zIndex: 1 }}>
                      {product.isOnSale && (
                        <span className="badge bg-danger">
                          OFERTA
                        </span>
                      )}
                      {product.isFeatured && (
                        <span className="badge bg-success">
                          DESTACADO
                        </span>
                      )}
                    </div>

                    {/* Botón de Favoritos */}
                    <button
                      className={`btn position-absolute top-0 end-0 m-2 ${isFavorite(product.id) ? 'btn-danger' : 'btn-outline-light'}`}
                      style={{ zIndex: 1 }}
                      onClick={() => handleToggleFavorite(product.id)}
                    >
                      <i className={`fas fa-heart${isFavorite(product.id) ? '' : '-o'}`}></i>
                    </button>

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

                    {/* Información del Producto */}
                    <div className="product-info p-3">
                      <div className="mb-2">
                        <span className="badge bg-light text-dark small">
                          {categories.find(c => c.id === product.category)?.name}
                        </span>
                      </div>

                      <h5 className="product-title mb-2">
                        <Link to={`/product/${product.id}`} className="text-decoration-none text-dark">
                          {product.name}
                        </Link>
                      </h5>

                      {/* Rating */}
                      <div className="rating mb-2">
                        {[...Array(5)].map((_, i) => (
                          <i 
                            key={i} 
                            className={`fas fa-star ${i < Math.floor(product.rating) ? 'text-warning' : 'text-muted'}`}
                          ></i>
                        ))}
                        <small className="text-muted ms-1">({product.reviews})</small>
                      </div>

                      {/* Precio */}
                      <div className="price-container mb-3">
                        <span className="product-price fw-bold text-success fs-5">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && (
                          <>
                            <span className="original-price text-muted text-decoration-line-through ms-2">
                              {formatPrice(product.originalPrice)}
                            </span>
                            <span className="badge bg-success ms-2">
                              -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                            </span>
                          </>
                        )}
                      </div>

                      {/* Descripción */}
                      <p className="text-muted small mb-3">
                        {product.description.substring(0, 100)}...
                      </p>

                      {/* Material y Sostenibilidad */}
                      <div className="mb-3">
                        <small className="text-muted d-block">Material: {product.material}</small>
                        <div className="d-flex align-items-center">
                          <small className="text-muted me-2">Sostenibilidad:</small>
                          {[...Array(5)].map((_, i) => (
                            <i 
                              key={i} 
                              className={`fas fa-leaf ${i < product.sustainabilityRating ? 'text-success' : 'text-muted'}`}
                              style={{ fontSize: '0.8rem' }}
                            ></i>
                          ))}
                        </div>
                      </div>

                      {/* Stock */}
                      <div className="mb-3">
                        <small className={`badge ${product.stock > 10 ? 'bg-success' : product.stock > 0 ? 'bg-warning' : 'bg-danger'}`}>
                          {product.stock > 0 ? `${product.stock} en stock` : 'Agotado'}
                        </small>
                      </div>

                      {/* Botones de Acción */}
                      <div className="d-grid gap-2">
                        <button 
                          className={`btn ${addedProducts.has(product.id) ? 'btn-success' : 'btn-outline-success'}`}
                          onClick={() => handleAddToCart(product.id)}
                          disabled={addedProducts.has(product.id) || product.stock === 0}
                        >
                          {addedProducts.has(product.id) ? (
                            <>
                              <i className="fas fa-check me-2"></i> Agregado al Carrito
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
                        <Link 
                          to={`/product/${product.id}`} 
                          className="btn btn-outline-primary btn-sm"
                        >
                          <i className="fas fa-eye me-2"></i> Ver Detalles
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Paginación (simulada) */}
          {filteredProducts.length > 0 && (
            <nav className="mt-5">
              <ul className="pagination justify-content-center">
                <li className="page-item disabled">
                  <span className="page-link">Anterior</span>
                </li>
                <li className="page-item active">
                  <span className="page-link">1</span>
                </li>
                <li className="page-item">
                  <a className="page-link" href="#">2</a>
                </li>
                <li className="page-item">
                  <a className="page-link" href="#">3</a>
                </li>
                <li className="page-item">
                  <a className="page-link" href="#">Siguiente</a>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
