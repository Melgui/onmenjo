'use client';
import { use } from 'react';
import { restaurants, Restaurant } from '@/lib/data';
import RestaurantCard from '@/components/RestaurantCard';

const STORAGE_KEY = 'onmenjo_custom';

interface Props {
  params: Promise<{ id: string }>;
}

export default function RestaurantPage({ params }: Props) {
  const { id } = use(params);

  const seed = restaurants.find(r => r.id === Number(id));

  let custom: Restaurant[] = [];
  try {
    custom = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    custom = [];
  }

  const restaurant = seed ?? custom.find(r => r.id === Number(id));

  if (!restaurant) {
    return <p className="p-8 text-gray-400">Restaurant no trobat</p>;
  }

  return (
    <main className="max-w-xl mx-auto px-4 py-8">
      <RestaurantCard restaurant={restaurant} />
    </main>
  );
}
