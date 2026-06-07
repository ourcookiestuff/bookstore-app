import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { getCart } from '../api/cartApi';
import { checkout } from '../api/orderApi';
import Navbar from '../components/common/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const schema = z.object({
  cardholderName: z.string().min(3, 'Podaj imię i nazwisko'),
  cardNumber: z.string().regex(/^\d{16}$/, 'Numer karty musi mieć 16 cyfr'),
  expiryDate: z.string().regex(/^\d{2}\/\d{2}$/, 'Format: MM/RR'),
  cvv: z.string().regex(/^\d{3}$/, 'CVV musi mieć 3 cyfry'),
});

type FormData = z.infer<typeof schema>;

export default function CheckoutPage() {
  const navigate = useNavigate();

  const { data: cartItems = [] } = useQuery({
    queryKey: ['cart'],
    queryFn: getCart,
  });

  const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const checkoutMutation = useMutation({
    mutationFn: checkout,
    onSuccess: (order) => navigate(`/orders/${order.id}`),
    onError: (e: any) => alert(e.response?.data?.message || 'Płatność nie powiodła się'),
  });

  if (cartItems.length === 0) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f4f1ea]">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-10">

        <h1 className="text-2xl font-medium text-[#382110] mb-8">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Formularz płatności */}
          <div className="flex-1">
            <div className="bg-white border border-[#c9b99a] rounded-lg p-6">
              <h2 className="font-medium text-[#382110] mb-6">Dane płatności</h2>

              <form onSubmit={handleSubmit((data) => checkoutMutation.mutate(data))} className="space-y-4">

                <div className="space-y-1.5">
                  <Label className="text-xs text-[#7a6248] uppercase tracking-wider">
                    Imię i nazwisko
                  </Label>
                  <Input
                    {...register('cardholderName')}
                    placeholder="Jan Kowalski"
                    className="bg-white border-[#c9b99a] text-[#382110] focus-visible:ring-[#382110]"
                  />
                  {errors.cardholderName && (
                    <p className="text-red-500 text-xs">{errors.cardholderName.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-[#7a6248] uppercase tracking-wider">
                    Numer karty
                  </Label>
                  <Input
                    {...register('cardNumber')}
                    placeholder="1234567890123456"
                    maxLength={16}
                    className="bg-white border-[#c9b99a] text-[#382110] focus-visible:ring-[#382110]"
                  />
                  {errors.cardNumber && (
                    <p className="text-red-500 text-xs">{errors.cardNumber.message}</p>
                  )}
                </div>

                <div className="flex gap-4">
                  <div className="flex-1 space-y-1.5">
                    <Label className="text-xs text-[#7a6248] uppercase tracking-wider">
                      Data ważności
                    </Label>
                    <Input
                      {...register('expiryDate')}
                      placeholder="MM/RR"
                      maxLength={5}
                      className="bg-white border-[#c9b99a] text-[#382110] focus-visible:ring-[#382110]"
                    />
                    {errors.expiryDate && (
                      <p className="text-red-500 text-xs">{errors.expiryDate.message}</p>
                    )}
                  </div>
                  <div className="w-32 space-y-1.5">
                    <Label className="text-xs text-[#7a6248] uppercase tracking-wider">
                      CVV
                    </Label>
                    <Input
                      {...register('cvv')}
                      placeholder="123"
                      maxLength={3}
                      type="password"
                      className="bg-white border-[#c9b99a] text-[#382110] focus-visible:ring-[#382110]"
                    />
                    {errors.cvv && (
                      <p className="text-red-500 text-xs">{errors.cvv.message}</p>
                    )}
                  </div>
                </div>

                <div className="pt-2">
                  <p className="text-xs text-[#c9b99a] mb-4">
                    To jest symulacja płatności — nie podawaj prawdziwych danych karty.
                  </p>
                  <Button
                    type="submit"
                    disabled={checkoutMutation.isPending}
                    className="w-full bg-[#382110] hover:bg-[#5c3d1e] text-[#f4f1ea] cursor-pointer"
                  >
                    {checkoutMutation.isPending ? 'Przetwarzanie...' : `Zapłać ${total.toFixed(2)} zł`}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Podsumowanie zamówienia */}
          <div className="lg:w-80">
            <div className="bg-white border border-[#c9b99a] rounded-lg p-6">
              <h2 className="font-medium text-[#382110] mb-4">Twoje zamówienie</h2>
              <div className="space-y-3 mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
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
                      <p className="text-sm font-medium text-[#382110] truncate">{item.title}</p>
                      <p className="text-xs text-[#7a6248]">x{item.quantity}</p>
                    </div>
                    <p className="text-sm text-[#382110]">{item.subtotal.toFixed(2)} zł</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#c9b99a] pt-4">
                <div className="flex justify-between font-medium text-[#382110]">
                  <span>Razem</span>
                  <span>{total.toFixed(2)} zł</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}