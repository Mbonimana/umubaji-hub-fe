import axios from 'axios';
import { getBaseUrl } from '../config/baseUrl';
import type { Product } from '../types/product';

export interface VendorProduct extends Product {
  images?: string[]; // Array of image URLs from backend
}

/**
 * Get authentication token from localStorage
 */
const getAuthToken = (): string | null => {
  return localStorage.getItem('jwtToken');
};

/**
 * Get vendor's products (filtered by user_id from token)
 */
export const getVendorProducts = async (): Promise<VendorProduct[]> => {
  try {
    const baseUrl = getBaseUrl();
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    // Get all products and filter by vendor's user_id
    const response = await axios.get<VendorProduct[]>(`${baseUrl}/products/getProducts`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // Get user info from token to filter products
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      throw new Error('User information not found');
    }

    const user = JSON.parse(userStr);
    const vendorId = user.id;

    // Filter products by vendor's user_id
    return response.data.filter(product => product.user_id === vendorId);
  } catch (error: any) {
    console.error('Error fetching vendor products:', error);
    throw new Error(error.response?.data?.error || 'Failed to fetch products');
  }
};

/**
 * Create a new product
 */
export const createProduct = async (productData: {
  name: string;
  price: string;
  description?: string;
  category?: string;
  stock?: string;
}, imageFile?: File): Promise<VendorProduct> => {
  try {
    const baseUrl = getBaseUrl();
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('price', productData.price);
    if (productData.description) formData.append('description', productData.description);
    if (productData.category) formData.append('category', productData.category);
    if (productData.stock) formData.append('stock', productData.stock);
    if (imageFile) formData.append('image', imageFile);

    const response = await axios.post<{ message: string; product: VendorProduct }>(
      `${baseUrl}/products/create`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    return response.data.product;
  } catch (error: any) {
    console.error('Error creating product:', error);
    throw new Error(error.response?.data?.error || 'Failed to create product');
  }
};

/**
 * Update a product
 */
export const updateProduct = async (
  productId: number,
  productData: {
    name?: string;
    price?: string;
    description?: string;
    category?: string;
    stock?: string;
  },
  imageFile?: File
): Promise<VendorProduct> => {
  try {
    const baseUrl = getBaseUrl();
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    const formData = new FormData();
    if (productData.name) formData.append('name', productData.name);
    if (productData.price) formData.append('price', productData.price);
    if (productData.description !== undefined) formData.append('description', productData.description);
    if (productData.category) formData.append('category', productData.category);
    if (productData.stock) formData.append('stock', productData.stock);
    if (imageFile) formData.append('image', imageFile);

    const response = await axios.put<{ message: string; product: VendorProduct }>(
      `${baseUrl}/products/update/${productId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    return response.data.product;
  } catch (error: any) {
    console.error('Error updating product:', error);
    throw new Error(error.response?.data?.error || 'Failed to update product');
  }
};

/**
 * Delete a product
 */
export const deleteProduct = async (productId: number): Promise<void> => {
  try {
    const baseUrl = getBaseUrl();
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    await axios.delete(`${baseUrl}/products/delete/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    throw new Error(error.response?.data?.error || 'Failed to delete product');
  }
};

/**
 * Update product stock
 */
export const updateProductStock = async (productId: number, stock: number): Promise<VendorProduct> => {
  try {
    const baseUrl = getBaseUrl();
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await axios.patch<{ message: string; product: VendorProduct }>(
      `${baseUrl}/products/update/${productId}/stock`,
      { stock: stock.toString() },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.product;
  } catch (error: any) {
    console.error('Error updating stock:', error);
    throw new Error(error.response?.data?.error || 'Failed to update stock');
  }
};

