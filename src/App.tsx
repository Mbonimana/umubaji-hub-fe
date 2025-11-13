import { Routes, Route } from 'react-router-dom';
import Layout from './layout/Layout';
import Home from './pages/home';
import Cart from './pages/Cart'; 
import Checkout from './pages/Checkout';
import Index from './pages/index.tsx';
import Unauthorized from './pages/NotAuthorized.tsx';
import ScrollToTop from './components/ScrollToTop.tsx';

import Login from './components/auth/login';
import Signup from './components/auth/signup';
import ForgotPassword from './components/auth/forgotpassword';
import OtpVerification from './components/auth/verifyotp';
import PasswordReset from './components/auth/passwordReset';
import AboutUs from './pages/about.tsx';
import VendorForgotPassword from './components/auth/vendorForgotpassword';

import VendorsPage from './pages/allVendors';
import MessagingFormWrapper from "./components/WrapperComponent"; 
import Explore from './pages/Explore';
import VendorPage from './components/vendorPage';
import VendorDashboard from './pages/VendorDashboard';
import MyProducts from './pages/vendor/MyProducts';
import ProductFormPage from './pages/vendor/ProductFormPage';
import Orders from './pages/vendor/Orders';
import Reviews from './pages/vendor/Reviews';
import Analytics from './pages/vendor/Analytics.tsx';
import Messages from './pages/vendor/Messages.tsx';
import Earnings from './pages/vendor/Earnings.tsx';
import Settings from './pages/vendor/Settings.tsx';
import Profile from './pages/vendor/profile';


// Customer dashboard pages
import CustomerDashboard from './pages/CustomerDashboard';
import CustomerOrders from './pages/customer/Orders';
import CustomerMessages from './pages/customer/Messages';
import CustomerSettings from './pages/customer/Settings';
import CustomerWishlist from './pages/customer/Wishlist';
import NotFound from './pages/notFound';
//wishlist page
import WishlistPage from './pages/WishlistPage';

//Vendor routes
import VendorRegistration from './pages/vendor/vendorregistration.tsx';

// Admin imports
import AdminDashboard from './pages/AdminDashboard';
import AdminOverview from './pages/admin/Overview';
import AdminVendors from './pages/admin/Vendors';
import AdminCustomers from './pages/admin/Customers';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';
import AdminAnalytics from './pages/admin/Analytics';
import AdminSettings from './pages/admin/Settings';
import ProtectedRoute from './routes/ProtectedRoute.tsx';

function App() {
  return (
    <>
    <ScrollToTop />
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Index />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/unauthorized" element={<Unauthorized />} /> 
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
        <Route path='/about' element={<AboutUs/>}/>
        <Route path="/vendors/:vendorId/contact" element={<MessagingFormWrapper />} />

        <Route path = 'explore' element={< Explore/>} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/home" element={<Home />} />
      </Route>

      {/* Admin routes */}
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute> }>
        <Route index element={<AdminOverview />} />
        <Route path="vendors" element={<AdminVendors />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="settings" element={<AdminSettings />} />
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
      <Route path="/profile" element={<Profile />} />
      <Route path="/vendor-registration" element={<VendorRegistration />} />

      {/* Customer routes */}
      <Route path="/customer-dashboard" element={<CustomerDashboard />} />
      <Route path="/customer/orders" element={<CustomerOrders />} />
      <Route path="/customer/messages" element={<CustomerMessages />} />
      <Route path="/customer/settings" element={<CustomerSettings />} />
      <Route path="/customer/wishlist" element={<CustomerWishlist />} />
    </Routes>
    </>
  );
}

export default App;