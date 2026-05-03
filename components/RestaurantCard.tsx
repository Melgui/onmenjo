import Link from 'next/link';
import { Restaurant, Card, CARD_LABELS } from '@/lib/data';

interface Props {
  restaurant: Restaurant;
}

export default function RestaurantCard({ restaurant: r }: Props) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-sm transition-shadow">
      <div className="mb-3">
        <Link href={`/restaurants/${r.id}`} className="font-medium text-sm text-gray-900 hover:underline">
          {r.name}
        </Link>
        <div className="text-xs text-gray-400 mt-0.5">{r.barri} · {r.tipo}</div>
        <div className="text-xs text-gray-300 mt-0.5">{r.address}</div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {(Object.keys(CARD_LABELS) as Card[]).map(card => (
          <span key={card} className={`text-xs px-2 py-0.5 rounded font-medium ${
            r.cards[card]
              ? 'bg-green-50 text-green-700'
              : 'bg-gray-50 text-gray-400'
          }`}>
            {r.cards[card] ? '✓' : '✗'} {CARD_LABELS[card]}
          </span>
        ))}
      </div>
    </div>
  );
}
