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
import VendorPage from './components/vendorPage';
import VendorsPage from './pages/allVendors';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/otp-verification" element={<OtpVerification />} />
        <Route path="/password-reset" element={<PasswordReset />} />
        <Route path="/vendor-forgot-password" element={<VendorForgotPassword />} />
        <Route path="/vendor/:vendorId" element={<VendorPage />} />
        <Route path='allVendors' element={<VendorsPage/>} />
        

      </Route>
    </Routes>
  );
}

export default App;