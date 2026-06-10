export interface BookResponse {
  id: number;
  title: string;
  author: string;
  description: string;
  price: number;
  coverImageUrl: string;
  isbn: string;
  genre: string;
  pages: number;
  stock: number;
  createdAt: string;
  averageRating: number | null;
  ratingsCount: number;
  reviewsCount: number;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface CartItemResponse {
  id: number;
  bookId: number;
  title: string;
  author: string;
  coverImageUrl: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface OrderItemResponse {
  bookId: number;
  title: string;
  author: string;
  coverImageUrl: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface OrderResponse {
  id: number;
  status: 'PENDING' | 'PAID' | 'CANCELLED';
  total: number;
  createdAt: string;
  items: OrderItemResponse[];
}

export type ShelfStatus = 'TO_READ' | 'READING' | 'READ';

export interface ShelfEntryResponse {
  id: number;
  bookId: number;
  title: string;
  author: string;
  coverImageUrl: string;
  pages: number;
  status: ShelfStatus;
  currentPage: number;
  rating: number | null;
  review: string | null;
  updatedAt: string;
}

export interface ReviewResponse {
  email: string;
  rating: number | null;
  review: string;
  updatedAt: string;
}