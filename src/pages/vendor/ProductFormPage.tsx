// src/pages/ProductFormPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { X, Upload } from 'lucide-react';
import Sidebar from '../../components/vendorDashboard/Sidebar';
import Navbar from '../../components/vendorDashboard/Navbar';
import { updateProduct } from '../../services/vendorProductsApi';
import { getBaseUrl } from '../../config/baseUrl';
import axios from 'axios';
import Notiflix from 'notiflix';

export default function ProductFormPage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    stock: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(isEdit);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load product if editing
  useEffect(() => {
    if (isEdit && id) {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          const baseUrl = getBaseUrl();
          const token = localStorage.getItem('jwtToken');
          
          const response = await axios.get(`${baseUrl}/products/getProduct/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          const product = response.data;
          setForm({
            name: product.name || '',
            price: product.price?.toString() || '',
            description: product.description || '',
            category: product.category || '',
            stock: product.stock?.toString() || '',
          });

          // Set existing image if available
          if (product.images && product.images.length > 0) {
            if (typeof product.images[0] === 'string') {
              setExistingImageUrl(product.images[0]);
            } else if (product.images[0].url) {
              setExistingImageUrl(product.images[0].url);
            }
          }
        } catch (error: any) {
          console.error('Error fetching product:', error);
          Notiflix.Notify.failure(error.response?.data?.error || 'Failed to load product');
          navigate('/my-products');
        } finally {
          setLoading(false);
        }
      };

      fetchProduct();
    }
  }, [id, isEdit, navigate]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    const url = URL.createObjectURL(file);
    setImagePreview(url);
    setExistingImageUrl(null); // Clear existing image when new one is selected
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setExistingImageUrl(null);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price) {
      Notiflix.Notify.failure('Please fill in Product Name and Price.');
      return;
    }

    try {
      setIsSubmitting(true);
      Notiflix.Loading.dots(isEdit ? 'Updating product...' : 'Creating product...');

      if (isEdit && id) {
        await updateProduct(
          Number(id),
          {
            name: form.name,
            price: form.price,
            description: form.description || undefined,
            category: form.category || undefined,
            stock: form.stock || undefined,
          },
          imageFile || undefined
        );
      }

      Notiflix.Loading.remove();
      Notiflix.Notify.success(isEdit ? 'Product updated successfully!' : 'Product created successfully!');
      
      // Set flash message
      localStorage.setItem(
        'flash',
        JSON.stringify({
          type: 'success',
          message: isEdit ? 'Product updated successfully.' : 'Product added successfully.',
        })
      );

      navigate('/my-products');
    } catch (error: any) {
      Notiflix.Loading.remove();
      console.error('Error saving product:', error);
      Notiflix.Notify.failure(error.message || 'Failed to save product');
    } finally {
      setIsSubmitting(false);
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

              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Loading product...</p>
                </div>
              ) : (
                <>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                  <input
                    className="w-full border rounded-lg px-4 py-2 text-gray-900 placeholder-gray-400"
                    placeholder="Product Name"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (RWF)</label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    className="w-full border rounded-lg px-4 py-2 text-gray-900 placeholder-gray-400"
                    placeholder="0"
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
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
                    onChange={e => setForm({ ...form, stock: e.target.value })}
                  />
                </div>
              </div>

              <div className="mb-6">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
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
                      <p className="text-sm text-gray-600">Click to upload image</p>
                      <p className="text-xs text-gray-500 mt-1">(Optional - will replace existing image)</p>
                    </div>
                  </label>
                </div>
                {(imagePreview || existingImageUrl) && (
                  <div className="mt-4 relative inline-block">
                    <img 
                      src={imagePreview || existingImageUrl || ''} 
                      alt="Preview" 
                      className="w-24 h-24 object-cover rounded-lg" 
                    />
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
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
                  type="button"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-[#4B341C] text-white rounded-lg hover:bg-amber-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                  type="button"
                >
                  {isSubmitting ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Save Changes' : 'Save Product')}
                </button>
              </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}