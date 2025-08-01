
import React, { useState } from 'react';
import './Cart.component.css';


// Datos de prueba para el carrito
const initialCart = [
  {
    id: 1,
    name: 'Camiseta React',
    price: 25.99,
    quantity: 2,
    image: 'https://via.placeholder.com/60',
  },
  {
    id: 2,
    name: 'Taza JavaScript',
    price: 12.5,
    quantity: 1,
    image: 'https://via.placeholder.com/60',
  },
  {
    id: 3,
    name: 'Sticker Vite',
    price: 3.99,
    quantity: 5,
    image: 'https://via.placeholder.com/60',
  },
];


export default function CartComponent() {
  const [cart, setCart] = useState(initialCart);
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleRemove = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const handleClear = () => {
    setCart([]);
  };

  return (
    <div className="cart">
      <h1>Carrito de compras</h1>
      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-outline-danger" onClick={handleClear} disabled={cart.length === 0}>
          Vaciar carrito
        </button>
      </div>
      <table className="table table-hover align-middle shadow-sm">
        <thead className="table-primary">
          <tr>
            <th>Producto</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {cart.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center">El carrito está vacío</td>
            </tr>
          ) : (
            cart.map(item => (
              <tr key={item.id}>
                <td><img src={item.image} alt={item.name} width={60} height={60} /></td>
                <td style={{ fontWeight: 500 }}>{item.name}</td>
                <td><span className="badge bg-success">${item.price.toFixed(2)}</span></td>
                <td>{item.quantity}</td>
                <td><span className="badge bg-secondary">${(item.price * item.quantity).toFixed(2)}</span></td>
                <td>
                  <button className="btn btn-sm btn-danger" onClick={() => handleRemove(item.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className="text-end">
        <h4>Total: <span className="badge bg-primary">${total.toFixed(2)}</span></h4>
      </div>
    </div>
  );
}
