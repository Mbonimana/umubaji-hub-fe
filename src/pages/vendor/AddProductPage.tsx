// src/pages/AddProductPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Upload } from 'lucide-react';
import Sidebar from '../../components/vendorDashboard/Sidebar';
import Navbar from '../../components/vendorDashboard/Navbar';
import { createProduct } from '../../services/vendorProductsApi';
import Notiflix from 'notiflix';

export default function AddProductPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    stock: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    const url = URL.createObjectURL(file);
    setImagePreview(url);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price) {
      Notiflix.Notify.failure('Please fill in Product Name and Price.');
      return;
    }

    try {
      setSubmitting(true);
      Notiflix.Loading.dots('Creating product...');

      await createProduct(
        {
          name: form.name,
          price: form.price,
          description: form.description || undefined,
          category: form.category || undefined,
          stock: form.stock || undefined,
        },
        imageFile || undefined
      );

      Notiflix.Loading.remove();
      Notiflix.Notify.success('Product created successfully!');
      
      // Set flash message
      localStorage.setItem(
        'flash',
        JSON.stringify({
          type: 'success',
          message: 'Product added successfully.',
        })
      );

      navigate('/my-products');
    } catch (error: any) {
      Notiflix.Loading.remove();
      console.error('Error creating product:', error);
      Notiflix.Notify.failure(error.message || 'Failed to create product');
    } finally {
      setSubmitting(false);
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

        <main className="flex-1 pt-20 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Add New Product</h2>
                <button
                  onClick={() => navigate('/my-products')}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                  <input
                    className="w-full border rounded-lg px-4 py-2"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (RWF)</label>
                  <input
                    type="number"
                    className="w-full border rounded-lg px-4 py-2"
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <input
                    className="w-full border rounded-lg px-4 py-2"
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                  <input
                    type="number"
                    className="w-full border rounded-lg px-4 py-2"
                    value={form.stock}
                    onChange={e => setForm({ ...form, stock: e.target.value })}
                    min="0"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows={4}
                  className="w-full border rounded-lg px-4 py-2"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="upload"
                  />
                  <label htmlFor="upload" className="cursor-pointer">
                    <div>
                      <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-[#4B341C]">Click to upload image</p>
                      <p className="text-xs text-gray-500 mt-1">(Optional)</p>
                    </div>
                  </label>
                </div>
                {imagePreview && (
                  <div className="mt-4 relative inline-block">
                    <img src={imagePreview} alt="Preview" className="w-24 h-24 object-cover rounded-lg" />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => navigate('/my-products')}
                  className="px-6 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-6 py-2 bg-[#4B341C] text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Creating...' : 'Save Product'}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}