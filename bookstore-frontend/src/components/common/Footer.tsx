import { useNavigate } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-[#382110] text-[#c9b99a] mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8 text-center sm:text-left">

          {/* Logo i opis */}
          <div>
            <p className="text-[#f4f1ea] text-lg font-medium mb-2">BookStore</p>
            <p className="text-sm leading-relaxed">
              Twoja osobista księgarnia i biblioteka. Kupuj, czytaj, śledź postępy.
            </p>
          </div>

          {/* Nawigacja */}
          <div>
            <p className="text-[#f4f1ea] text-sm font-medium uppercase tracking-wider mb-3">
              Nawigacja
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => navigate('/')}
                className="text-sm text-left text-[#c9b99a] hover:text-[#f4f1ea] transition-colors cursor-pointer bg-transparent border-none"
              >
                Katalog
              </button>
              <button
                onClick={() => navigate('/shelf')}
                className="text-sm text-left text-[#c9b99a] hover:text-[#f4f1ea] transition-colors cursor-pointer bg-transparent border-none"
              >
                Moja półka
              </button>
              <button
                onClick={() => navigate('/cart')}
                className="text-sm text-left text-[#c9b99a] hover:text-[#f4f1ea] transition-colors cursor-pointer bg-transparent border-none"
              >
                Koszyk
              </button>
              <button
                onClick={() => navigate('/orders')}
                className="text-sm text-left text-[#c9b99a] hover:text-[#f4f1ea] transition-colors cursor-pointer bg-transparent border-none"
              >
                Moje zamówienia
              </button>
            </div>
          </div>

          {/* Książki na półce */}
          <div>
            <p className="text-[#f4f1ea] text-sm font-medium uppercase tracking-wider mb-3">
              Półka
            </p>
            <div className="flex flex-col gap-2">
              <span className="text-sm">Do przeczytania</span>
              <span className="text-sm">Czytam teraz</span>
              <span className="text-sm">Przeczytane</span>
            </div>
          </div>
        </div>

        {/* Dolna belka */}
        <div className="border-t border-[#5c3d1e] pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-[#7a6248]">
            © 2026 BookStore. Projekt zaliczeniowy PAI - Jagiellonian University.
          </p>
          <div className="flex gap-4">
            <span className="text-xs text-[#7a6248]">Spring Boot 3</span>
            <span className="text-xs text-[#7a6248]">·</span>
            <span className="text-xs text-[#7a6248]">React 19</span>
            <span className="text-xs text-[#7a6248]">·</span>
            <span className="text-xs text-[#7a6248]">PostgreSQL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}