import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';

interface Params {
  params: Promise<{ id: string }>;
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const numericId = Number(id);

  if (Number.isNaN(numericId)) {
    return Response.json({ error: 'Id invàlid' }, { status: 400 });
  }

  try {
    await prisma.restaurant.delete({ where: { id: numericId } });

    // Invalida el caché de la home y del detalle
    revalidatePath('/');
    revalidatePath(`/restaurants/${id}`);

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: 'No trobat' }, { status: 404 });
  }
}
