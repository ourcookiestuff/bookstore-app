import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getBook, getReviews } from '../api/bookApi';
import Navbar from '../components/common/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { addToCart } from '../api/cartApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Footer from '../components/common/Footer';
import { addToShelf } from '../api/shelfApi';
import { useState } from 'react';
import { toast } from 'sonner';

export default function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reviewPage, setReviewPage] = useState(0);

  const queryClient = useQueryClient();

  const { data: reviewsData } = useQuery({
    queryKey: ['reviews', id, reviewPage],
    queryFn: () => getReviews(Number(id), reviewPage),
  });

const reviews = reviewsData?.content ?? [];

  const cartMutation = useMutation({
    mutationFn: () => addToCart(book!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Dodano do koszyka!');
    },
    onError: () => toast.error('Nie udało się dodać do koszyka'),
  });

  const shelfMutation = useMutation({
    mutationFn: () => addToShelf(book!.id, { status: 'TO_READ' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shelf'] });
      toast.success('Dodano do półki!');
    },
    onError: () => toast.error('Nie udało się dodać do półki'),
  });

  const { data: book, isLoading } = useQuery({
    queryKey: ['book', id],
    queryFn: () => getBook(Number(id)),
  });

  function StarDisplay({ rating, count }: { rating: number | null; count: number }) {
    const stars = rating ?? 0;
    return (
      <div className="flex items-center gap-2">
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => {
            const filled = stars >= star;
            const half = !filled && stars >= star - 0.5;
            return (
              <span
                key={star}
                className={`text-xl leading-none ${
                  filled ? 'text-[#c9945a]' : half ? 'text-[#c9945a]' : 'text-[#c9b99a]'
                }`}
              >
                {filled ? '★' : half ? '⯨' : '☆'}
              </span>
            );
          })}
        </div>
        {rating !== null && (
          <span className="text-lg font-medium text-[#382110]">
            {rating.toFixed(2)}
          </span>
        )}
        {count > 0 && (
          <span className="text-sm text-[#7a6248]">
            ({count} {count === 1 ? 'ocena' : count < 5 ? 'oceny' : 'ocen'})
          </span>
        )}
      </div>
    );
  }

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

            {/* Oceny */}
            <div className="mt-3 space-y-1 leading-tight text-center md:text-left">
              <StarDisplay rating={book.averageRating} count={book.ratingsCount} />
              <p className="text-sm text-[#7a6248]">
                  {book.reviewsCount} {book.reviewsCount === 0 ? 'recenzji' : book.reviewsCount === 1 ? 'recenzja' : book.reviewsCount < 5 ? 'recenzje' : 'recenzji'}
              </p>
            </div>

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
              <Button
                onClick={() => shelfMutation.mutate()}
                disabled={shelfMutation.isPending}
                variant="outline"
                className="border-[#c9b99a] text-[#382110] hover:bg-[#e8d5b7] cursor-pointer px-8"
              >
                {shelfMutation.isPending ? 'Dodawanie...' : '+ Dodaj do półki'}
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Recenzje */}
      {(reviews.length > 0 || reviewsData) && (
        <div className="max-w-6xl mx-auto px-6 pb-12">
          <h2 className="text-lg font-medium text-[#382110] mb-4">
            Recenzje ({reviewsData?.totalElements ?? 0})
          </h2>

          {reviews.length === 0 ? (
            <p className="text-sm text-[#c9b99a]">Brak recenzji - bądź pierwszy!</p>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {reviews.map((review, i) => (
                  <div key={i} className="bg-white border border-[#c9b99a] rounded-lg p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#382110] text-[#f4f1ea] flex items-center justify-center text-sm font-medium">
                          {review.email[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#382110]">
                            {review.email.split('@')[0]}
                          </p>
                          <p className="text-xs text-[#c9b99a]">
                            {new Date(review.updatedAt).toLocaleDateString('pl-PL', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                      {review.rating && (
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={`text-sm ${star <= review.rating! ? 'text-[#c9945a]' : 'text-[#c9b99a]'}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-[#382110] leading-relaxed">{review.review}</p>
                  </div>
                ))}
              </div>

              {/* Paginacja recenzji */}
              {reviewsData && reviewsData.totalPages > 1 && (
                <div className="flex justify-center items-center gap-3">
                  <button
                    onClick={() => setReviewPage((p) => p - 1)}
                    disabled={reviewsData.first}
                    className="px-4 py-2 border border-[#c9b99a] rounded bg-white text-sm text-[#382110] hover:bg-[#e8d5b7] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    Poprzednie
                  </button>
                  <span className="text-sm text-[#7a6248]">
                    {reviewPage + 1} / {reviewsData.totalPages}
                  </span>
                  <button
                    onClick={() => setReviewPage((p) => p + 1)}
                    disabled={reviewsData.last}
                    className="px-4 py-2 border border-[#c9b99a] rounded bg-white text-sm text-[#382110] hover:bg-[#e8d5b7] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    Następne
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
      <Footer />
    </div>
  );
}