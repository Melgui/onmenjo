import { prisma } from '@/lib/prisma';
import { toRestaurant } from '@/lib/restaurant';
import RestaurantCard from '@/components/RestaurantCard';
import DeleteButton from '@/components/DeleteButton';

// Cachea cada detalle 5 minutos. revalidatePath('/restaurants/[id]') desde DELETE
// invalida cuando se borra un restaurante.
export const revalidate = 300;

interface Props {
  params: Promise<{ id: string }>;
}

export default async function RestaurantPage({ params }: Props) {
  const { id } = await params;
  const numericId = Number(id);

  if (Number.isNaN(numericId)) {
    return <p className="p-8 text-gray-400">Id invàlid</p>;
  }

  const row = await prisma.restaurant.findUnique({ where: { id: numericId } });

  if (!row) {
    return <p className="p-8 text-gray-400">Restaurant no trobat</p>;
  }

  const restaurant = toRestaurant(row);

  return (
    <main className="max-w-xl mx-auto px-4 py-8">
      <RestaurantCard restaurant={restaurant} />
      <DeleteButton id={restaurant.id} name={restaurant.name} />
    </main>
  );
}
