import { type Product, type Shipping } from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'; // Fallback para desenvolvimento

export { API_BASE_URL };

export { type Product, type Shipping };

export const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${API_BASE_URL}/products`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
};

export const fetchProduct = async (id: string): Promise<Product> => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch product');
  }
  return response.json();
};

export const fetchShippingRates = async (): Promise<Shipping[]> => {
  const response = await fetch(`${API_BASE_URL}/shipping`);
  if (!response.ok) {
    throw new Error('Failed to fetch shipping rates');
  }
  return response.json();
};

export const createShippingRate = async (shipping: Partial<Shipping>, token: string): Promise<Shipping> => {
  const response = await fetch(`${API_BASE_URL}/shipping`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(shipping),
  });
  if (!response.ok) {
    throw new Error('Failed to create shipping rate');
  }
  return response.json();
};

export const updateShippingRate = async (id: string, shipping: Partial<Shipping>, token: string): Promise<Shipping> => {
  const response = await fetch(`${API_BASE_URL}/shipping/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(shipping),
  });
  if (!response.ok) {
    throw new Error('Failed to update shipping rate');
  }
  return response.json();
};

export const deleteShippingRate = async (id: string, token: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/shipping/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to delete shipping rate');
  }
};