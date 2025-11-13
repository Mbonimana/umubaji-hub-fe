// src/components/vendorProducts/ProductRow.tsx
import { useState, useEffect } from 'react';
import { Edit, Trash2, Check, X } from 'lucide-react';
import type { ProductWithImages } from '../../types/product';

interface Props {
  product: ProductWithImages;
  onEdit: () => void;
  onDelete: (id: number) => void;
  onStockUpdate: (id: number, stock: number) => void;
}

export default function ProductRow({ product, onEdit, onDelete, onStockUpdate }: Props) {
  const [isEditingStock, setIsEditingStock] = useState(false);
  const [stockValue, setStockValue] = useState(product.stock || 0);

  // Sync stock value when product changes
  useEffect(() => {
    setStockValue(product.stock || 0);
  }, [product.stock]);

  const handleStockSave = () => {
    if (stockValue !== product.stock) {
      onStockUpdate(product.id!, stockValue);
    }
    setIsEditingStock(false);
  };

  const handleStockCancel = () => {
    setStockValue(product.stock || 0);
    setIsEditingStock(false);
  };

  const productImage = product.images && product.images.length > 0 
    ? product.images[0].url 
    : null;

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="p-4">
        <div className="flex items-center gap-3">
          {productImage ? (
            <img src={productImage} alt="" className="w-10 h-10 object-cover rounded" />
          ) : (
            <div className="w-10 h-10 bg-gray-200 rounded" />
          )}
          <span className="font-medium">{product.name}</span>
        </div>
      </td>
      <td className="p-4 text-gray-600">{product.category || '-'}</td>
      <td className="p-4 font-semibold text-[#4B341C]">RWF {product.price.toLocaleString()}</td>
      <td className="p-4">
        {isEditingStock ? (
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              value={stockValue}
              onChange={(e) => setStockValue(Number(e.target.value))}
              className="w-20 px-2 py-1 border rounded text-sm"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleStockSave();
                if (e.key === 'Escape') handleStockCancel();
              }}
            />
            <button
              onClick={handleStockSave}
              className="p-1 hover:bg-green-100 rounded text-green-600"
              title="Save"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={handleStockCancel}
              className="p-1 hover:bg-red-100 rounded text-red-600"
              title="Cancel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div 
            className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded inline-block"
            onClick={() => setIsEditingStock(true)}
            title="Click to edit stock"
          >
            {product.stock || 0}
          </div>
        )}
      </td>
      <td className="p-4 text-sm text-gray-500">
        {product.created_at ? new Date(product.created_at).toLocaleDateString() : '-'}
      </td>
      <td className="p-4">
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="p-2 hover:bg-amber-100 rounded-lg"
            title="Edit product"
          >
            <Edit className="w-4 h-4 text-[#4B341C]" />
          </button>
          <button
            onClick={() => onDelete(product.id!)}
            className="p-2 hover:bg-red-100 rounded-lg"
            title="Delete product"
          >
            <Trash2 className="w-4 h-4 text-[#4B341C]" />
          </button>
        </div>
      </td>
    </tr>
  );
}