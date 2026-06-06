import axiosClient from './axiosClient';
import type { CartItemResponse } from '../types';

export const getCart = async (): Promise<CartItemResponse[]> => {
  const response = await axiosClient.get('/cart');
  return response.data;
};

export const addToCart = async (bookId: number, quantity = 1): Promise<CartItemResponse> => {
  const response = await axiosClient.post('/cart', { bookId, quantity });
  return response.data;
};

export const updateQuantity = async (cartItemId: number, quantity: number): Promise<CartItemResponse> => {
  const response = await axiosClient.put(`/cart/${cartItemId}`, null, { params: { quantity } });
  return response.data;
};

export const removeFromCart = async (cartItemId: number): Promise<void> => {
  await axiosClient.delete(`/cart/${cartItemId}`);
};

export const clearCart = async (): Promise<void> => {
  await axiosClient.delete('/cart');
};