// src/types/product.ts
export interface Product {
  id?: number;
  name: string;
  price: number;
  description?: string;
  category?: string;
  stock?: number;
  vendor_id?: number;
  user_id?: number;
  created_at?: string;
  updated_at?: string;
  images?: string[]; // Array of image URLs from backend
}

export interface Image {
  id: string;
  productId: number;
  url: string;
  publicId: string;
  createdAt: string;
}

export interface ProductWithImages extends Omit<Product, 'images'> {
  images: Image[];
}