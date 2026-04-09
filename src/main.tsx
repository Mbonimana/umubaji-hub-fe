import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import AuthProvider from './contexts/AuthProvider';     
import CartProvider from './contexts/CartProvider';      
import { WishlistProvider } from './contexts/WishlistContext';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';  // ✅ add this

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider> {/* ✅ wrap your app */}
      <BrowserRouter>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);
