import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axiosClient from '../api/axiosClient';
import type { OrderResponse, BookResponse, Page } from '../types';

function useAllBooks(page: number, search: string) {
  return useQuery({
    queryKey: ['admin', 'books', page, search],
    queryFn: async (): Promise<Page<BookResponse>> => {
      const response = await axiosClient.get('/books', { params: { page, size: 10, search: search || undefined } });
      return response.data;
    },
  });
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Oczekujące',
  PAID: 'Opłacone',
  CANCELLED: 'Anulowane',
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'text-amber-600 bg-amber-50',
  PAID: 'text-green-700 bg-green-50',
  CANCELLED: 'text-red-500 bg-red-50',
};

function OrdersTab() {
  const [page, setPage] = useState(0);
  const [searchId, setSearchId] = useState('');
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'orders', page, searchId],
    queryFn: async (): Promise<Page<OrderResponse>> => {
      const response = await axiosClient.get('/admin/orders/search', {
        params: {
          id: searchId ? Number(searchId) : undefined,
          page,
          size: 10,
        },
      });
      return response.data;
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-[#382110]">Zamówienia</h2>
      </div>

      <div className="mb-4">
        <Input
          type="number"
          placeholder="Szukaj po numerze zamówienia..."
          value={searchId}
          onChange={(e) => { setSearchId(e.target.value); setPage(0); }}
          className="bg-white border-[#c9b99a] text-[#382110] focus-visible:ring-[#382110] placeholder:text-[#c9b99a] max-w-sm"
        />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-[#e8d5b7] rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {data?.content.length === 0 && (
            <p className="text-sm text-[#7a6248] text-center py-8">Nie znaleziono zamówień.</p>
          )}
          <div className="space-y-3">
            {data?.content.map((order) => (
              <div
                key={order.id}
                className="bg-white border border-[#c9b99a] rounded-lg p-4 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-[#382110]">#{order.id}</span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[order.status]}`}>
                    {STATUS_LABELS[order.status]}
                  </span>
                  <span className="text-sm text-[#7a6248]">
                    {order.items.length} {order.items.length === 1 ? 'pozycja' : 'pozycje'}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-[#382110]">
                    {order.total.toFixed(2)} zł
                  </span>
                  <span className="text-xs text-[#c9b99a]">
                    {new Date(order.createdAt).toLocaleDateString('pl-PL')}
                  </span>
                  <button
                    onClick={() => navigate(`/orders/${order.id}`)}
                    className="text-xs text-[#382110] underline cursor-pointer bg-transparent border-none hover:text-[#5c3d1e]"
                  >
                    Szczegóły
                  </button>
                </div>
              </div>
            ))}
          </div>

          {data && data.totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-6">
              <Button variant="outline" onClick={() => setPage((p) => p - 1)} disabled={data.first} className="border-[#c9b99a] text-[#382110] hover:bg-[#e8d5b7] cursor-pointer">Poprzednia</Button>
              <span className="text-sm text-[#7a6248]">{page + 1} / {data.totalPages}</span>
              <Button variant="outline" onClick={() => setPage((p) => p + 1)} disabled={data.last} className="border-[#c9b99a] text-[#382110] hover:bg-[#e8d5b7] cursor-pointer">Następna</Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function AddBookForm({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = useState({
    title: '', author: '', description: '', price: '',
    coverImageUrl: '', isbn: '', genre: '', pages: '', stock: '',
  });
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      await axiosClient.post('/books', {
        ...form,
        price: parseFloat(form.price),
        pages: form.pages ? parseInt(form.pages) : null,
        stock: parseInt(form.stock),
      });
    },
    onSuccess: () => {
      onSuccess();
      setForm({ title: '', author: '', description: '', price: '', coverImageUrl: '', isbn: '', genre: '', pages: '', stock: '' });
      setError(null);
    },
    onError: (e: any) => setError(e.response?.data?.message || 'Błąd przy dodawaniu książki'),
  });

  const field = (key: keyof typeof form, label: string, placeholder: string, type = 'text') => (
    <div className="space-y-1.5">
      <Label className="text-xs text-[#7a6248] uppercase tracking-wider">{label}</Label>
      <Input
        type={type}
        value={form[key]}
        onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))}
        placeholder={placeholder}
        className="bg-white border-[#c9b99a] text-[#382110] focus-visible:ring-[#382110]"
      />
    </div>
  );

  return (
    <div className="bg-white border border-[#c9b99a] rounded-lg p-6">
      <h3 className="font-medium text-[#382110] mb-4">Dodaj nową książkę</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {field('title', 'Tytuł *', 'np. Wiedźmin')}
        {field('author', 'Autor *', 'np. Andrzej Sapkowski')}
        {field('price', 'Cena *', 'np. 39.99', 'number')}
        {field('stock', 'Stan magazynowy *', 'np. 10', 'number')}
        {field('genre', 'Gatunek', 'np. Fantasy')}
        {field('isbn', 'ISBN', 'np. 9788373198005')}
        {field('pages', 'Liczba stron', 'np. 288', 'number')}
        {field('coverImageUrl', 'URL okładki', 'https://...')}
      </div>
      <div className="mt-4 space-y-1.5">
        <Label className="text-xs text-[#7a6248] uppercase tracking-wider">Opis</Label>
        <textarea
          value={form.description}
          onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
          placeholder="Opis książki..."
          rows={3}
          className="w-full px-3 py-2 border border-[#c9b99a] rounded text-sm text-[#382110] bg-white outline-none focus:border-[#382110] resize-none"
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
      <Button
        onClick={() => mutation.mutate()}
        disabled={mutation.isPending || !form.title || !form.author || !form.price || !form.stock}
        className="mt-4 bg-[#382110] hover:bg-[#5c3d1e] text-[#f4f1ea] cursor-pointer"
      >
        {mutation.isPending ? 'Dodawanie...' : 'Dodaj książkę'}
      </Button>
    </div>
  );
}

function BooksTab() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();
  const { data, isLoading } = useAllBooks(page, search);

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => axiosClient.delete(`/books/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'books'] }),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-[#382110]">Książki</h2>
        <Button
          onClick={() => setShowForm((s) => !s)}
          className="bg-[#382110] hover:bg-[#5c3d1e] text-[#f4f1ea] cursor-pointer"
        >
          {showForm ? 'Anuluj' : '+ Dodaj książkę'}
        </Button>
      </div>

      {showForm && (
        <div className="mb-6">
          <AddBookForm onSuccess={() => {
            setShowForm(false);
            queryClient.invalidateQueries({ queryKey: ['admin', 'books'] });
          }} />
        </div>
      )}

      <div className="mb-4">
        <Input
          type="text"
          placeholder="Szukaj po tytule lub autorze..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          className="bg-white border-[#c9b99a] text-[#382110] focus-visible:ring-[#382110] placeholder:text-[#c9b99a] max-w-sm"
        />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-[#e8d5b7] rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {data?.content.length === 0 && (
            <p className="text-sm text-[#7a6248] text-center py-8">Nie znaleziono książek.</p>
          )}
          <div className="space-y-3">
            {data?.content.map((book) => (
              <div key={book.id} className="bg-white border border-[#c9b99a] rounded-lg p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-14 bg-[#e8d5b7] rounded overflow-hidden flex-shrink-0">
                    {book.coverImageUrl && (
                      <img src={book.coverImageUrl} alt={book.title} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#382110]">{book.title}</p>
                    <p className="text-xs text-[#7a6248]">{book.author} {book.isbn && `· ${book.isbn}`}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-[#382110]">{book.price.toFixed(2)} zł</span>
                  <span className={`text-xs ${book.stock > 0 ? 'text-green-700' : 'text-red-500'}`}>{book.stock} szt.</span>
                  <button
                    onClick={() => deleteMutation.mutate(book.id)}
                    className="text-xs text-red-400 hover:text-red-600 cursor-pointer bg-transparent border-none"
                  >
                    Usuń
                  </button>
                </div>
              </div>
            ))}
          </div>

          {data && data.totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-6">
              <Button variant="outline" onClick={() => setPage((p) => p - 1)} disabled={data.first} className="border-[#c9b99a] text-[#382110] hover:bg-[#e8d5b7] cursor-pointer">Poprzednia</Button>
              <span className="text-sm text-[#7a6248]">{page + 1} / {data.totalPages}</span>
              <Button variant="outline" onClick={() => setPage((p) => p + 1)} disabled={data.last} className="border-[#c9b99a] text-[#382110] hover:bg-[#e8d5b7] cursor-pointer">Następna</Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function AdminPage() {
  const [tab, setTab] = useState<'orders' | 'books'>('orders');

  return (
    <div className="min-h-screen bg-[#f4f1ea] flex flex-col">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-8 flex-1 w-full">

        <h1 className="text-2xl font-medium text-[#382110] mb-6">Panel admina</h1>

        {/* Taby */}
        <div className="flex border-b-2 border-[#c9b99a] mb-6">
          {(['orders', 'books'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-2 text-sm border-b-2 -mb-0.5 transition-colors cursor-pointer bg-transparent ${
                tab === t
                  ? 'border-[#382110] text-[#382110] font-medium'
                  : 'border-transparent text-[#7a6248] hover:text-[#382110]'
              }`}
            >
              {t === 'orders' ? 'Zamówienia' : 'Książki'}
            </button>
          ))}
        </div>

        {tab === 'orders' ? <OrdersTab /> : <BooksTab />}
      </div>
      <Footer />
    </div>
  );
}