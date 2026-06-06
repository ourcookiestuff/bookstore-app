import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getBook } from '../api/bookApi';
import Navbar from '../components/common/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { addToCart } from '../api/cartApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const cartMutation = useMutation({
    mutationFn: () => addToCart(book!.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });

  const { data: book, isLoading } = useQuery({
    queryKey: ['book', id],
    queryFn: () => getBook(Number(id)),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f4f1ea]">
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 py-10 animate-pulse">
          <div className="flex gap-10">
            <div className="w-56 aspect-[2/3] bg-[#e8d5b7] rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-4 pt-2">
              <div className="h-6 bg-[#e8d5b7] rounded w-2/3" />
              <div className="h-4 bg-[#e8d5b7] rounded w-1/3" />
              <div className="h-4 bg-[#e8d5b7] rounded w-1/4" />
              <div className="h-24 bg-[#e8d5b7] rounded mt-4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!book) return null;

  return (
    <div className="min-h-screen bg-[#f4f1ea]">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Wróć */}
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-[#7a6248] hover:text-[#382110] transition-colors mb-8 flex items-center gap-1 cursor-pointer"
        >
          ← Wróć do katalogu
        </button>

        <div className="flex flex-col md:flex-row gap-16 items-center md:items-start">

          {/* Okładka */}
          <div className="w-70 flex-shrink-0 ">
            <div className="w-full aspect-[2/3] rounded-lg overflow-hidden shadow-lg bg-[#e8d5b7]">
              {book.coverImageUrl ? (
                <img
                  src={book.coverImageUrl}
                  alt={book.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-16 h-24 bg-[#c9b99a] rounded-sm" />
                </div>
              )}
            </div>
          </div>

          {/* Informacje */}
          <div className="flex-1 w-full">
            <h1 className="text-4xl font-medium text-[#382110] leading-tight text-center md:text-left">
              {book.title}
            </h1>
            <p className="text-[#7a6248] text-lg mt-1 text-lg text-center md:text-left">
              {book.author}
            </p>

            {/* Szczegóły */}
            <div className="flex gap-6 mt-4 text-base text-[#7a6248] border-t border-[#c9b99a] pt-4 flex-wrap justify-center md:justify-start">
              {book.isbn && (
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#c9b99a] block">ISBN</span>
                  <span className="text-[#382110]">{book.isbn}</span>
                </div>
              )}
              {book.pages && (
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#c9b99a] block">Strony</span>
                  <span className="text-[#382110]">{book.pages}</span>
                </div>
              )}
              <div>
                <span className="text-xs uppercase tracking-wider text-[#c9b99a] block">Dostępność</span>
                <span className={book.stock > 0 ? 'text-green-700' : 'text-red-500'}>
                  {book.stock > 0 ? `${book.stock} szt.` : 'Brak w magazynie'}
                </span>
              </div>
            </div>

            {/* Opis */}
            {book.description && (
              <div className="mt-5">
                <h2 className="text-xs uppercase tracking-wider text-[#c9b99a] mb-2">Opis</h2>
                <p className="text-base text-[#382110] leading-relaxed">
                  {book.description}
                </p>
              </div>
            )}

            {book.genre && (
              <Badge className="bg-[#e8d5b7] mt-2 text-[#5c3d1e] hover:bg-[#e8d5b7] mb-3">
                {book.genre}
              </Badge>
            )}

            {/* Cena i koszyk */}
            <div className="mt-8 flex items-center gap-4">
              <span className="text-2xl font-medium text-[#382110]">
                {book.price.toFixed(2)} zł
              </span>
              <Button
                disabled={book.stock === 0 || cartMutation.isPending}
                onClick={() => cartMutation.mutate()}
                className="bg-[#382110] hover:bg-[#5c3d1e] text-[#f4f1ea] cursor-pointer px-8"
              >
                {cartMutation.isPending ? 'Dodawanie...' : 'Do koszyka'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}