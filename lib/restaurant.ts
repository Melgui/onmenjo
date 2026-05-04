import type { Restaurant as DbRestaurant } from '@prisma/client';
import type { Restaurant } from './data';

/**
 * Convierte una fila de la BD (columnas planas: ticket, sodexo, ...) al formato
 * anidado (`cards: { ticket, sodexo, ... }`) que esperan los componentes.
 */
export function toRestaurant(row: DbRestaurant): Restaurant {
  return {
    id: row.id,
    name: row.name,
    barri: row.barri,
    tipo: row.tipo,
    address: row.address,
    cards: {
      ticket: row.ticket,
      sodexo: row.sodexo,
      coverflex: row.coverflex,
      pluxee: row.pluxee,
    },
  };
}
