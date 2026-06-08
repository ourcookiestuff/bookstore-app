import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Button } from "../ui/button";
import { useQuery } from '@tanstack/react-query';
import { getCart } from '../../api/cartApi';

export default function Navbar() {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  const { data: cartItems = [] } = useQuery({
    queryKey: ['cart'],
    queryFn: getCart,
  });

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 bg-[#f4f1ea] border-b shadow-sm h-14 px-6 flex items-center justify-between">
      <div
        onClick={() => navigate('/')}
        className="text-[#212121] text-lg font-medium cursor-pointer hover:text-[#e8d5b7] transition-colors"
      >
        BookStore
      </div>
      <div className="flex items-center gap-6">
        <Button
          onClick={() => navigate('/shelf')}
          variant="ghost"
          className="text-[#c9b99a] text-sm cursor-pointer hover:text-[#f4f1ea] transition-colors"
        >
          Moja półka
        </Button>
        <Button
          onClick={() => navigate('/cart')}
          variant="ghost"
          className="text-[#c9b99a] text-sm cursor-pointer hover:text-[#f4f1ea] transition-colors"
        >
          Koszyk {cartCount > 0 && (
            <span className="bg-[#c9945a] text-[#382110] text-xs font-medium px-1.5 py-0.5 rounded-full">
              {cartCount}
            </span>
          )}
        </Button>
        <Button
          onClick={() => { logout(); navigate('/auth'); }}
          variant="ghost"
          className="text-[#c9b99a] text-sm cursor-pointer hover:text-[#f4f1ea] transition-colors"
        >
          Wyloguj
        </Button>
      </div>
    </nav>
  );
}