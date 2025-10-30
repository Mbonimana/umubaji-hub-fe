// src/components/vendorProducts/ProductRow.tsx
import { Edit, Trash2 } from 'lucide-react';
import type { ProductWithImages } from '../../types/product';

interface Props {
  product: ProductWithImages;
  onEdit: () => void;        // Fixed: no param, just navigate
  onDelete: (id: number) => void;
}

export default function ProductRow({ product, onEdit, onDelete }: Props) {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="p-4">
        <div className="flex items-center gap-3">
          {product.images[0] ? (
            <img src={product.images[0].url} alt="" className="w-10 h-10 object-cover rounded" />
          ) : (
            <div className="w-10 h-10 bg-gray-200 rounded" />
          )}
          <span className="font-medium">{product.name}</span>
        </div>
      </td>
      <td className="p-4 text-gray-600">{product.category || '-'}</td>
      <td className="p-4 font-semibold text-[#4B341C]">₦{product.price.toLocaleString()}</td>
      <td className="p-4">{product.stock || 0}</td>
      <td className="p-4 text-sm text-gray-500">
        {new Date(product.created_at!).toLocaleDateString()}
      </td>
      <td className="p-4">
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="p-2  hover:bg-amber-100 rounded-lg"
          >
            <Edit className="w-4 h-4 text-[#4B341C]" />
          </button>
          <button
            onClick={() => onDelete(product.id!)}
            className="p-2 hover:bg-red-100 rounded-lg"
          >
            <Trash2 className="w-4 h-4 text-[#4B341C]" />
          </button>
        </div>
      </td>
    </tr>
  );
}