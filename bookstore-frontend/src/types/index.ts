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