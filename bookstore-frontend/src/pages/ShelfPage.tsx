import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getShelf } from '../api/shelfApi';
import type { ShelfStatus } from '../types';
import { Button } from '@/components/ui/button';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ShelfCard from '../components/books/ShelfCard';

const STATUS_LABELS: Record<ShelfStatus, string> = {
  TO_READ: 'Do przeczytania',
  READING: 'Czytam teraz',
  READ: 'Przeczytane',
};

const STATUS_TABS: ShelfStatus[] = ['TO_READ', 'READING', 'READ'];

export default function ShelfPage() {
  const [activeTab, setActiveTab] = useState<ShelfStatus | 'ALL'>('ALL');

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ['shelf', activeTab],
    queryFn: () => getShelf(activeTab === 'ALL' ? undefined : activeTab),
  });

  return (
    <div className="min-h-screen bg-[#f4f1ea] flex flex-col">
    <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-8">

        <h1 className="text-2xl font-medium text-[#382110] mb-6">Moja półka</h1>

        {/* Taby */}
        <div className="flex gap-2 flex-wrap mb-6 border-b border-[#c9b99a] pb-4">
          {(['ALL', ...STATUS_TABS] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 text-sm rounded-full border transition-colors cursor-pointer ${
                activeTab === tab
                  ? 'bg-[#382110] text-[#f4f1ea] border-[#382110]'
                  : 'bg-white text-[#7a6248] border-[#c9b99a] hover:border-[#382110]'
              }`}
            >
              {tab === 'ALL' ? 'Wszystkie' : STATUS_LABELS[tab]}
            </button>
          ))}
        </div>

        {/* Lista */}
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 bg-[#e8d5b7] rounded-lg animate-pulse" />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[#7a6248] text-lg">Półka jest pusta.</p>
            <p className="text-[#c9b99a] text-sm mt-1">Dodaj książki z katalogu.</p>
            <Button
              onClick={() => window.location.href = '/'}
              className="mt-4 bg-[#382110] hover:bg-[#5c3d1e] text-[#f4f1ea] cursor-pointer"
            >
              Przeglądaj katalog
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <ShelfCard key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}