import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useQuery } from '@tanstack/react-query';
import { getCart } from '../../api/cartApi';
import { useState, useRef, useEffect } from 'react';

export default function Navbar() {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const email = useAuthStore((s) => s.email);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const { data: cartItems = [] } = useQuery({
    queryKey: ['cart'],
    queryFn: getCart,
  });

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const initial = email ? email[0].toUpperCase() : 'U';

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-[#f4f1ea] border-b border-[#c9b99a] shadow-sm">
      <div className="max-w-7xl mx-auto h-14 px-6 flex items-center justify-between">

        {/* Logo */}
        <div
          onClick={() => navigate('/')}
          className="text-[#382110] text-xl font-medium cursor-pointer hover:opacity-80 transition-opacity"
        >
          BookStore
        </div>

        {/* Desktop menu */}
        <div className="hidden sm:flex items-center gap-6">
          <button
            onClick={() => navigate('/catalog')}
            className="text-[#7a6248] text-sm cursor-pointer hover:text-[#382110] transition-colors bg-transparent border-none"
          >
            Katalog
          </button>
          <button
            onClick={() => navigate('/shelf')}
            className="text-[#7a6248] text-sm cursor-pointer hover:text-[#382110] transition-colors bg-transparent border-none"
          >
            Moja półka
          </button>

          {/* Koszyk */}
          <div
            onClick={() => navigate('/cart')}
            className="relative cursor-pointer"
          >
            <svg width="20" height="20" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0"
                stroke="#382110"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 text-xs text-white bg-[#c9945a] w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>

          {/* Avatar z dropdownem */}
          <div className="relative" ref={profileRef}>
            <div
              onClick={() => setProfileOpen((p) => !p)}
              className="w-8 h-8 rounded-full bg-[#382110] text-[#f4f1ea] flex items-center justify-center cursor-pointer text-sm font-medium hover:bg-[#5c3d1e] transition-colors select-none"
            >
              {initial}
            </div>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-[#c9b99a] rounded-lg shadow-md overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-[#c9b99a]">
                  <p className="text-xs text-[#7a6248]">Zalogowany jako</p>
                  <p className="text-sm font-medium text-[#382110] truncate">{email}</p>
                </div>
                <button
                  onClick={() => { setProfileOpen(false); navigate('/orders'); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-[#382110] hover:bg-[#f4f1ea] transition-colors cursor-pointer"
                >
                  Moje zamówienia
                </button>
                <button
                  onClick={() => { setProfileOpen(false); navigate('/shelf'); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-[#382110] hover:bg-[#f4f1ea] transition-colors cursor-pointer"
                >
                  Moja półka
                </button>
                <div className="border-t border-[#c9b99a]">
                  <button
                    onClick={() => { logout(); navigate('/auth'); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-[#f4f1ea] transition-colors cursor-pointer"
                  >
                    Wyloguj
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="sm:hidden cursor-pointer bg-transparent border-none"
          aria-label="Menu"
        >
          <svg width="21" height="15" viewBox="0 0 21 15" fill="none">
            <rect width="21" height="1.5" rx=".75" fill="#382110" />
            <rect x="8" y="6" width="13" height="1.5" rx=".75" fill="#382110" />
            <rect x="6" y="13" width="15" height="1.5" rx=".75" fill="#382110" />
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden bg-white border-t border-[#c9b99a] px-6 py-4 flex flex-col gap-3">
          <button onClick={() => { navigate('/'); setMenuOpen(false); }} className="text-left text-sm text-[#382110] cursor-pointer bg-transparent border-none">Katalog</button>
          <button onClick={() => { navigate('/shelf'); setMenuOpen(false); }} className="text-left text-sm text-[#382110] cursor-pointer bg-transparent border-none">Moja półka</button>
          <button onClick={() => { navigate('/cart'); setMenuOpen(false); }} className="text-left text-sm text-[#382110] cursor-pointer bg-transparent border-none">Koszyk {cartCount > 0 && `(${cartCount})`}</button>
          <button onClick={() => { logout(); navigate('/auth'); }} className="text-left text-sm text-red-500 cursor-pointer bg-transparent border-none">Wyloguj</button>
        </div>
      )}
    </nav>
  );
}