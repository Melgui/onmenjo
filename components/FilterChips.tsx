'use client';
import { Card, CARD_LABELS } from '@/lib/data';

interface Props {
  active: Card | '';
  onChange: (card: Card | '') => void;
}

const chips: { label: string; value: Card | '' }[] = [
  { label: 'Totes', value: '' },
  ...Object.entries(CARD_LABELS).map(([k, v]) => ({ label: v, value: k as Card })),
];

export default function FilterChips({ active, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2 my-4">
      {chips.map(chip => (
        <button
          key={chip.value}
          onClick={() => onChange(chip.value)}
          className={`px-4 py-1 rounded-full text-xs cursor-pointer border transition-colors ${
            active === chip.value
              ? 'bg-gray-800 border-gray-800 text-white font-medium'
              : 'bg-white border-gray-200 text-gray-500 hover:border-gray-400'
          }`}
        >
          {chip.label}
        </button>
      ))}
    </div>
  );
}
