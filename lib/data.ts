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

export const restaurants: Restaurant[] = [
  { id: 1, name: "Bar Calders", barri: "Sant Antoni", tipo: "Bar de tapas",
    address: "Carrer del Parlament, 25", cards: { ticket: true, sodexo: true, coverflex: false, pluxee: true } },
  { id: 2, name: "Federal Café", barri: "Sant Antoni", tipo: "Café & brunch",
    address: "Carrer del Parlament, 39", cards: { ticket: false, sodexo: false, coverflex: true, pluxee: false } },
  { id: 3, name: "Parking Pizza", barri: "Eixample", tipo: "Pizzería",
    address: "Carrer de Londres, 98", cards: { ticket: true, sodexo: true, coverflex: true, pluxee: true } },
  { id: 4, name: "La Pepita", barri: "Gràcia", tipo: "Bocadillería",
    address: "Carrer de Còrsega, 343", cards: { ticket: true, sodexo: false, coverflex: false, pluxee: false } },
  { id: 5, name: "Cervecería Catalana", barri: "Eixample", tipo: "Restaurante",
    address: "Carrer de Mallorca, 236", cards: { ticket: true, sodexo: true, coverflex: false, pluxee: true } },
  { id: 6, name: "Bar Mut", barri: "Eixample", tipo: "Bistró",
    address: "Carrer de Pau Claris, 192", cards: { ticket: false, sodexo: false, coverflex: false, pluxee: false } },
  { id: 7, name: "Tepic", barri: "Gràcia", tipo: "Mexicano",
    address: "Carrer de Napols, 311", cards: { ticket: true, sodexo: false, coverflex: true, pluxee: false } },
  { id: 8, name: "Can Kenji", barri: "Eixample", tipo: "Japonés",
    address: "Carrer del Rosselló, 325", cards: { ticket: false, sodexo: true, coverflex: true, pluxee: true } },
  { id: 9, name: "La Cova Fumada", barri: "Barceloneta", tipo: "Tradicional",
    address: "Carrer del Baluard, 56", cards: { ticket: true, sodexo: true, coverflex: false, pluxee: false } },
  { id: 10, name: "Koku Kitchen", barri: "Raval", tipo: "Asiático",
    address: "Carrer dels Àngels, 16", cards: { ticket: false, sodexo: false, coverflex: true, pluxee: true } },
];
