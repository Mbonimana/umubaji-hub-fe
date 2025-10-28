
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from "../src/layout/Layout"
import Login from './components/auth/login';
import Signup from './components/auth/signup';
import ForgotPassword from './components/auth/forgotpassword';
import OtpVerification from './components/auth/verifyotp';
import PasswordReset from './components/auth/passwordReset';
import VendorForgotPassword from './components/auth/vendorForgotpassword';


function App() {
  return (
    <BrowserRouter>
    
        <Routes>
          <Route path='/' element={<Layout />}>
 
          </Route>
          <Route path='Login' element={< Login />}/>
          <Route path='Signup' element={< Signup />}/>
          <Route path='forgot-password' element={< ForgotPassword />}/>
          <Route path='otp-verification' element={< OtpVerification />}/>
          <Route path='reset-password' element={<PasswordReset/>} />
          <Route path='vendor-forgot-password' element={<VendorForgotPassword/>} />
        </Routes>
     
    </BrowserRouter>
  )
}

export default App;
