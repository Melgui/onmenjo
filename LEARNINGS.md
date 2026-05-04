# OnMenjo — Aprendizajes desde cero

Resumen de los conceptos clave aprendidos construyendo este proyecto, desde una carpeta vacía hasta producción con base de datos real.

---

## 1. Arrancar un proyecto Next.js

```bash
pnpm create next-app@latest onmenjo \
  --typescript \
  --tailwind \
  --app \
  --no-src-dir \
  --import-alias "@/*"
```

Flags clave:
- `--app` — usa el App Router (la forma moderna)
- `--no-src-dir` — sin la carpeta `src/`
- `--import-alias "@/*"` — atajo para imports: `@/components/X` en vez de `../../components/X`

### Estructura generada

```
app/          → páginas y API routes (routing por ficheros)
components/   → componentes reutilizables
lib/          → código compartido (utils, prisma client...)
public/       → archivos estáticos (imágenes, fuentes...)
```

---

## 2. React — conceptos centrales

### Componentes y props

Un componente es una función que devuelve JSX. Los **props** son sus parámetros:

```tsx
interface Props { restaurant: Restaurant }

export default function RestaurantCard({ restaurant }: Props) {
  return <div>{restaurant.name}</div>;
}
```

Uso:
```tsx
<RestaurantCard restaurant={r} />
```

### `useState` — estado local

Mantiene un valor entre renders. Si lo cambias, React redibuja el componente.

```tsx
const [query, setQuery] = useState('');
```

- `query` → valor actual
- `setQuery` → función para cambiarlo

**Nunca asignes directamente** (`query = 'x'`); siempre usa `setQuery`.

### `useEffect` — efectos secundarios

Ejecuta código cuando cambian las dependencias.

```tsx
useEffect(() => {
  fetch('/api/...').then(...)
}, [query]); // se ejecuta cuando query cambia
```

El `return` del callback es la función de **cleanup** — se ejecuta antes del siguiente efecto. Útil para cancelar timers, suscripciones, etc.

### Componente controlado

El estado vive en el padre, no en el hijo. El hijo solo recibe el valor por props y avisa al padre cuando hay cambios.

```tsx
// Padre tiene el useState
<SearchBar value={query} onChange={setQuery} />
```

Regla: el estado va en el componente más arriba que lo necesite.

### `.map()` para listas

```tsx
{results.map(r => <RestaurantCard key={r.id} restaurant={r} />)}
```

`key` es obligatorio cuando renderizas listas — React lo usa para identificar cada elemento.

---

## 3. Next.js App Router

### Routing por ficheros

Sin configuración. Crea una carpeta y existe la ruta:

```
app/page.tsx                    → /
app/restaurants/[id]/page.tsx   → /restaurants/123
app/api/restaurants/route.ts    → /api/restaurants
```

`[id]` es un **parámetro dinámico**. Su valor llega como prop:

```tsx
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
}
```

En Next.js 15+ los `params` son una `Promise` — hay que hacer `await`.

### Server vs Client Components

| Server Component | Client Component |
|---|---|
| Por defecto | Necesita `'use client'` arriba |
| Se ejecuta en servidor | Se ejecuta en navegador |
| No envía JS al cliente | Envía JS para hidratar |
| Puede acceder a BD/secrets | Solo APIs públicas |
| No puede usar `useState`/`useEffect` | Sí puede |

Regla: usa Server por defecto, Client solo cuando necesites interacción/estado/efectos del navegador.

### `Link` de Next.js

Navegación sin recargar la página:

```tsx
import Link from 'next/link';
<Link href="/restaurants/1">Ver detalle</Link>
```

Diferencia con `<a>` normal:
- `<a>` → recarga la página entera
- `Link` → navegación cliente, instantánea, hace prefetch automático

### API Routes

Endpoints HTTP en `app/api/.../route.ts`:

```ts
export async function GET(req: NextRequest) { ... }
export async function POST(req: NextRequest) { ... }
export async function DELETE(_req: NextRequest, { params }) { ... }
```

Cada función exportada (GET, POST, DELETE...) es un método HTTP.

---

## 4. TypeScript

### Tipos como structs

```ts
interface Restaurant {
  id: number;
  name: string;
  cards: Record<Card, boolean>;
}
```

Solo existe en compilación — desaparece en runtime.

### Union types

```ts
type Card = 'ticket' | 'sodexo' | 'coverflex' | 'pluxee';
```

Solo permite esos 4 valores. Si pones otro, error en compilación.

### Inferencia de tipos

No hace falta declarar el tipo de retorno cuando es obvio:

```ts
function suma(a: number, b: number) { return a + b }  // infiere number
```

En componentes React casi nadie escribe el tipo de retorno (siempre es JSX).

---

## 5. Tailwind CSS

Estilos como clases en el atributo `className`:

```tsx
<div className="max-w-xl mx-auto px-4 py-8 bg-white rounded-xl">
```

Estados especiales:
- `hover:` — al pasar el ratón
- `focus:` — al hacer focus
- `disabled:` — cuando está deshabilitado

```tsx
<input className="border-gray-200 focus:border-gray-400" />
```

### Clases dinámicas con template literals

```tsx
className={`px-4 py-1 ${active ? 'bg-gray-800 text-white' : 'bg-white text-gray-500'}`}
```

---

## 6. Prisma + PostgreSQL (Supabase)

### Setup

```bash
pnpm add prisma @prisma/client @prisma/adapter-pg pg
pnpm add -D ts-node @types/pg dotenv
pnpm prisma init
```

### Schema (`prisma/schema.prisma`)

```prisma
model Restaurant {
  id      Int     @id @default(autoincrement())
  name    String
  ticket  Boolean @default(false)
}
```

### Migraciones

```bash
pnpm prisma migrate dev --name init   # crea tabla en BD
pnpm prisma generate                   # regenera el cliente TypeScript
pnpm prisma db seed                    # ejecuta el seed
```

Una migración = un cambio de estructura en la BD. Quedan guardadas en `prisma/migrations/` con historial.

### Cliente Prisma compartido (`lib/prisma.ts`)

```ts
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

El truco de `globalThis` evita crear muchos clientes durante hot reload en desarrollo.

### Queries básicas

```ts
await prisma.restaurant.findMany({ where: { ... } });
await prisma.restaurant.findUnique({ where: { id: 1 } });
await prisma.restaurant.create({ data: { ... } });
await prisma.restaurant.delete({ where: { id: 1 } });
```

### Filtros dinámicos limpios

```ts
const where: Prisma.RestaurantWhereInput = {};

if (q) {
  where.OR = [
    { name: { contains: q, mode: 'insensitive' } },  // ILIKE en Postgres
    { barri: { contains: q, mode: 'insensitive' } },
  ];
}

if (card) where[card] = true;  // notación corchete porque card es variable

await prisma.restaurant.findMany({ where });
```

### Driver adapter (Prisma 7)

Prisma 7 ya no incluye motor propio — usa drivers nativos de Node (`pg` para Postgres) a través de un **adapter** (`@prisma/adapter-pg`). Por eso hay que pasar el adapter al `PrismaClient`.

---

## 7. JavaScript moderno usado

### Destructuring

```ts
const { id, name } = restaurant;
function fn({ value, onChange }: Props) { ... }
```

### Spread operator

```ts
const arr = [...otherArr, newItem];
const obj = { ...other, name: 'x' };
```

### Optional chaining + nullish coalescing

```ts
req.nextUrl.searchParams.get('q')?.toLowerCase() ?? ''
```

- `?.` — si es null/undefined no peta, devuelve undefined
- `??` — si la izquierda es null/undefined usa la derecha

### Template literals

```ts
`/api/restaurants/${id}`
`hola ${name}`
```

### Notación de propiedad dinámica

```ts
obj[variable] = true  // el nombre de la propiedad lo decide la variable
obj.fixed = true      // el nombre está fijo en el código
```

### Async/await vs `.then()`

Equivalentes, async/await es más legible:

```ts
// Con .then()
fetch('/api').then(r => r.json()).then(data => setX(data))

// Con async/await
const r = await fetch('/api');
const data = await r.json();
setX(data);
```

---

## 8. Deploy

### GitHub

```bash
gh auth login
gh repo create onmenjo --public --source=. --remote=origin --push
```

### Vercel

1. vercel.com → Add New Project → seleccionar repo
2. Detecta Next.js automáticamente
3. Añadir `DATABASE_URL` y `DIRECT_URL` en Environment Variables
4. Deploy

Cada `git push` a `main` redeploya automáticamente.

---

## 9. Comandos útiles

| Comando | Qué hace |
|---|---|
| `pnpm dev` | Servidor de desarrollo con hot reload |
| `pnpm build` | Build de producción |
| `pnpm prisma studio` | UI visual para ver/editar la BD |
| `pnpm prisma migrate dev --name X` | Nueva migración |
| `pnpm prisma generate` | Regenera el cliente TS |
| `pnpm prisma db seed` | Ejecuta seed |
| `gh repo create` | Crea repo de GitHub desde terminal |

---

## 10. Caché y rendimiento en Next.js

### `revalidate` en Server Components

```tsx
// app/page.tsx
export const revalidate = 60;  // segundos

export default async function Home() {
  const rows = await prisma.restaurant.findMany();
  return <RestaurantsExplorer initialRestaurants={rows.map(toRestaurant)} />;
}
```

**Cómo funciona**: Next.js cachea el HTML resultante. Las primeras visitas tras los 60s reciben HTML cacheado al instante; en background se regenera para la siguiente petición. Esto se llama **stale-while-revalidate**.

### Invalidación bajo demanda con `revalidatePath`

```tsx
// app/api/restaurants/route.ts
import { revalidatePath } from 'next/cache';

export async function POST(req) {
  await prisma.restaurant.create({ data: ... });
  revalidatePath('/');   // marca la home como stale, próximo render hace fetch fresco
  return Response.json(...);
}
```

Útil cuando una mutación deja el caché desactualizado.

### Patrón "Server shell + Client island"

Cuando una página necesita datos del servidor + interactividad:

- **Server Component (page.tsx)** — lee de BD/API, hace SEO-friendly y rápido
- **Client Component (Explorer)** — recibe los datos como props, gestiona la UI interactiva

```tsx
// app/page.tsx (Server)
export default async function Home() {
  const data = await prisma.restaurant.findMany();
  return <RestaurantsExplorer initialRestaurants={data} />;
}

// components/RestaurantsExplorer.tsx (Client)
'use client';
export default function RestaurantsExplorer({ initialRestaurants }) {
  const [query, setQuery] = useState('');
  // ...filtrado en memoria, modal, etc.
}
```

El HTML inicial llega ya pintado (sin "loading"); React hidrata después para activar la interactividad.

### Filtrado en cliente vs en servidor

Cuando el catálogo es pequeño (< 1000 registros), filtrar en cliente es **más rápido** que ir a la API:

- Sin latencia de red
- Sin coste de cómputo en el servidor
- Sin desgaste de conexiones a BD
- Búsqueda instantánea

Cuando el catálogo crece, se vuelve a paginar y filtrar en el servidor.

### `useMemo`

Recalcula un valor solo cuando cambian sus dependencias. Útil para filtros costosos:

```tsx
const results = useMemo(() => {
  return all.filter(r => r.name.includes(query));
}, [all, query]);
```

Sin `useMemo`, el filtro se ejecutaría en cada render aunque no haya cambiado nada.

### Custom hooks

Funciones que empiezan por `use` y combinan otros hooks. Permiten reutilizar lógica entre componentes:

```ts
// lib/useDebouncedEffect.ts
export function useDebouncedEffect(fn, deps, delay) {
  const isFirst = useRef(true);
  useEffect(() => {
    if (isFirst.current) { isFirst.current = false; fn(); return; }
    const t = setTimeout(fn, delay);
    return () => clearTimeout(t);
  }, deps);
}
```

### Índices en PostgreSQL desde Prisma

```prisma
model Restaurant {
  name  String
  barri String
  @@index([name])
  @@index([barri])
}
```

Acelera búsquedas en columnas que se filtran a menudo. Para `LIKE 'prefijo%'` los índices B-tree estándar funcionan; para `ILIKE '%texto%'` (búsqueda en mitad del string) se necesitan índices GIN con extensión `pg_trgm`.

### Region pinning en Vercel

```json
// vercel.json
{ "regions": ["dub1"] }
```

Despliega las funciones serverless cerca de la BD. Si Supabase está en `eu-west-1` (Ireland), Dublín minimiza la latencia.

---

## 11. Patrones generales aprendidos

- **Estado arriba, props abajo** — el estado vive donde se necesita lo más arriba posible
- **Componentes pequeños y reutilizables** — un componente = una responsabilidad
- **Fuente única de verdad** — los datos viven en un sitio (BD), todo lo demás es proyección
- **Server-first** — usa Server Components por defecto, Client solo cuando hace falta
- **Tipos estrictos** — TypeScript te avisa de errores antes de ejecutar
- **No subas nada generado a git** — solo el código fuente, lo demás se reconstruye
- **Caché con invalidación selectiva** — más rápido que regenerar todo en cada request
- **Filtra donde tenga sentido** — pequeñas listas en cliente, grandes en servidor con paginación
