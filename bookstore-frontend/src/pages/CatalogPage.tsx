import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getBooks } from '../api/bookApi';
import BookCard from '../components/books/BookCard';
import Navbar from '../components/common/Navbar';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const GENRES = ['Fantasy', 'Science Fiction', 'Klasyka', 'Dystopia'];

export default function CatalogPage() {
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [page, setPage] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ['books', search, genre, page],
    queryFn: () => getBooks({ search, genre, page, size: 12 }),
  });

  return (
    <div className="min-h-screen bg-[#f4f1ea]">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Nagłówek */}
        <div className="mb-8">
          <h1 className="text-2xl font-medium text-[#382110]">Katalog książek</h1>
          <p className="text-sm text-[#7a6248] mt-1">
            {data?.totalElements ?? '...'} książek w naszej bibliotece
          </p>
        </div>

        {/* Pasek wyszukiwania */}
        <div className="flex gap-3 mb-8">
          <Input
            type="text"
            placeholder="Szukaj po tytule lub autorze..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="flex-1 bg-white border-[#c9b99a] text-[#382110] focus-visible:ring-[#382110] placeholder:text-[#c9b99a]"
          />
          <Select
            value={genre || 'all'}
            onValueChange={(val) => { setGenre(val === 'all' ? '' : val); setPage(0); }}
          >
            <SelectTrigger className="w-48 bg-white border-[#c9b99a] text-[#382110] focus:ring-[#382110]">
              <SelectValue placeholder="Wszystkie gatunki" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Wszystkie gatunki</SelectItem>
              {GENRES.map((g) => (
                <SelectItem key={g} value={g}>{g}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
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

            {/* Paginacja */}
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
    </div>
  );
}