// src/components/vendorProducts/ProductTable.tsx
import React from 'react';
//import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProductRow from './ProductRow';
import type { ProductWithImages } from '../../types/product';

const ProductRowComponent = ProductRow as React.ComponentType<any>;

interface Props {
  products: ProductWithImages[];
  onUpdate: (p: ProductWithImages) => void;
  onDelete: (id: number) => void;
  onStockUpdate: (id: number, stock: number) => void;
}

export default function ProductTable({ products, onDelete, onStockUpdate }: Props) {
  const navigate = useNavigate();

  return (
    <div className=" bg-[#F5F5F5]">
       <div className="flex justify-end mt-8">
  <button
    onClick={() => navigate('/my-products/add')}
    className="bg-[#4B341C] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-amber-700"
  >
    <Plus className="w-5 h-5" /> Add Product
  </button>
</div>
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mt-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">My Products</h3>
        
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left text-sm text-gray-600">
              <th className="pb-3">Product</th>
              <th className="pb-3">Category</th>
              <th className="pb-3">Price</th>
              <th className="pb-3">Stock</th>
              <th className="pb-3">Added</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  No products yet. Click "Add Product" to get started.
                </td>
              </tr>
            ) : (
              products.map(product => (
                <ProductRowComponent
                  key={product.id}
                  product={product}
                  onEdit={() => navigate(`/my-products/edit/${product.id}`)}
                  onDelete={onDelete}
                  onStockUpdate={onStockUpdate}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal removed — we use full page now */}
    </div>
    </div>
  );
}