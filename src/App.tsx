import { Routes, Route } from 'react-router-dom';
import Layout from './layout/Layout';
import Home from './pages/home';
import Cart from './pages/Cart'; 
import Checkout from './pages/Checkout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />

      </Route>
    </Routes>
  );
}

export default App;