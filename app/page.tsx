'use client';
import { useState, useEffect } from 'react';
import { Restaurant, Card, restaurants as seedData } from '@/lib/data';
import SearchBar from '@/components/SearchBar';
import FilterChips from '@/components/FilterChips';
import RestaurantCard from '@/components/RestaurantCard';
import AddRestaurantModal from '@/components/AddRestaurantModal';

const STORAGE_KEY = 'onmenjo_custom';

function loadCustom(): Restaurant[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
}

export default function Home() {
  const [query, setQuery] = useState('');
  const [activeCard, setActiveCard] = useState<Card | ''>('');
  const [results, setResults] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [custom, setCustom] = useState<Restaurant[]>([]);

  useEffect(() => {
    setCustom(loadCustom());
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      if (activeCard) params.set('card', activeCard);

      fetch(`/api/restaurants?${params}`)
        .then(r => r.json())
        .then((data: Restaurant[]) => {
          const filteredCustom = custom.filter(r =>
            (!query || r.name.toLowerCase().includes(query.toLowerCase()) || r.barri.toLowerCase().includes(query.toLowerCase())) &&
            (!activeCard || r.cards[activeCard])
          );
          setResults([...data, ...filteredCustom]);
          setLoading(false);
        });
    }, 300);
    return () => clearTimeout(timer);
  }, [query, activeCard, custom]);

  function handleAdd(restaurant: Restaurant) {
    const updated = [...custom, restaurant];
    setCustom(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  return (
    <main className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">
        Quin restaurant accepta la meva targeta?
      </h1>

      <SearchBar value={query} onChange={setQuery} />
      <FilterChips active={activeCard} onChange={setActiveCard} />

      <p className="text-xs text-gray-400 my-3">
        {loading ? 'Buscant...' : `${results.length} restaurants trobats`}
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
          onAdd={handleAdd}
        />
      )}
    </main>
  );
}
