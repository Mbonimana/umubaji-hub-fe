// src/pages/MyProducts.tsx
import { useState, useEffect } from 'react';
import Sidebar from '../components/vendorDashboard/Sidebar';
import Navbar from '../components/vendorDashboard/Navbar';
import ProductTable from '../components/vendorProducts/ProductTable';
import type { ProductWithImages } from '../types/product';
export default function MyProducts() {
  const [products, setProducts] = useState<ProductWithImages[]>([]);
  
  useEffect(() => {
    const saved = localStorage.getItem('vendor_products');
    if (saved) setProducts(JSON.parse(saved));
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