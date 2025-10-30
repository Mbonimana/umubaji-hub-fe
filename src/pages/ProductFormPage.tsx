// src/pages/ProductFormPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { X, Upload } from 'lucide-react';
import Sidebar from '../components/vendorDashboard/Sidebar';
import Navbar from '../components/vendorDashboard/Navbar';
import type { ProductWithImages } from '../types/product';

export default function ProductFormPage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState<Partial<ProductWithImages>>({
    name: '',
    price: 0,
    description: '',
    category: '',
    stock: 0,
  });
  const [images, setImages] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load product if editing
  useEffect(() => {
    if (isEdit) {
      const saved = JSON.parse(localStorage.getItem('vendor_products') || '[]');
      const product = saved.find((p: ProductWithImages) => p.id === Number(id));
      if (product) {
        setForm({
          name: product.name,
          price: product.price,
          description: product.description,
          category: product.category,
          stock: product.stock,
          created_at: product.created_at,
        });
        setImages(product.images || []);
        
      }
    }
  }, [id, isEdit]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const url = URL.createObjectURL(file);
    const newImg = {
      id: crypto.randomUUID(),
      productId: 0,
      url,
      publicId: `local-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setTimeout(() => {
      setImages(prev => [...prev, newImg]);
      setUploading(false);
    }, 800);
  };

  const handleRemoveImage = (imageId: string) => {
    setImages(prev => prev.filter(i => i.id !== imageId));
  };

  const handleSubmit = () => {
    // Minimal validation
    if (!form.name || !form.category) {
      alert('Please fill in Product Name and Category.');
      return;
    }

    setIsSubmitting(true);
const product: ProductWithImages = {
  id: isEdit ? Number(id) : Date.now(),
  ...form,
  price: Number(form.price) || 0,
  stock: Number(form.stock) || 0,
  vendor_id: 1,
  created_at: isEdit ? form.created_at : new Date().toISOString(),
  updated_at: new Date().toISOString(),
  images,
} as ProductWithImages;

    const saved = JSON.parse(localStorage.getItem('vendor_products') || '[]');
    const newList = isEdit
      ? saved.map((p: ProductWithImages) => (p.id === product.id ? product : p))
      : [...saved, product];

    localStorage.setItem('vendor_products', JSON.stringify(newList));

    // Flash message for MyProducts toast
    localStorage.setItem(
      'flash',
      JSON.stringify({
        type: 'success',
        message: isEdit ? 'Product updated successfully.' : 'Product added successfully.',
      })
    );

    setIsSubmitting(false);
    navigate('/my-products');
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

        <main className="flex-1 pt-20 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">
                  {isEdit ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button
                  onClick={() => navigate('/my-products')}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name
                  </label>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                  <input
                    className="w-full border rounded-lg px-4 py-2 text-gray-900 placeholder-gray-400"
                    placeholder="Product Name"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (₦)</label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    className="w-full border rounded-lg px-4 py-2 text-gray-900 placeholder-gray-400"
                    placeholder="0"
                    value={form.price}
                    onChange={e => setForm({ ...form, price: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <input
                    className="w-full border rounded-lg px-4 py-2 text-gray-900 placeholder-gray-400"
                    placeholder="Category"
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                  <input
                    type="number"
                    min={0}
                    className="w-full border rounded-lg px-4 py-2 text-gray-900 placeholder-gray-400"
                    placeholder="0"
                    value={form.stock}
                    onChange={e => setForm({ ...form, stock: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (optional)
                </label>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description (optional)</label>
                <textarea
                  rows={4}
                  className="w-full border rounded-lg px-4 py-2 text-gray-900 placeholder-gray-400"
                  placeholder="Description (optional)"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="upload"
                  />
                  <label htmlFor="upload" className="cursor-pointer">
                    {uploading ? (
                      <p className="text-gray-500">Uploading...</p>
                    ) : (
                      <div>
                        <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm text-gray-600">Click to upload</p>
                      </div>
                    )}
                  </label>
                </div>
                {images.length > 0 && (
                  <div className="flex gap-3 mt-4 flex-wrap">
                    {images.map(img => (
                      <div key={img.id} className="relative">
                        <img src={img.url} alt="" className="w-24 h-24 object-cover rounded-lg" />
                        <button
                          onClick={() => handleRemoveImage(img.id)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-3 mt-4 flex-wrap">
                  {images.map(img => (
                    <div key={img.id} className="relative">
                      <img src={img.url} alt="" className="w-24 h-24 object-cover rounded-lg" />
                      <button
                        onClick={() => setImages(prev => prev.filter(i => i.id !== img.id))}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => navigate('/my-products')}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
                  type="button"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-[#FFB347] text-white rounded-lg hover:bg-amber-600 font-medium"
                  disabled={isSubmitting}
                  type="button"
                >
                  {isEdit ? 'Save Changes' : 'Save Product'}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}