import axiosClient from './axiosClient';
import type { ShelfEntryResponse, ShelfStatus } from '../types';

interface ShelfEntryRequest {
  status: ShelfStatus;
  currentPage?: number;
  rating?: number;
  review?: string;
}

export const getShelf = async (status?: ShelfStatus): Promise<ShelfEntryResponse[]> => {
  const response = await axiosClient.get('/shelf', { params: status ? { status } : {} });
  return response.data;
};

export const addToShelf = async (bookId: number, data: ShelfEntryRequest): Promise<ShelfEntryResponse> => {
  const response = await axiosClient.post(`/shelf/books/${bookId}`, data);
  return response.data;
};

export const updateShelfEntry = async (id: number, data: ShelfEntryRequest): Promise<ShelfEntryResponse> => {
  const response = await axiosClient.put(`/shelf/${id}`, data);
  return response.data;
};

export const removeFromShelf = async (id: number): Promise<void> => {
  await axiosClient.delete(`/shelf/${id}`);
};