import { prisma } from '@/lib/prisma';
import { Card } from '@/lib/data';
import { NextRequest } from 'next/server';
import type { Prisma } from '@prisma/client';

// Convierte fila plana de la BD al formato anidado que espera el frontend
function toApi(r: { id: number; name: string; barri: string; tipo: string; address: string; ticket: boolean; sodexo: boolean; coverflex: boolean; pluxee: boolean }) {
  return {
    id: r.id,
    name: r.name,
    barri: r.barri,
    tipo: r.tipo,
    address: r.address,
    cards: { ticket: r.ticket, sodexo: r.sodexo, coverflex: r.coverflex, pluxee: r.pluxee },
  };
}

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
  return Response.json(rows.map(toApi));
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

  return Response.json(toApi(created), { status: 201 });
}
