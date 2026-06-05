import { useNavigate } from 'react-router-dom';
import type { BookResponse } from '../../types';
import { Badge } from '../ui/badge';

interface Props {
  book: BookResponse;
}

export default function BookCard({ book }: Props) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/books/${book.id}`)}
      className="group cursor-pointer flex flex-col"
    >
      {/* Okładka */}
      <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden shadow-md group-hover:shadow-xl transition-shadow duration-300 bg-[#e8d5b7]">
        {book.coverImageUrl ? (
          <img
            src={book.coverImageUrl}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-24 bg-[#c9b99a] rounded-sm" />
          </div>
        )}

        {/* Overlay przy hover z przyciskiem */}
        <div className="absolute inset-0 bg-[#382110]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
          <button
            onClick={(e) => e.stopPropagation()}
            className="w-full py-2 bg-[#f4f1ea] text-[#382110] text-xs font-medium rounded hover:bg-white transition-colors cursor-pointer"
          >
            Do koszyka
          </button>
        </div>
      </div>

      {/* Informacje pod okładką */}
      <div className="mt-2.5 px-0.5">
        {book.genre && (
          <Badge
            variant="secondary"
            className="bg-[#e8d5b7] text-[#5c3d1e] text-xs mb-1.5 hover:bg-[#e8d5b7]"
          >
            {book.genre}
          </Badge>
        )}
        <p className="text-sm font-medium text-[#382110] truncate leading-tight">
          {book.title}
        </p>
        <p className="text-xs text-[#7a6248] mt-0.5 truncate">
          {book.author}
        </p>
        <p className="text-sm font-medium text-[#382110] mt-1.5">
          {book.price.toFixed(2)} zł
        </p>
      </div>
    </div>
  );
}