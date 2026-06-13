import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getCart, updateQuantity, removeFromCart, clearCart } from '../api/cartApi';
import Navbar from '../components/common/Navbar';
import { Button } from '@/components/ui/button';
import Footer from '../components/common/Footer';

export default function CartPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: getCart,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, quantity }: { id: number; quantity: number }) =>
      updateQuantity(id, quantity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });

  const removeMutation = useMutation({
    mutationFn: removeFromCart,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });

  const clearMutation = useMutation({
    mutationFn: clearCart,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });

  const total = items.reduce((sum, item) => sum + item.subtotal, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f4f1ea]">
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 py-10 animate-pulse space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 bg-[#e8d5b7] rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f1ea] flex flex-col">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">

        <h1 className="text-2xl font-medium text-[#382110] mb-8">Koszyk</h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#7a6248] text-lg">Twój koszyk jest pusty.</p>
            <Button
              onClick={() => navigate('/')}
              className="mt-4 bg-[#382110] hover:bg-[#5c3d1e] text-[#f4f1ea] cursor-pointer"
            >
              Przeglądaj katalog
            </Button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Lista pozycji */}
            <div className="flex-1 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-[#c9b99a] rounded-lg p-4 flex gap-4"
                >
                  {/* Okładka */}
                  <div
                    className="w-16 aspect-[2/3] bg-[#e8d5b7] rounded overflow-hidden flex-shrink-0 cursor-pointer"
                    onClick={() => navigate(`/books/${item.bookId}`)}
                  >
                    {item.coverImageUrl && (
                      <img
                        src={item.coverImageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    )}
                  </div>

                  {/* Informacje */}
                  <div className="flex-1">
                    <p
                      className="font-medium text-[#382110] cursor-pointer hover:underline"
                      onClick={() => navigate(`/books/${item.bookId}`)}
                    >
                      {item.title}
                    </p>
                    <p className="text-sm text-[#7a6248]">{item.author}</p>
                    <p className="text-sm text-[#382110] mt-1">{item.price.toFixed(2)} zł / szt.</p>
                  </div>

                  {/* Ilość i usuń */}
                  <div className="flex flex-col items-end justify-between">
                    <p className="font-medium text-[#382110]">{item.subtotal.toFixed(2)} zł</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (item.quantity === 1) {
                            removeMutation.mutate(item.id);
                          } else {
                            updateMutation.mutate({ id: item.id, quantity: item.quantity - 1 });
                          }
                        }}
                        className="w-7 h-7 border border-[#c9b99a] rounded text-[#382110] hover:bg-[#e8d5b7] transition-colors cursor-pointer"
                      >
                        −
                      </button>
                      <span className="text-sm text-[#382110] w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateMutation.mutate({ id: item.id, quantity: item.quantity + 1 })}
                        className="w-7 h-7 border border-[#c9b99a] rounded text-[#382110] hover:bg-[#e8d5b7] transition-colors cursor-pointer"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeMutation.mutate(item.id)}
                        className="text-xs text-red-400 hover:text-red-600 ml-2 cursor-pointer"
                      >
                        Usuń
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={() => clearMutation.mutate()}
                className="text-sm text-[#7a6248] hover:text-red-500 transition-colors cursor-pointer"
              >
                Wyczyść koszyk
              </button>
            </div>

            {/* Podsumowanie */}
            <div className="lg:w-72">
              <div className="bg-white border border-[#c9b99a] rounded-lg p-6 sticky top-6">
                <h2 className="font-medium text-[#382110] mb-4">Podsumowanie</h2>
                <div className="space-y-2 text-sm text-[#7a6248] mb-4">
                  <div className="flex justify-between">
                    <span>Pozycji w koszyku</span>
                    <span>{items.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Łącznie sztuk</span>
                    <span>{items.reduce((sum, i) => sum + i.quantity, 0)}</span>
                  </div>
                </div>
                <div className="border-t border-[#c9b99a] pt-4 mb-6">
                  <div className="flex justify-between font-medium text-[#382110]">
                    <span>Razem</span>
                    <span>{total.toFixed(2)} zł</span>
                  </div>
                </div>
                <Button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-[#382110] hover:bg-[#5c3d1e] text-[#f4f1ea] cursor-pointer"
                >
                  Przejdź do checkout
                </Button>
              </div>
            </div>

          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}