import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';
dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.restaurant.createMany({
    data: [
      { name: "Bar Calders", barri: "Sant Antoni", tipo: "Bar de tapas", address: "Carrer del Parlament, 25", ticket: true, sodexo: true, coverflex: false, pluxee: true },
      { name: "Federal Café", barri: "Sant Antoni", tipo: "Café & brunch", address: "Carrer del Parlament, 39", ticket: false, sodexo: false, coverflex: true, pluxee: false },
      { name: "Parking Pizza", barri: "Eixample", tipo: "Pizzería", address: "Carrer de Londres, 98", ticket: true, sodexo: true, coverflex: true, pluxee: true },
      { name: "La Pepita", barri: "Gràcia", tipo: "Bocadillería", address: "Carrer de Còrsega, 343", ticket: true, sodexo: false, coverflex: false, pluxee: false },
      { name: "Cervecería Catalana", barri: "Eixample", tipo: "Restaurante", address: "Carrer de Mallorca, 236", ticket: true, sodexo: true, coverflex: false, pluxee: true },
      { name: "Bar Mut", barri: "Eixample", tipo: "Bistró", address: "Carrer de Pau Claris, 192", ticket: false, sodexo: false, coverflex: false, pluxee: false },
      { name: "Tepic", barri: "Gràcia", tipo: "Mexicano", address: "Carrer de Napols, 311", ticket: true, sodexo: false, coverflex: true, pluxee: false },
      { name: "Can Kenji", barri: "Eixample", tipo: "Japonés", address: "Carrer del Rosselló, 325", ticket: false, sodexo: true, coverflex: true, pluxee: true },
      { name: "La Cova Fumada", barri: "Barceloneta", tipo: "Tradicional", address: "Carrer del Baluard, 56", ticket: true, sodexo: true, coverflex: false, pluxee: false },
      { name: "Koku Kitchen", barri: "Raval", tipo: "Asiático", address: "Carrer dels Àngels, 16", ticket: false, sodexo: false, coverflex: true, pluxee: true },
    ],
  });

  console.log('Seed completat!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
