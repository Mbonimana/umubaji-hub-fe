// src/pages/MyProducts.tsx
import { useState, useEffect } from 'react';
import Sidebar from '../components/vendorDashboard/Sidebar';
import Navbar from '../components/vendorDashboard/Navbar';
import ProductTable from '../components/vendorProducts/ProductTable';
import type { ProductWithImages } from '../types/product';

export default function MyProducts() {
  const [products, setProducts] = useState<ProductWithImages[]>([]);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('vendor_products');
    if (saved) setProducts(JSON.parse(saved));

    // Handle flash message from other pages
    const flashRaw = localStorage.getItem('flash');
    if (flashRaw) {
      try {
        const flash = JSON.parse(flashRaw);
        if (flash?.message && flash?.type) {
          setNotice({ type: flash.type, message: flash.message });
          setTimeout(() => setNotice(null), 2500);
        }
      } catch {}
      localStorage.removeItem('flash');
    }
  }, []);
  
  const saveToStorage = (data: ProductWithImages[]) => {
    localStorage.setItem('vendor_products', JSON.stringify(data));
    setProducts(data);
  };

  const handleAdd = (product: ProductWithImages) => {
    saveToStorage([...products, product]);
  };

  const handleUpdate = (updated: ProductWithImages) => {
    saveToStorage(products.map(p => (p.id === updated.id ? updated : p)));
  };

  const handleDelete = (id: number) => {
    const prod = products.find(p => p.id === id);
    const name = prod?.name ? `"${prod.name}"` : 'this product';
    if (!window.confirm(`Delete ${name}? This action cannot be undone.`)) return;

    saveToStorage(products.filter(p => p.id !== id));
    setNotice({ type: 'success', message: 'Product deleted successfully.' });
    setTimeout(() => setNotice(null), 2000);
    saveToStorage(products.filter(p => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      <div className="fixed inset-y-0 left-0 w-64 z-50">
        <Sidebar />
      </div>

      <div className="flex-1 ml-64 flex flex-col">
        <div className="fixed top-0 left-64 right-0 z-40 bg-white border-b border-gray-200">
          <Navbar />
        </div>

        {/* Toast / Notice */}
        {notice && (
          <div className={`fixed top-24 right-6 z-50 px-4 py-2 rounded-lg shadow text-white ${
            notice.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}>
            {notice.message}
          </div>
        )}

       
        <main className="flex-1 pt-20 p-6 overflow-y-auto ">
          <ProductTable
          
            products={products}
            onAdd={handleAdd}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        </main>
      </div>
    </div>
  );
}