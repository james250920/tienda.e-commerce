import { useState } from 'react';
import { useAuth, useCart, useFavorites } from '../../context/AppContext';
import { products } from '../../data/mockData';

export default function ProfileComponent() {
  const { user, logout } = useAuth();
  const { cart, getCartTotal } = useCart();
  const { favorites } = useFavorites();
  const [activeTab, setActiveTab] = useState('overview');

  if (!user) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-6 text-center">
            <i className="fas fa-user-times text-muted mb-4" style={{ fontSize: '5rem' }}></i>
            <h2 className="text-muted mb-3">Inicia sesión para ver tu perfil</h2>
            <p className="text-muted mb-4">
              Accede a tu cuenta para ver tu información personal y historial de compras
            </p>
            <a href="/login" className="btn btn-success btn-lg">
              <i className="fas fa-sign-in-alt me-2"></i>
              Iniciar Sesión
            </a>
          </div>
        </div>
      </div>
    );
  }

  const cartTotal = getCartTotal(products);
  const favoriteProducts = products.filter(product => favorites.includes(product.id));

  const formatPrice = (price: number): string => {
    return `S/ ${price.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="container py-4">
      {/* Header del Perfil */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card bg-gradient-success text-white">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-2 text-center">
                  <div className="profile-avatar bg-white rounded-circle d-inline-flex align-items-center justify-content-center" 
                       style={{ width: '80px', height: '80px' }}>
                    <i className="fas fa-user text-success" style={{ fontSize: '2rem' }}></i>
                  </div>
                </div>
                <div className="col-md-7">
                  <h2 className="mb-1">{user.name}</h2>
                  <p className="mb-0 opacity-75">
                    <i className="fas fa-envelope me-2"></i>
                    {user.email}
                  </p>
                  <p className="mb-0 mt-2">
                    <i className="fas fa-calendar me-2"></i>
                    Miembro desde Enero 2024
                  </p>
                </div>
                <div className="col-md-3 text-center">
                  <div className="eco-stats">
                    <h4 className="mb-1">2.5 kg</h4>
                    <small className="opacity-75">Material reciclado</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navegación de Tabs */}
      <div className="row mb-4">
        <div className="col-12">
          <ul className="nav nav-pills nav-fill">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <i className="fas fa-tachometer-alt me-2"></i>
                Resumen
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                <i className="fas fa-shopping-bag me-2"></i>
                Mis Pedidos
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'favorites' ? 'active' : ''}`}
                onClick={() => setActiveTab('favorites')}
              >
                <i className="fas fa-heart me-2"></i>
                Favoritos ({favorites.length})
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'impact' ? 'active' : ''}`}
                onClick={() => setActiveTab('impact')}
              >
                <i className="fas fa-leaf me-2"></i>
                Mi Impacto
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => setActiveTab('settings')}
              >
                <i className="fas fa-cog me-2"></i>
                Configuración
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Contenido de Tabs */}
      <div className="row">
        <div className="col-12">
          
          {/* Tab: Resumen */}
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <div className="row g-4">
                {/* Estadísticas */}
                <div className="col-lg-3 col-md-6">
                  <div className="card border-0 shadow-sm">
                    <div className="card-body text-center">
                      <i className="fas fa-shopping-cart text-primary" style={{ fontSize: '2.5rem' }}></i>
                      <h3 className="mt-3 mb-1">{cart.length}</h3>
                      <p className="text-muted mb-0">Productos en Carrito</p>
                      <p className="small text-success mb-0">{formatPrice(cartTotal)}</p>
                    </div>
                  </div>
                </div>

                <div className="col-lg-3 col-md-6">
                  <div className="card border-0 shadow-sm">
                    <div className="card-body text-center">
                      <i className="fas fa-heart text-danger" style={{ fontSize: '2.5rem' }}></i>
                      <h3 className="mt-3 mb-1">{favorites.length}</h3>
                      <p className="text-muted mb-0">Productos Favoritos</p>
                    </div>
                  </div>
                </div>

                <div className="col-lg-3 col-md-6">
                  <div className="card border-0 shadow-sm">
                    <div className="card-body text-center">
                      <i className="fas fa-box text-warning" style={{ fontSize: '2.5rem' }}></i>
                      <h3 className="mt-3 mb-1">5</h3>
                      <p className="text-muted mb-0">Pedidos Realizados</p>
                    </div>
                  </div>
                </div>

                <div className="col-lg-3 col-md-6">
                  <div className="card border-0 shadow-sm">
                    <div className="card-body text-center">
                      <i className="fas fa-recycle text-success" style={{ fontSize: '2.5rem' }}></i>
                      <h3 className="mt-3 mb-1">2.5</h3>
                      <p className="text-muted mb-0">kg Reciclados</p>
                    </div>
                  </div>
                </div>

                {/* Pedidos Recientes */}
                <div className="col-lg-8">
                  <div className="card border-0 shadow-sm">
                    <div className="card-header">
                      <h5 className="mb-0">Pedidos Recientes</h5>
                    </div>
                    <div className="card-body">
                      <div className="list-group list-group-flush">
                        <div className="list-group-item d-flex justify-content-between align-items-center px-0">
                          <div>
                            <h6 className="mb-1">Pedido #001</h6>
                            <p className="mb-1">Contenedores Plásticos Reciclados</p>
                            <small className="text-muted">15 Enero 2024</small>
                          </div>
                          <div className="text-end">
                            <span className="badge bg-success">Entregado</span>
                            <div className="fw-bold">{formatPrice(125.50)}</div>
                          </div>
                        </div>
                        <div className="list-group-item d-flex justify-content-between align-items-center px-0">
                          <div>
                            <h6 className="mb-1">Pedido #002</h6>
                            <p className="mb-1">Bolsas Eco-friendly</p>
                            <small className="text-muted">10 Enero 2024</small>
                          </div>
                          <div className="text-end">
                            <span className="badge bg-warning">En tránsito</span>
                            <div className="fw-bold">{formatPrice(45.00)}</div>
                          </div>
                        </div>
                        <div className="list-group-item d-flex justify-content-between align-items-center px-0">
                          <div>
                            <h6 className="mb-1">Pedido #003</h6>
                            <p className="mb-1">Papel Reciclado Premium</p>
                            <small className="text-muted">5 Enero 2024</small>
                          </div>
                          <div className="text-end">
                            <span className="badge bg-success">Entregado</span>
                            <div className="fw-bold">{formatPrice(85.25)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actividad Reciente */}
                <div className="col-lg-4">
                  <div className="card border-0 shadow-sm">
                    <div className="card-header">
                      <h5 className="mb-0">Actividad Reciente</h5>
                    </div>
                    <div className="card-body">
                      <div className="timeline">
                        <div className="timeline-item">
                          <div className="timeline-marker bg-success"></div>
                          <div className="timeline-content">
                            <h6 className="small mb-1">Pedido entregado</h6>
                            <p className="small text-muted mb-0">Hace 2 días</p>
                          </div>
                        </div>
                        <div className="timeline-item">
                          <div className="timeline-marker bg-primary"></div>
                          <div className="timeline-content">
                            <h6 className="small mb-1">Producto agregado a favoritos</h6>
                            <p className="small text-muted mb-0">Hace 3 días</p>
                          </div>
                        </div>
                        <div className="timeline-item">
                          <div className="timeline-marker bg-warning"></div>
                          <div className="timeline-content">
                            <h6 className="small mb-1">Nuevo pedido realizado</h6>
                            <p className="small text-muted mb-0">Hace 5 días</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Mis Pedidos */}
          {activeTab === 'orders' && (
            <div className="orders-tab">
              <div className="card border-0 shadow-sm">
                <div className="card-header">
                  <h5 className="mb-0">Historial de Pedidos</h5>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Pedido</th>
                          <th>Fecha</th>
                          <th>Productos</th>
                          <th>Total</th>
                          <th>Estado</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>#001</td>
                          <td>15 Ene 2024</td>
                          <td>Contenedores Plásticos (x2)</td>
                          <td>{formatPrice(125.50)}</td>
                          <td><span className="badge bg-success">Entregado</span></td>
                          <td>
                            <button className="btn btn-sm btn-outline-primary">Ver Detalles</button>
                          </td>
                        </tr>
                        <tr>
                          <td>#002</td>
                          <td>10 Ene 2024</td>
                          <td>Bolsas Eco-friendly (x5)</td>
                          <td>{formatPrice(45.00)}</td>
                          <td><span className="badge bg-warning">En tránsito</span></td>
                          <td>
                            <button className="btn btn-sm btn-outline-primary">Rastrear</button>
                          </td>
                        </tr>
                        <tr>
                          <td>#003</td>
                          <td>5 Ene 2024</td>
                          <td>Papel Reciclado (x3)</td>
                          <td>{formatPrice(85.25)}</td>
                          <td><span className="badge bg-success">Entregado</span></td>
                          <td>
                            <button className="btn btn-sm btn-outline-primary">Ver Detalles</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Favoritos */}
          {activeTab === 'favorites' && (
            <div className="favorites-tab">
              {favoriteProducts.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-heart text-muted" style={{ fontSize: '4rem' }}></i>
                  <h4 className="mt-3 text-muted">No tienes favoritos aún</h4>
                  <p className="text-muted">Explora nuestros productos y agrega algunos a tu lista de favoritos</p>
                  <a href="/product" className="btn btn-success">Explorar Productos</a>
                </div>
              ) : (
                <div className="row g-4">
                  {favoriteProducts.slice(0, 6).map(product => (
                    <div key={product.id} className="col-lg-4 col-md-6">
                      <div className="card border-0 shadow-sm">
                        <img src={product.image} className="card-img-top" alt={product.name} style={{ height: '200px', objectFit: 'cover' }} />
                        <div className="card-body">
                          <h6 className="card-title">{product.name}</h6>
                          <p className="card-text text-muted small">{product.material}</p>
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="h6 text-success mb-0">{formatPrice(product.price)}</span>
                            <a href={`/product/${product.id}`} className="btn btn-sm btn-outline-success">Ver</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab: Mi Impacto */}
          {activeTab === 'impact' && (
            <div className="impact-tab">
              <div className="row g-4">
                <div className="col-lg-8">
                  <div className="card border-0 shadow-sm">
                    <div className="card-header bg-success text-white">
                      <h5 className="mb-0">
                        <i className="fas fa-leaf me-2"></i>
                        Tu Impacto Ambiental
                      </h5>
                    </div>
                    <div className="card-body">
                      <div className="row g-4">
                        <div className="col-md-4 text-center">
                          <div className="impact-metric">
                            <i className="fas fa-recycle text-success" style={{ fontSize: '3rem' }}></i>
                            <h3 className="mt-3 text-success">2.5 kg</h3>
                            <p className="text-muted">Material reciclado</p>
                          </div>
                        </div>
                        <div className="col-md-4 text-center">
                          <div className="impact-metric">
                            <i className="fas fa-tree text-success" style={{ fontSize: '3rem' }}></i>
                            <h3 className="mt-3 text-success">1.2 kg</h3>
                            <p className="text-muted">CO₂ evitado</p>
                          </div>
                        </div>
                        <div className="col-md-4 text-center">
                          <div className="impact-metric">
                            <i className="fas fa-tint text-success" style={{ fontSize: '3rem' }}></i>
                            <h3 className="mt-3 text-success">45 L</h3>
                            <p className="text-muted">Agua ahorrada</p>
                          </div>
                        </div>
                      </div>
                      
                      <hr />
                      
                      <div className="eco-achievements">
                        <h6 className="text-success mb-3">Logros Ambientales</h6>
                        <div className="row g-3">
                          <div className="col-md-6">
                            <div className="achievement-badge bg-light p-3 rounded">
                              <i className="fas fa-medal text-warning me-2"></i>
                              <strong>Eco Warrior</strong>
                              <p className="small text-muted mb-0">Primera compra realizada</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="achievement-badge bg-light p-3 rounded">
                              <i className="fas fa-award text-success me-2"></i>
                              <strong>Reciclador Activo</strong>
                              <p className="small text-muted mb-0">2kg de material reciclado</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="col-lg-4">
                  <div className="card border-0 shadow-sm">
                    <div className="card-header">
                      <h6 className="mb-0">Meta Mensual</h6>
                    </div>
                    <div className="card-body">
                      <div className="text-center">
                        <div className="progress mb-3" style={{ height: '10px' }}>
                          <div className="progress-bar bg-success" style={{ width: '60%' }}></div>
                        </div>
                        <p className="mb-0">60% completado</p>
                        <small className="text-muted">1.5 kg / 2.5 kg objetivo</small>
                      </div>
                    </div>
                  </div>
                  
                  <div className="card border-0 shadow-sm mt-3">
                    <div className="card-header">
                      <h6 className="mb-0">Próximo Logro</h6>
                    </div>
                    <div className="card-body">
                      <div className="text-center">
                        <i className="fas fa-trophy text-warning" style={{ fontSize: '2rem' }}></i>
                        <h6 className="mt-2">Super Reciclador</h6>
                        <p className="small text-muted">Necesitas reciclar 2.5 kg más</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Configuración */}
          {activeTab === 'settings' && (
            <div className="settings-tab">
              <div className="row g-4">
                <div className="col-lg-8">
                  <div className="card border-0 shadow-sm">
                    <div className="card-header">
                      <h5 className="mb-0">Información Personal</h5>
                    </div>
                    <div className="card-body">
                      <form>
                        <div className="row g-3">
                          <div className="col-md-6">
                            <label className="form-label">Nombre</label>
                            <input type="text" className="form-control" defaultValue={user.name.split(' ')[0]} />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Apellido</label>
                            <input type="text" className="form-control" defaultValue={user.name.split(' ')[1] || ''} />
                          </div>
                          <div className="col-12">
                            <label className="form-label">Email</label>
                            <input type="email" className="form-control" defaultValue={user.email} />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Teléfono</label>
                            <input type="tel" className="form-control" placeholder="+51 987 654 321" />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Fecha de Nacimiento</label>
                            <input type="date" className="form-control" />
                          </div>
                        </div>
                        <div className="mt-3">
                          <button type="submit" className="btn btn-success">Guardar Cambios</button>
                        </div>
                      </form>
                    </div>
                  </div>
                  
                  <div className="card border-0 shadow-sm mt-4">
                    <div className="card-header">
                      <h5 className="mb-0">Cambiar Contraseña</h5>
                    </div>
                    <div className="card-body">
                      <form>
                        <div className="row g-3">
                          <div className="col-12">
                            <label className="form-label">Contraseña Actual</label>
                            <input type="password" className="form-control" />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Nueva Contraseña</label>
                            <input type="password" className="form-control" />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Confirmar Nueva Contraseña</label>
                            <input type="password" className="form-control" />
                          </div>
                        </div>
                        <div className="mt-3">
                          <button type="submit" className="btn btn-success">Cambiar Contraseña</button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                
                <div className="col-lg-4">
                  <div className="card border-0 shadow-sm">
                    <div className="card-header">
                      <h6 className="mb-0">Preferencias</h6>
                    </div>
                    <div className="card-body">
                      <div className="form-check mb-3">
                        <input className="form-check-input" type="checkbox" id="emailNotifications" defaultChecked />
                        <label className="form-check-label" htmlFor="emailNotifications">
                          Notificaciones por email
                        </label>
                      </div>
                      <div className="form-check mb-3">
                        <input className="form-check-input" type="checkbox" id="smsNotifications" />
                        <label className="form-check-label" htmlFor="smsNotifications">
                          Notificaciones por SMS
                        </label>
                      </div>
                      <div className="form-check mb-3">
                        <input className="form-check-input" type="checkbox" id="promotions" defaultChecked />
                        <label className="form-check-label" htmlFor="promotions">
                          Recibir promociones
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="card border-0 shadow-sm mt-3">
                    <div className="card-header bg-danger text-white">
                      <h6 className="mb-0">Zona Peligrosa</h6>
                    </div>
                    <div className="card-body">
                      <p className="small text-muted mb-3">
                        Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, ten cuidado.
                      </p>
                      <button className="btn btn-danger btn-sm">Eliminar Cuenta</button>
                    </div>
                  </div>
                  
                  <div className="text-center mt-3">
                    <button className="btn btn-outline-secondary" onClick={logout}>
                      <i className="fas fa-sign-out-alt me-2"></i>
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
