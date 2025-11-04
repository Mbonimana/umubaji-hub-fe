import { Routes, Route } from 'react-router-dom';
import Layout from './layout/Layout';
import Home from './pages/home';
import Cart from './pages/Cart'; 
import Checkout from './pages/Checkout';

import Login from './components/auth/login';
import Signup from './components/auth/signup';
import ForgotPassword from './components/auth/forgotpassword';
import OtpVerification from './components/auth/verifyotp';
import PasswordReset from './components/auth/passwordReset';
import VendorForgotPassword from './components/auth/vendorForgotpassword';

import VendorsPage from './pages/allVendors';
import MessagingFormWrapper from "./components/WrapperComponent"; 
import Explore from './pages/Explore';
import VendorPage from './components/vendorPage';
import VendorDashboard from './pages/VendorDashboard';
import MyProducts from './pages/MyProducts';
import ProductFormPage from './pages/ProductFormPage';
import Orders from './pages/Orders';
import Reviews from './pages/Reviews';
import Analytics from './pages/Analytics.tsx';
import Messages from './pages/Messages';
import Earnings from './pages/Earnings';
import Settings from './pages/Settings';

// Customer dashboard pages
import CustomerDashboard from './pages/CustomerDashboard';
import CustomerOrders from './pages/customer/Orders';
import CustomerMessages from './pages/customer/Messages';
import CustomerSettings from './pages/customer/Settings';
import CustomerWishlist from './pages/customer/Wishlist';
import NotFound from './pages/notFound';

//Vendor routes
import VendorRegistration from './pages/customer/vendor/vendorregistration';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/otp-verification" element={<OtpVerification />} />
        <Route path="/password-reset" element={<PasswordReset />} />
        <Route path="/vendor-forgot-password" element={<VendorForgotPassword />} />
        <Route path="/vendor/:vendorId" element={<VendorPage />} />
        <Route path="/vendorPage/:id" element={<VendorPage />} />
        <Route path='allVendors' element={<VendorsPage/>} />
        <Route path="/vendors/:vendorId/contact" element={<MessagingFormWrapper />} />

        <Route path = 'explore' element={< Explore/>} />
        <Route path="/vendor-registration" element={<VendorRegistration />} />
      </Route>

      {/* Vendor routes */}
      <Route path="vendordashboard" element={<VendorDashboard />} />
      <Route path="/my-products" element={<MyProducts />} />
      <Route path="/my-products/add" element={<ProductFormPage />} />
      <Route path="/my-products/edit/:id" element={<ProductFormPage />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/reviews" element={<Reviews />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/earnings" element={<Earnings />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/vendor-registration" element={<VendorRegistration />} />

      {/* Customer routes */}
      <Route path="/customer-dashboard" element={<CustomerDashboard />} />
      <Route path="/customer/orders" element={<CustomerOrders />} />
      <Route path="/customer/messages" element={<CustomerMessages />} />
      <Route path="/customer/settings" element={<CustomerSettings />} />
      <Route path="/customer/wishlist" element={<CustomerWishlist />} />
    </Routes>
  );
}

export default App;