'use client';
import { useState } from 'react';
import { Card, CARD_LABELS, Restaurant } from '@/lib/data';

interface Props {
  onClose: () => void;
  onAdd: (restaurant: Restaurant) => void;
}

export default function AddRestaurantModal({ onClose, onAdd }: Props) {
  const [name, setName] = useState('');
  const [barri, setBarri] = useState('');
  const [tipo, setTipo] = useState('');
  const [address, setAddress] = useState('');
  const [cards, setCards] = useState<Record<Card, boolean>>({
    ticket: false, sodexo: false, coverflex: false, pluxee: false,
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const restaurant: Restaurant = {
      id: Date.now(),
      name, barri, tipo, address, cards,
    };
    onAdd(restaurant);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-lg font-semibold mb-4">Afegir restaurant</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            required
            placeholder="Nom del restaurant"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-gray-400"
          />
          <input
            required
            placeholder="Barri"
            value={barri}
            onChange={e => setBarri(e.target.value)}
            className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-gray-400"
          />
          <input
            required
            placeholder="Tipus (Bar, Pizzeria...)"
            value={tipo}
            onChange={e => setTipo(e.target.value)}
            className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-gray-400"
          />
          <input
            required
            placeholder="Adreça"
            value={address}
            onChange={e => setAddress(e.target.value)}
            className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-gray-400"
          />

          <div className="flex flex-wrap gap-2 mt-1">
            {(Object.keys(CARD_LABELS) as Card[]).map(card => (
              <button
                key={card}
                type="button"
                onClick={() => setCards(prev => ({ ...prev, [card]: !prev[card] }))}
                className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                  cards[card]
                    ? 'bg-green-50 border-green-300 text-green-700 font-medium'
                    : 'bg-white border-gray-200 text-gray-400'
                }`}
              >
                {cards[card] ? '✓' : '+'} {CARD_LABELS[card]}
              </button>
            ))}
          </div>

          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50"
            >
              Cancel·lar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-sm bg-gray-800 text-white rounded-lg hover:bg-gray-700"
            >
              Afegir
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
