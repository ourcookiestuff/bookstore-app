import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getBooks } from '../api/bookApi';
import { Button } from '@/components/ui/button';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

export default function HomePage() {
  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: ['books', '', '', 0],
    queryFn: () => getBooks({ page: 0, size: 12 }),
  });

  const books = data?.content ?? [];

  return (
    <div className="min-h-screen bg-[#f4f1ea] flex flex-col">
    <Navbar />

      {/* Hero */}
      <div className="bg-[#382110] px-6 py-20 text-center">
        <h1 className="text-4xl font-medium text-[#f4f1ea] mb-4">
          Witaj w BookStore
        </h1>
        <p className="text-[#c9b99a] text-base max-w-lg mx-auto mb-8 leading-relaxed">
          Twoja osobista księgarnia i biblioteka. Kupuj książki, śledź postępy czytania i buduj swoją kolekcję.
        </p>
        <div className="flex gap-3 justify-center">
          <Button
            onClick={() => navigate('/catalog')}
            className="bg-[#f4f1ea] text-[#382110] hover:bg-[#e8d5b7] cursor-pointer px-8"
          >
            Przeglądaj katalog
          </Button>
          <Button
            onClick={() => navigate('/shelf')}
            className="bg-[#f4f1ea] text-[#382110] hover:bg-[#e8d5b7] cursor-pointer px-8"
          >
            Moja półka
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Najnowsze książki */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-medium text-[#382110]">Najnowsze książki</h2>
            <button
              onClick={() => navigate('/catalog')}
              className="text-sm text-[#7a6248] hover:text-[#382110] transition-colors cursor-pointer bg-transparent border-none"
            >
              Zobacz wszystkie →
            </button>
          </div>

          {/* Poziomy scroll */}
          <div className="flex gap-5 overflow-x-auto pb-3 scrollbar-hide">
            {books.map((book) => (
              <div
                key={book.id}
                onClick={() => navigate(`/books/${book.id}`)}
                className="flex-shrink-0 w-48 cursor-pointer group"
              >
                <div className="w-48 h-72 rounded-lg overflow-hidden bg-[#e8d5b7] shadow-sm group-hover:shadow-md transition-shadow">
                  {book.coverImageUrl ? (
                    <img
                      src={book.coverImageUrl}
                      alt={book.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-10 h-14 bg-[#c9b99a] rounded-sm" />
                    </div>
                  )}
                </div>
                <p className="text-sm font-medium text-[#382110] mt-2 truncate">{book.title}</p>
                <p className="text-xs text-[#7a6248] truncate">{book.author}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sekcja features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: '📚',
              title: 'Bogaty katalog',
              desc: 'Książki z różnych gatunków — fantasy, sci-fi, klasyka i wiele więcej.',
              action: () => navigate('/catalog'),
              label: 'Przeglądaj',
            },
            {
              icon: '🛒',
              title: 'Łatwe zakupy',
              desc: 'Koszyk, checkout i symulacja płatności kartą w kilku krokach.',
              action: () => navigate('/catalog'),
              label: 'Kup teraz',
            },
            {
              icon: '📖',
              title: 'Twoja półka',
              desc: 'Śledź postępy czytania, oceniaj i pisz recenzje swoich książek.',
              action: () => navigate('/shelf'),
              label: 'Moja półka',
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-white border border-[#c9b99a] rounded-lg p-6 text-center hover:border-[#382110] transition-colors"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-medium text-[#382110] mb-2">{f.title}</h3>
              <p className="text-sm text-[#7a6248] leading-relaxed mb-4">{f.desc}</p>
              <button
                onClick={f.action}
                className="text-sm text-[#382110] underline cursor-pointer bg-transparent border-none hover:text-[#5c3d1e] transition-colors"
              >
                {f.label}
              </button>
            </div>
          ))}
        </div>
      </div>
    <Footer />
    </div>
  );
}