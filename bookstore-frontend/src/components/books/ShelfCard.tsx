import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateShelfEntry, removeFromShelf } from '../../api/shelfApi';
import type { ShelfEntryResponse, ShelfStatus } from '../../types';
import { toast } from 'sonner';

const STATUS_LABELS: Record<ShelfStatus, string> = {
  TO_READ: 'Do przeczytania',
  READING: 'Czytam teraz',
  READ: 'Przeczytane',
};

const STATUS_TABS: ShelfStatus[] = ['TO_READ', 'READING', 'READ'];

function StarRating({ rating, onChange }: { rating: number | null; onChange?: (r: number) => void }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onChange?.(star)}
          className={`text-lg cursor-pointer bg-transparent border-none leading-none ${
            rating && star <= rating ? 'text-[#c9945a]' : 'text-[#c9b99a]'
          } ${onChange ? 'hover:text-[#c9945a] transition-colors' : ''}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function ShelfCard({ entry }: { entry: ShelfEntryResponse }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [expanded, setExpanded] = useState(false);
  const [page, setPage] = useState(entry.currentPage ?? 0);
  const [review, setReview] = useState(entry.review ?? '');

  const updateMutation = useMutation({
    mutationFn: (data: Parameters<typeof updateShelfEntry>[1]) =>
      updateShelfEntry(entry.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shelf'] });
      toast.success('Zapisano zmiany');
    },
  });

  const removeMutation = useMutation({
    mutationFn: () => removeFromShelf(entry.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shelf'] });
      toast.success('Usunięto z półki');
    },
  });

  const progress = entry.pages && entry.currentPage
    ? Math.min(Math.round((entry.currentPage / entry.pages) * 100), 100)
    : null;

  return (
    <div className="bg-white border border-[#c9b99a] rounded-lg overflow-hidden">
      <div className="flex gap-4 p-4">

        {/* Okładka */}
        <div
          className="w-16 aspect-[2/3] bg-[#e8d5b7] rounded overflow-hidden flex-shrink-0 cursor-pointer"
          onClick={() => navigate(`/books/${entry.bookId}`)}
        >
          {entry.coverImageUrl && (
            <img
              src={entry.coverImageUrl}
              alt={entry.title}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          )}
        </div>

        {/* Informacje */}
        <div className="flex-1">
          <p
            className="font-medium text-[#382110] cursor-pointer hover:underline"
            onClick={() => navigate(`/books/${entry.bookId}`)}
          >
            {entry.title}
          </p>
          <p className="text-sm text-[#7a6248]">{entry.author}</p>

          {/* Ocena */}
          <div className="mt-2">
            <StarRating
              rating={entry.rating}
              onChange={(r) => updateMutation.mutate({ status: entry.status, rating: r, currentPage: entry.currentPage ?? 0 })}
            />
          </div>

          {/* Pasek postępu dla "Czytam teraz" */}
          {entry.status === 'READING' && entry.pages && (
            <div className="mt-2">
              <div className="flex justify-between text-xs text-[#7a6248] mb-1">
                <span>Postęp</span>
                <span>{entry.currentPage ?? 0} / {entry.pages} str. {progress !== null && `(${progress}%)`}</span>
              </div>
              <div className="w-full bg-[#e8d5b7] rounded-full h-1.5">
                <div
                  className="bg-[#382110] h-1.5 rounded-full transition-all"
                  style={{ width: `${progress ?? 0}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Akcje */}
        <div className="flex flex-col items-end justify-between">
          <button
            onClick={() => removeMutation.mutate()}
            className="text-xs text-red-400 hover:text-red-600 cursor-pointer bg-transparent border-none"
          >
            Usuń
          </button>
          <button
            onClick={() => setExpanded((e) => !e)}
            className="text-xs text-[#7a6248] hover:text-[#382110] cursor-pointer bg-transparent border-none"
          >
            {expanded ? 'Zwiń ▲' : 'Edytuj ▼'}
          </button>
        </div>
      </div>

      {/* Panel edycji */}
      {expanded && (
        <div className="border-t border-[#c9b99a] p-4 bg-[#f4f1ea] space-y-3">

          {/* Zmiana statusu */}
          <div>
            <p className="text-xs text-[#7a6248] uppercase tracking-wider mb-2">Status</p>
            <div className="flex gap-2 flex-wrap">
              {STATUS_TABS.map((s) => (
                <button
                  key={s}
                  onClick={() => updateMutation.mutate({ status: s, currentPage: page, rating: entry.rating ?? undefined, review })}
                  className={`px-3 py-1 text-xs rounded-full border transition-colors cursor-pointer ${
                    entry.status === s
                      ? 'bg-[#382110] text-[#f4f1ea] border-[#382110]'
                      : 'bg-white text-[#7a6248] border-[#c9b99a] hover:border-[#382110]'
                  }`}
                >
                  {STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          </div>

          {/* Aktualna strona */}
          {entry.status === 'READING' && (
            <div>
              <p className="text-xs text-[#7a6248] uppercase tracking-wider mb-2">Aktualna strona</p>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={page}
                  min={0}
                  max={entry.pages ?? 9999}
                  onChange={(e) => setPage(Number(e.target.value))}
                  className="w-24 px-3 py-1.5 border border-[#c9b99a] rounded text-sm text-[#382110] bg-white outline-none focus:border-[#382110]"
                />
                <span className="text-xs text-[#7a6248]">z {entry.pages ?? '?'} str.</span>
                <button
                  onClick={() => updateMutation.mutate({ status: entry.status, currentPage: page, rating: entry.rating ?? undefined, review })}
                  className="px-3 py-1.5 bg-[#382110] text-[#f4f1ea] text-xs rounded hover:bg-[#5c3d1e] cursor-pointer border-none"
                >
                  Zapisz
                </button>
              </div>
            </div>
          )}

          {/* Recenzja */}
          <div>
            <p className="text-xs text-[#7a6248] uppercase tracking-wider mb-2">Recenzja</p>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Napisz krótką recenzję..."
              rows={3}
              className="w-full px-3 py-2 border border-[#c9b99a] rounded text-sm text-[#382110] bg-white outline-none focus:border-[#382110] resize-none"
            />
            <button
              onClick={() => updateMutation.mutate({ status: entry.status, currentPage: page, rating: entry.rating ?? undefined, review })}
              className="mt-2 px-3 py-1.5 bg-[#382110] text-[#f4f1ea] text-xs rounded hover:bg-[#5c3d1e] cursor-pointer border-none"
            >
              Zapisz recenzję
            </button>
          </div>
        </div>
      )}
    </div>
  );
}