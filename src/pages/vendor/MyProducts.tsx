// src/pages/MyProducts.tsx
import { useState, useEffect } from 'react';
import Sidebar from '../../components/vendorDashboard/Sidebar';
import Navbar from '../../components/vendorDashboard/Navbar';
import ProductTable from '../../components/vendorProducts/ProductTable';
import type { ProductWithImages } from '../../types/product';
import { getVendorProducts, deleteProduct as deleteProductApi, updateProductStock } from '../../services/vendorProductsApi';
import Notiflix from 'notiflix';

export default function MyProducts() {
  const [products, setProducts] = useState<ProductWithImages[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const fetchedProducts = await getVendorProducts();
      
      // Convert API products to ProductWithImages format
      const convertedProducts: ProductWithImages[] = fetchedProducts.map(p => ({
        ...p,
        images: p.images?.map((url, idx) => ({
          id: `${p.id}-${idx}`,
          productId: p.id!,
          url,
          publicId: `product-${p.id}-${idx}`,
          createdAt: p.created_at || new Date().toISOString()
        })) || []
      }));
      
      setProducts(convertedProducts);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      setNotice({ type: 'error', message: error.message || 'Failed to load products' });
      setTimeout(() => setNotice(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();

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

  const handleUpdate = (updated: ProductWithImages) => {
    setProducts(products.map(p => (p.id === updated.id ? updated : p)));
  };

  const handleDelete = async (id: number) => {
    const prod = products.find(p => p.id === id);
    const name = prod?.name ? `"${prod.name}"` : 'this product';
    if (!window.confirm(`Delete ${name}? This action cannot be undone.`)) return;

    try {
      Notiflix.Loading.dots('Deleting product...');
      await deleteProductApi(id);
      setProducts(products.filter(p => p.id !== id));
      setNotice({ type: 'success', message: 'Product deleted successfully.' });
      setTimeout(() => setNotice(null), 2000);
    } catch (error: any) {
      console.error('Error deleting product:', error);
      setNotice({ type: 'error', message: error.message || 'Failed to delete product' });
      setTimeout(() => setNotice(null), 3000);
    } finally {
      Notiflix.Loading.remove();
    }
  };

  const handleStockUpdate = async (id: number, newStock: number) => {
    try {
      const updated = await updateProductStock(id, newStock);
      const convertedProduct: ProductWithImages = {
        ...updated,
        images: updated.images?.map((url, idx) => ({
          id: `${updated.id}-${idx}`,
          productId: updated.id!,
          url,
          publicId: `product-${updated.id}-${idx}`,
          createdAt: updated.created_at || new Date().toISOString()
        })) || []
      };
      handleUpdate(convertedProduct);
      setNotice({ type: 'success', message: 'Stock updated successfully.' });
      setTimeout(() => setNotice(null), 2000);
    } catch (error: any) {
      console.error('Error updating stock:', error);
      setNotice({ type: 'error', message: error.message || 'Failed to update stock' });
      setTimeout(() => setNotice(null), 3000);
    }
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
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading products...</p>
            </div>
          ) : (
            <ProductTable
              products={products}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              onStockUpdate={handleStockUpdate}
            />
          )}
        </main>
      </div>
    </div>
  );
}