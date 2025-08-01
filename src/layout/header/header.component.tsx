
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './header.component.css';
import SecondHeaderComponent from './second-header.component';

export default function HeaderComponent() {
  const [showSearch, setShowSearch] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  // Cierra el input si se hace click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchInputRef.current &&
        !(searchInputRef.current as HTMLInputElement).contains(event.target as Node)
      ) {
        setShowSearch(false);
      }
    }
    if (showSearch) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSearch]);

  return (
    <>
    <header className="header w-100" style={{ minHeight: '100px', background: '#a4a1a1' }}>
      {/* Mobile: nombre, icono buscador y otros iconos en una sola fila */}
      <div className="container-fluid d-block d-md-none p-0 position-relative">
        <div className="d-flex align-items-center justify-content-between px-3 pt-3">
          <a className="navbar-brand fw-bold m-0" style={{ color: '#090909', fontSize: 22 }} href="#">
            MiTienda
          </a>
          <div className="d-flex align-items-center gap-2">
            <a
              href="#"
              style={{ color: '#090909' }}
              title="Buscar"
              onClick={e => { e.preventDefault(); setShowSearch(!showSearch); }}
            >
              <span className="material-icons" style={{ fontSize: 28 }}>search</span>
            </a>
            <Link to="/favorite" style={{ color: '#090909' }} title="Favoritos">
              <span className="material-icons" style={{ fontSize: 24 }}>favorite_border</span>
            </Link>
            <Link to="/cart" style={{ color: '#090909' }} title="Carrito">
              <span className="material-icons" style={{ fontSize: 24 }}>shopping_cart</span>
            </Link>
            <Link to="/profile" style={{ color: '#090909' }} title="Cuenta">
              <span className="material-icons" style={{ fontSize: 24 }}>person_outline</span>
            </Link>
          </div>
        </div>
        {/* Input flotante de búsqueda */}
        {showSearch && (
          <form
            className="position-absolute top-100 start-0 w-100 px-3 mt-2"
            style={{ zIndex: 999 }}
            role="search"
            onSubmit={e => { e.preventDefault(); setShowSearch(false); }}
          >
            <input
              ref={searchInputRef}
              className="form-control"
              type="search"
              placeholder="Buscar productos..."
              aria-label="Buscar"
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
            />
          </form>
        )}
      </div>

      {/* Desktop: todo centrado como antes */}
      <div className="container-fluid d-none d-md-flex flex-column align-items-center justify-content-center w-100 p-0">
        <div className="d-flex flex-row align-items-center justify-content-center w-100" style={{ maxWidth: '100%' }}>
          {/* Logo */}
          <a className="navbar-brand fw-bold me-md-4 mb-0" style={{ color: '#090909', fontSize: 32 }} href="#">
            MiTienda
          </a>

          {/* Buscador Desktop */}
          <form className="d-flex flex-grow-1 mx-md-3 mb-0 justify-content-center" role="search" style={{ maxWidth: 500, width: '100%' }}>
            <input
              className="form-control me-2"
              type="search"
              placeholder="Buscar productos..."
              aria-label="Buscar"
            />
            <button className="btn btn-outline-dark" type="submit">
              <span className="material-icons">search</span>
            </button>
          </form>

          {/* Iconos */}
          <div className="d-flex align-items-center gap-3 ms-md-4 justify-content-center">
            <Link to="/favorite" style={{ color: '#090909' }} title="Favoritos">
              <span className="material-icons" style={{ fontSize: 28 }}>favorite_border</span>
            </Link>
            <Link to="/cart" style={{ color: '#090909' }} title="Carrito">
              <span className="material-icons" style={{ fontSize: 28 }}>shopping_cart</span>
            </Link>
            <Link to="/profile" style={{ color: '#090909' }} title="Cuenta">
              <span className="material-icons" style={{ fontSize: 28 }}>person_outline</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
    <div className='second-header'>
      <SecondHeaderComponent />
    </div>

    </>
  );
}


