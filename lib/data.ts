export type Card = 'ticket' | 'sodexo' | 'coverflex' | 'pluxee';

export const CARD_LABELS: Record<Card, string> = {
  ticket: 'Ticket Restaurant',
  sodexo: 'Sodexo',
  coverflex: 'Coverflex',
  pluxee: 'Pluxee',
};

export interface Restaurant {
  id: number;
  name: string;
  barri: string;
  tipo: string;
  address: string;
  cards: Record<Card, boolean>;
}
