'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Restaurant, Card } from '@/lib/data';
import SearchBar from '@/components/SearchBar';
import FilterChips from '@/components/FilterChips';
import RestaurantCard from '@/components/RestaurantCard';
import AddRestaurantModal from '@/components/AddRestaurantModal';

interface Props {
  initialRestaurants: Restaurant[];
}

export default function RestaurantsExplorer({ initialRestaurants }: Props) {
  const [query, setQuery] = useState('');
  const [activeCard, setActiveCard] = useState<Card | ''>('');
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  // Filtrado en cliente — el array completo cabe en memoria sin problema.
  // Se recalcula solo cuando cambian query, activeCard o initialRestaurants.
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return initialRestaurants.filter(r => {
      const matchesQuery =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.barri.toLowerCase().includes(q);
      const matchesCard = !activeCard || r.cards[activeCard];
      return matchesQuery && matchesCard;
    });
  }, [initialRestaurants, query, activeCard]);

  return (
    <main className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">
        Quin restaurant accepta la meva targeta?
      </h1>

      <SearchBar value={query} onChange={setQuery} />
      <FilterChips active={activeCard} onChange={setActiveCard} />

      <p className="text-xs text-gray-400 my-3">
        {results.length} restaurants trobats
      </p>

      <div className="flex flex-col gap-2">
        {results.map(r => <RestaurantCard key={r.id} restaurant={r} />)}
      </div>

      <button
        onClick={() => setShowModal(true)}
        className="w-full mt-4 py-3 text-sm text-gray-400 border border-dashed border-gray-200 rounded-xl hover:border-gray-400 hover:text-gray-600 transition-colors"
      >
        + Afegir restaurant
      </button>

      {showModal && (
        <AddRestaurantModal
          onClose={() => setShowModal(false)}
          onAdded={() => router.refresh()}
        />
      )}
    </main>
  );
}
