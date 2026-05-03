import { restaurants, Card } from '@/lib/data';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.toLowerCase() ?? '';
  const card = req.nextUrl.searchParams.get('card') as Card | null;

  let results = restaurants.filter(r =>
    r.name.toLowerCase().includes(q) || r.barri.toLowerCase().includes(q)
  );

  if (card) {
    results = results.filter(r => r.cards[card] === true);
  }

  return Response.json(results);
}
