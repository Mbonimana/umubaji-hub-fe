// src/types/product.ts
export interface Product {
  id?: number;
  name: string;
  price: number;
  description?: string;
  category?: string;
  stock?: number;
  vendor_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Image {
  id: string;
  productId: number;
  url: string;
  publicId: string;
  createdAt: string;
}

export interface ProductWithImages extends Product {
  images: Image[];
}