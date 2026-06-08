import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getOrder } from '../api/orderApi';
import Navbar from '../components/common/Navbar';
import { Button } from '@/components/ui/button';
import Footer from '../components/common/Footer';

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrder(Number(id)),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f4f1ea]">
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 py-10 animate-pulse space-y-4">
          <div className="h-8 bg-[#e8d5b7] rounded w-1/2" />
          <div className="h-48 bg-[#e8d5b7] rounded" />
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-screen bg-[#f4f1ea]">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-10">

        {/* Status */}
        <div className="text-center mb-8">
          {order.status === 'PAID' ? (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-2xl">✓</span>
              </div>
              <h1 className="text-2xl font-medium text-[#382110]">Dziękujemy za zamówienie!</h1>
              <p className="text-[#7a6248] mt-2">Zamówienie #{order.id} zostało złożone pomyślnie.</p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-500 text-2xl">✕</span>
              </div>
              <h1 className="text-2xl font-medium text-[#382110]">Płatność nie powiodła się</h1>
              <p className="text-[#7a6248] mt-2">Spróbuj ponownie lub użyj innej karty.</p>
            </>
          )}
        </div>

        {/* Szczegóły zamówienia */}
        <div className="bg-white border border-[#c9b99a] rounded-lg p-6 mb-6">
          <h2 className="font-medium text-[#382110] mb-4">Szczegóły zamówienia</h2>
          <div className="space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex gap-3 items-center">
                <div className="w-10 aspect-[2/3] bg-[#e8d5b7] rounded overflow-hidden flex-shrink-0">
                  {item.coverImageUrl && (
                    <img
                      src={item.coverImageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#382110]">{item.title}</p>
                  <p className="text-xs text-[#7a6248]">{item.author} · x{item.quantity}</p>
                </div>
                <p className="text-sm text-[#382110]">{item.subtotal.toFixed(2)} zł</p>
              </div>
            ))}
          </div>
          <div className="border-t border-[#c9b99a] pt-4 mt-4">
            <div className="flex justify-between font-medium text-[#382110]">
              <span>Razem</span>
              <span>{order.total.toFixed(2)} zł</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={() => navigate('/')}
            className="flex-1 bg-[#382110] hover:bg-[#5c3d1e] text-[#f4f1ea] cursor-pointer"
          >
            Wróć do katalogu
          </Button>
          <Button
            onClick={() => navigate('/shelf')}
            variant="outline"
            className="flex-1 border-[#c9b99a] text-[#382110] hover:bg-[#e8d5b7] cursor-pointer"
          >
            Moja półka
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
}