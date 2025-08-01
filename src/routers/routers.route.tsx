

import { Routes, Route } from 'react-router-dom';
import HomeComponent from '../pages/home/Home.component';
import Login from '../pages/login/Login.component';
import Register from '../pages/register/Register.component';
import Product from '../pages/product/Product.component';
import ProductDetails from '../pages/product-details/ProductDetails.component';
import Cart from '../pages/cart/Cart.component';
import Checkout from '../pages/checkout/Checkout.component';
import Favorite from '../pages/favorite/Favorite.component';
import Profile from '../pages/profile/Profile.component';


const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeComponent />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/product" element={<Product />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/favorite" element={<Favorite />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
};

export default Routers;
