import { prisma } from '@/lib/prisma';
import { toRestaurant } from '@/lib/restaurant';
import { Card } from '@/lib/data';
import { NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import type { Prisma } from '@prisma/client';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') ?? '';
  const card = req.nextUrl.searchParams.get('card') as Card | null;

  const where: Prisma.RestaurantWhereInput = {};

  if (q) {
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { barri: { contains: q, mode: 'insensitive' } },
    ];
  }

  if (card) {
    where[card] = true;
  }

  const rows = await prisma.restaurant.findMany({ where, orderBy: { id: 'asc' } });
  return Response.json(rows.map(toRestaurant));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, barri, tipo, address, cards } = body;

  if (!name || !barri || !tipo || !address) {
    return Response.json({ error: 'Faltan campos' }, { status: 400 });
  }

  const created = await prisma.restaurant.create({
    data: {
      name, barri, tipo, address,
      ticket: !!cards?.ticket,
      sodexo: !!cards?.sodexo,
      coverflex: !!cards?.coverflex,
      pluxee: !!cards?.pluxee,
    },
  });

  // Invalida el caché de la home para que el siguiente render muestre el nuevo restaurante
  revalidatePath('/');

  return Response.json(toRestaurant(created), { status: 201 });
}
