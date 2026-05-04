import { prisma } from '@/lib/prisma';
import { toRestaurant } from '@/lib/restaurant';
import RestaurantsExplorer from '@/components/RestaurantsExplorer';

// Cachea el render de la home durante 60s. Las mutaciones (POST/DELETE) llaman
// a revalidatePath('/') para invalidar inmediatamente cuando algo cambia.
export const revalidate = 60;

export default async function Home() {
  const rows = await prisma.restaurant.findMany({ orderBy: { id: 'asc' } });
  const initialRestaurants = rows.map(toRestaurant);

  return <RestaurantsExplorer initialRestaurants={initialRestaurants} />;
}
