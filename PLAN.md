# Proyecto: Targeta Restaurant — Plan de aprendizaje y handoff

## Contexto

Proyecto web para buscar si un restaurante acepta tarjeta restaurante (Ticket, Sodexo, Coverflex, Pluxee).
Desarrollado por Gerard, ingeniero informático con experiencia en webs, apps, compiladores y sistemas distribuidos.
**Objetivo dual**: aprender Next.js construyendo algo real.

---

## Stack decidido

| Pieza | Tecnología | Por qué |
|---|---|---|
| Framework | Next.js (App Router) | Frontend + backend en un codebase, estándar de facto |
| UI | React + Tailwind CSS | Componentes reutilizables, CSS sin dolor |
| Datos iniciales | JSON/TypeScript (seed) | Sin BD externa, foco en aprender el framework |
| Lenguaje | TypeScript | Tipado, mejor DX |
| Deploy | Vercel | Los mismos que hacen Next.js, zero config |

---

## Estructura del proyecto

```
onmenjo/
├── app/
│   ├── page.tsx                    ← Página principal (búsqueda + resultados)
│   ├── layout.tsx                  ← Layout global (generado por create-next-app)
│   └── api/
│       └── restaurants/
│           └── route.ts            ← GET /api/restaurants?q=...&card=ticket
├── components/
│   ├── SearchBar.tsx               ← Input de búsqueda
│   ├── FilterChips.tsx             ← Chips de filtro por tarjeta
│   └── RestaurantCard.tsx          ← Card de cada restaurante
├── lib/
│   └── data.ts                     ← Seed data (restaurantes inventados)
├── PLAN.md                         ← Este fichero
└── package.json
```

---

## Lo que NO se ha creado todavía

Todo lo siguiente está diseñado y decidido pero pendiente de implementar:

### Ficheros por crear

```
app/page.tsx                  — página principal con búsqueda y resultados
app/api/restaurants/route.ts  — endpoint backend con filtros por nombre y tarjeta
lib/data.ts                   — seed data con ~10-15 restaurantes de ejemplo
components/SearchBar.tsx      — input controlado con debounce
components/FilterChips.tsx    — chips para filtrar por Ticket/Sodexo/Coverflex/Pluxee
components/RestaurantCard.tsx — card con nombre, barrio, tipo y badges de tarjetas
```

### Funcionalidades pendientes

- [ ] Búsqueda por nombre o barrio (query param `q`)
- [ ] Filtro por tarjeta específica (query param `card`)
- [ ] Página de detalle de restaurante `/restaurants/[id]`
- [ ] Formulario para añadir restaurante (admin simple, sin auth)
- [ ] Sistema de confirmaciones por usuarios (crowdsourcing, fase 2)
- [ ] Persistencia real en BD (SQLite con Prisma, o Supabase — fase 2)

---

## Plan de aprendizaje

### Semana 1 — React puro (antes de tocar Next.js)

**Objetivo**: entender el modelo mental de componentes, estado y efectos.

| Concepto | Qué aprender | Dónde practicarlo |
|---|---|---|
| Componentes y props | Crear `RestaurantCard` que recibe datos por props | `components/RestaurantCard.tsx` |
| Estado (`useState`) | Input de búsqueda controlado | `components/SearchBar.tsx` |
| Efectos (`useEffect`) | Hacer fetch cuando cambia el query | `app/page.tsx` |
| Listas y keys | Renderizar lista de restaurantes | `app/page.tsx` |

**Ejercicio concreto**: hacer que `app/page.tsx` tenga un input, y al escribir filtre una lista hardcodeada (sin API todavía).

---

### Semana 2 — Next.js App Router

**Objetivo**: entender SSR, API Routes y routing por ficheros.

| Concepto | Qué aprender | Dónde practicarlo |
|---|---|---|
| Routing por ficheros | Crear `/restaurants/[id]/page.tsx` | Nueva página de detalle |
| API Routes | Endpoint `GET /api/restaurants` | `app/api/restaurants/route.ts` |
| Server Components | Fetch en servidor sin `useEffect` | Refactorizar `page.tsx` |
| Client Components | `'use client'` — cuándo y por qué | `SearchBar.tsx` necesita ser client |

**Ejercicio concreto**: conectar `page.tsx` a la API Route real. Que el fetch venga del servidor.

**Concepto clave a entender**: la diferencia entre:
```tsx
// Server Component — se ejecuta en servidor, no envía JS al cliente
export default async function Page() {
  const data = await fetch('/api/restaurants').then(r => r.json());
  return <RestaurantCard data={data} />;
}

// Client Component — se ejecuta en navegador, puede tener useState
'use client';
export default function SearchBar() {
  const [q, setQ] = useState('');
  // ...
}
```

---

### Semana 3 — Pulir y desplegar

**Objetivo**: tener algo real funcionando en producción.

- Añadir Tailwind CSS y diseñar los componentes
- Crear formulario de añadir restaurante (sin auth, admin simple)
- Deploy en Vercel (conectar repo GitHub → Vercel detecta Next.js automáticamente)
- Dominio propio opcional

---

## Cómo arrancar el proyecto desde cero

```bash
pnpm create next-app@latest onmenjo \
  --typescript \
  --tailwind \
  --app \
  --no-src-dir \
  --import-alias "@/*"

cd onmenjo
pnpm dev
```

Visita `http://localhost:3000` — ya tienes Next.js funcionando.

---

## Código de arranque

### `lib/data.ts`

```typescript
export type Card = 'ticket' | 'sodexo' | 'coverflex' | 'pluxee';

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
```

### `app/api/restaurants/route.ts`

```typescript
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
```

### `app/page.tsx` (punto de partida)

```tsx
'use client';
import { useState, useEffect } from 'react';
import { Restaurant } from '@/lib/data';

export default function Home() {
  const [query, setQuery] = useState('');
  const [activeCard, setActiveCard] = useState<string>('');
  const [results, setResults] = useState<Restaurant[]>([]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (activeCard) params.set('card', activeCard);

    fetch(`/api/restaurants?${params}`)
      .then(r => r.json())
      .then(setResults);
  }, [query, activeCard]);

  return (
    <main style={{ maxWidth: 640, margin: '0 auto', padding: '2rem 1rem' }}>
      <h1>¿Acepta tarjeta restaurante?</h1>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Busca por nombre o barrio..."
      />
      {/* Aquí irán los FilterChips y RestaurantCard — semana 1 */}
      {results.map(r => (
        <div key={r.id}>
          <strong>{r.name}</strong> — {r.barri}
        </div>
      ))}
    </main>
  );
}
```

---

## Recursos recomendados

- **Next.js docs**: https://nextjs.org/docs — el tutorial oficial (~2h) es el mejor punto de entrada
- **React docs**: https://react.dev — especialmente "Thinking in React"
- **Tailwind**: https://tailwindcss.com/docs — busca por propiedad CSS que quieras aplicar

---

## Notas para el siguiente agente

- Gerard usa voice-to-text, puede haber ruido en sus mensajes
- Tiene perfil de ingeniero senior (compiladores, distribuida, webs clásicas con PHP)
- No necesita que le expliquen conceptos básicos de programación, sí los específicos de React/Next.js
- El proyecto es deliberadamente simple para aprender — no añadir complejidad innecesaria todavía
- La conversación de aprendizaje está en Claude.ai y cubre: CSR vs SSR, SPAs, routing, bundling, React vs Next.js, TanStack
