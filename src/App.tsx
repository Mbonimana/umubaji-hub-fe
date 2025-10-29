
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from "../src/layout/Layout"
import Home from './pages/home';

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
    <BrowserRouter>
    
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<Home />} />

      
            
         
          
      
         
 
          </Route>
          <Route path='vendorPage' element={<VendorPage/>} />
          <Route path='allVendors' element={<VendorsPage/>} />
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
