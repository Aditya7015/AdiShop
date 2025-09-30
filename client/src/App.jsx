import React, { useContext } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

import Navbar from './components/Navbar';
import PromotionSection from './components/PromotionSection';
import Footer from './components/Footer';

import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Signup from './pages/Signup';
import About from './pages/About';
import Contact from './pages/Contact';
import MyOrders from './pages/MyOrders';

import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import AddProduct from './pages/admin/AddProduct';
import ProductStatus from './pages/admin/ProductList';
import ProductDetail from './pages/ProductDetail';
import CategoryPage from './pages/CategoryPage';
import Success from './pages/SuccessPage';
import ProfilePage from './pages/ProfilePage';
import WishlistPage from './pages/WishlistPage';
import OrderDetail from './pages/OrderDetail';

const App = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // Determine if current route is admin route
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {/* Header/Footer only for non-admin pages */}
      {!isAdminRoute && <PromotionSection />}
      {!isAdminRoute && <Navbar />}

      <Routes>
        {/* User Routes */}
        {/* User Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/myorders" element={<MyOrders />} />
        <Route path='/success' element={<Success />} />
        <Route path='/profile' element={<ProfilePage />} />
        <Route path='/wishlist' element={<WishlistPage />} />
        <Route path='/order/:orderId' element={<OrderDetail />} />
        {/* Dynamic Category Page */}
        <Route path="/shop/:category" element={<CategoryPage />} />



        {/* Admin Routes - always declared */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="addproduct" element={<AddProduct />} />
          <Route path="productstatus" element={<ProductStatus />} />
        </Route>
      </Routes>

      {!isAdminRoute && <Footer />}
    </>
  );
};

export default App;
