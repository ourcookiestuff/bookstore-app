import axiosClient from './axiosClient';
import type { OrderResponse } from '../types';

interface PaymentRequest {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

export const getOrders = async (): Promise<OrderResponse[]> => {
  const response = await axiosClient.get('/orders');
  return response.data;
};

export const getOrder = async (id: number): Promise<OrderResponse> => {
  const response = await axiosClient.get(`/orders/${id}`);
  return response.data;
};

export const checkout = async (data: PaymentRequest): Promise<OrderResponse> => {
  const response = await axiosClient.post('/orders/checkout', data);
  return response.data;
};