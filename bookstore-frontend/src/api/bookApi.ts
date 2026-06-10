import axiosClient from './axiosClient';
import type { BookResponse, Page, ReviewResponse } from '../types';

interface GetBooksParams {
  search?: string;
  genre?: string;
  page?: number;
  size?: number;
}

export const getReviews = async (id: number, page = 0): Promise<Page<ReviewResponse>> => {
  const response = await axiosClient.get(`/books/${id}/reviews`, { params: { page, size: 5 } });
  return response.data;
};

export const getBooks = async (params: GetBooksParams): Promise<Page<BookResponse>> => {
  const response = await axiosClient.get('/books', { params });
  return response.data;
};

export const getBook = async (id: number): Promise<BookResponse> => {
  const response = await axiosClient.get(`/books/${id}`);
  return response.data;
};