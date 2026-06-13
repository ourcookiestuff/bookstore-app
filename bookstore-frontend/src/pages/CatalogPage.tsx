import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getBooks } from '../api/bookApi';
import BookCard from '../components/books/BookCard';
import Navbar from '../components/common/Navbar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Footer from '../components/common/Footer';

const GENRES = ['Fantasy', 'Science Fiction', 'Klasyka', 'Dystopia'];

export default function CatalogPage() {
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [page, setPage] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ['books', search, genre, page],
    queryFn: () => getBooks({ search, genre, page, size: 15 }),
  });

  return (
    <div className="min-h-screen bg-[#f4f1ea]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className='flex flex-col lg:flex-row gap-8'>

          {/* Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-white rounded-lg border p-4 sticky top-20">
              <h2 className="font-semibold mb-4">Kategorie</h2>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    setGenre('');
                    setPage(0);
                  }}
                  className={`text-left px-3 py-2 rounded ${
                    genre === ''
                      ? 'bg-[#382110] text-white'
                      : 'hover:bg-[#f4f1ea]'
                  }`}
                >
                  Wszystkie
                </button>

                {GENRES.map((g) => (
                  <button
                    key={g}
                    onClick={() => {
                      setGenre(g);
                      setPage(0);
                    }}
                    className={`text-left px-3 py-2 rounded ${
                      genre === g
                        ? 'bg-[#382110] text-white'
                        : 'hover:bg-[#f4f1ea]'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <main className="flex-1">
            <div className="lg:hidden mb-4">
              <Accordion type="single" collapsible>
                <AccordionItem value="genres">
                  <AccordionTrigger className="text-2xl font-medium text-[#382110]">
                    Kategorie
                  </AccordionTrigger>

                  <AccordionContent>
                    <div className="flex flex-wrap gap-2 pt-2">

                      <Button
                        variant={genre === '' ? 'default' : 'outline'}
                        onClick={() => {
                          setGenre('');
                          setPage(0);
                        }}
                      >
                        Wszystkie
                      </Button>

                      {GENRES.map((g) => (
                        <Button
                          key={g}
                          variant={genre === g ? 'default' : 'outline'}
                          onClick={() => {
                            setGenre(g);
                            setPage(0);
                          }}
                        >
                          {g}
                        </Button>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            
            {/* Główna zawartość */}
            <div className="mb-6">
              <h1 className="text-2xl font-medium text-[#382110]">
                Katalog książek
              </h1>

              <p className="text-sm text-[#7a6248] mb-4">
                {data?.totalElements ?? '...'} książek w naszej bibliotece
              </p>

              {/* Pasek wyszukiwania */}
              <div className="mb-8">
                <Input
                  type="text"
                  placeholder="Szukaj po tytule lub autorze..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                  className="flex-1 bg-white border-[#c9b99a] text-[#382110] focus-visible:ring-[#382110] placeholder:text-[#c9b99a]"
                />
              </div>
              
              {/* Lista książek */}
              {isLoading ? (
                <div className="grid grid-cols-3 lg:grid-cols-5 gap-6">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="w-full aspect-[2/3] bg-[#e8d5b7] rounded-lg" />
                      <div className="mt-2.5 space-y-2">
                        <div className="h-3 bg-[#e8d5b7] rounded w-3/4" />
                        <div className="h-3 bg-[#e8d5b7] rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-3 lg:grid-cols-5 gap-6">
                    {data?.content.map((book) => (
                      <BookCard key={book.id} book={book} />
                    ))}
                  </div>

                  {data?.content.length === 0 && (
                    <div className="text-center py-16">
                      <p className="text-[#7a6248] text-lg">Nie znaleziono książek.</p>
                      <p className="text-[#c9b99a] text-sm mt-1">Spróbuj zmienić kryteria wyszukiwania.</p>
                    </div>
                  )}

                  
                  {data && data.totalPages > 1 && (
                    <div className="flex justify-center items-center gap-3 mt-10">
                      <Button
                        variant="outline"
                        onClick={() => setPage((p) => p - 1)}
                        disabled={data.first}
                        className="border-[#c9b99a] text-[#382110] hover:bg-[#e8d5b7] cursor-pointer"
                      >
                        Poprzednia
                      </Button>
                      <span className="text-sm text-[#7a6248]">
                        {page + 1} / {data.totalPages}
                      </span>
                      <Button
                        variant="outline"
                        onClick={() => setPage((p) => p + 1)}
                        disabled={data.last}
                        className="border-[#c9b99a] text-[#382110] hover:bg-[#e8d5b7] cursor-pointer"
                      >
                        Następna
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}