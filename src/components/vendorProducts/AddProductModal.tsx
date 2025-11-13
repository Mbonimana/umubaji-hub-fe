// src/components/vendor/AddProductModal.tsx
import { useState } from 'react';
import { X, Upload } from 'lucide-react';
import type { Product, Image } from '../../types/product';

interface Props {
  onSave: (product: Product, images: Image[]) => void;
  onClose: () => void;
}

export default function AddProductModal({ onSave, onClose }: Props) {
  const [form, setForm] = useState<Partial<Product>>({
    name: '',
    price: 0,
    description: '',
    category: '',
    stock: 0,
  });

  const [images, setImages] = useState<Image[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    // Simulate Cloudinary upload
    const fakeUrl = URL.createObjectURL(file);
    const fakePublicId = `local-${Date.now()}`;
    const newImage: Image = {
      id: crypto.randomUUID(),
      productId: 0,
      url: fakeUrl,
      publicId: fakePublicId,
      createdAt: new Date().toISOString(),
    };

    setTimeout(() => {
      setImages(prev => [...prev, newImage]);
      setUploading(false);
    }, 800);
  };

  const handleSubmit = () => {
    const product: Product = {
      id: Date.now(),
      ...form,
      vendor_id: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Product;

    onSave(product, images);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Add New Product</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            placeholder="Product Name"
            className="border rounded-lg px-4 py-2"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
          <input
            placeholder="Price (₦)"
            type="number"
            className="border rounded-lg px-4 py-2"
            value={form.price}
            onChange={e => setForm({ ...form, price: Number(e.target.value) })}
          />
          <input
            placeholder="Category"
            className="border rounded-lg px-4 py-2"
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
          />
          <input
            placeholder="Stock"
            type="number"
            className="border rounded-lg px-4 py-2"
            value={form.stock}
            onChange={e => setForm({ ...form, stock: Number(e.target.value) })}
          />
        </div>

        <textarea
          placeholder="Description (optional)"
          className="w-full border rounded-lg px-4 py-2 mb-4"
          rows={3}
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />

        {/* Image Upload */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Product iImages</label>
          <div className="border-2 border-dashed rounded-lg p-4 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer">
              {uploading ? (
                <p>Uploading...</p>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Click to upload</p>
                </div>
              )}
            </label>
          </div>

          <div className="flex gap-2 mt-3 flex-wrap">
            {images.map(img => (
              <div key={img.id} className="relative">
                <img src={img.url} alt="" className="w-20 h-20 object-cover rounded" />
                <button
                  onClick={() => setImages(prev => prev.filter(i => i.id !== img.id))}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-[#4B341C] text-white rounded-lg hover:bg-amber-700"
          >
            Save Product
          </button>
        </div>
      </div>
    </div>
  );
}