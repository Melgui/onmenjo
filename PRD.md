# OnMenjo — Product Requirements Document

> Documento de producto para alinear visión, alcance y roadmap del proyecto.

---

## 1. Resumen ejecutivo

**OnMenjo** es una web ligera para descubrir qué restaurantes aceptan tarjetas restaurante (Ticket Restaurant, Sodexo, Coverflex, Pluxee) en Barcelona.

El usuario puede buscar por nombre o barrio, filtrar por la tarjeta que tiene en el bolsillo, ver los detalles de cada local y contribuir añadiendo restaurantes que faltan.

**URL en producción**: https://onmenjo.vercel.app

---

## 2. Problema y oportunidad

Cada vez más empresas pagan parte del salario en tarjeta restaurante, pero **descubrir si tu restaurante de confianza acepta tu tarjeta concreta es frustrante**:

- La info no está en Google Maps ni en TripAdvisor
- Las webs oficiales de las tarjetas tienen buscadores anticuados y muchas veces desactualizados
- Llamar al restaurante o preguntar al camarero antes de pedir la cuenta es incómodo
- Si te equivocas de tarjeta, tienes que pagar de tu bolsillo

OnMenjo aspira a ser **la fuente de verdad colaborativa** sobre qué tarjetas acepta cada local en BCN, mantenida por la comunidad.

---

## 3. Usuarios objetivo

**Persona principal**: empleado/a de oficina en Barcelona con una tarjeta restaurante mensual de 100-220€.

- Come fuera 3-5 veces por semana
- Tiene una sola tarjeta (la que da su empresa)
- Quiere maximizar el uso del saldo antes de fin de mes
- Suele consultar desde el móvil durante la pausa de comer

**Persona secundaria**: empleado/a de hostelería que quiere visibilizar que su local acepta una o varias tarjetas para captar más clientes.

---

## 4. Features actuales (v1)

| Feature | Descripción | Estado |
|---|---|---|
| **Listado de restaurantes** | Página principal con tarjetas mostrando nombre, barrio, tipo, dirección y badges de qué tarjetas acepta | ✅ |
| **Búsqueda con debounce** | Input que filtra en cliente por nombre o barrio (case-insensitive). Sin debounce en la primera carga | ✅ |
| **Filtros por tarjeta** | Chips clicables — "Totes" o una de las 4 tarjetas. Compatible con la búsqueda | ✅ |
| **Página de detalle** | Vista individual de cada restaurante en `/restaurants/[id]`, server-rendered con caché | ✅ |
| **Crear restaurante** | Modal con formulario que escribe en BD. Sin auth todavía — cualquiera puede añadir | ✅ |
| **Eliminar restaurante** | Botón en la página de detalle con modal de confirmación | ✅ |
| **Diseño responsivo** | Tailwind + estado de focus/hover/active. Modo claro forzado | ✅ |

### Lo que NO hace v1 (decisiones intencionales)

- ❌ **Sin autenticación** — cualquier persona puede crear/borrar (riesgo asumido en aprendizaje)
- ❌ **Sin moderación** — los datos los aporta la comunidad sin validación
- ❌ **Sin sistema de votos** — un usuario puede contradecir lo que dice otro sin trazabilidad
- ❌ **Solo Barcelona** — los datos seed son barrios de BCN; no hay restricción técnica pero no se ha probado fuera

---

## 5. Arquitectura técnica

```
┌──────────────────┐     ┌───────────────────┐     ┌─────────────────┐
│   Navegador      │     │  Vercel (dub1)    │     │  Supabase       │
│   (cliente)      │     │  Next.js 16       │     │  (eu-west-1)    │
│                  │     │                   │     │                 │
│  • SearchBar     │ ←→  │  Server Component │ ←→  │  PostgreSQL     │
│  • FilterChips   │     │  + API Routes     │     │  + PgBouncer    │
│  • Modals        │     │                   │     │                 │
└──────────────────┘     └───────────────────┘     └─────────────────┘
                                  │
                                  └─ Prisma 7 (adapter-pg + pg)
```

### Flujo de datos

**Lectura (página principal)**
```
Usuario abre / → Vercel sirve HTML cacheado (revalidate 60s)
                 ↓ (cada 60s)
                 Server Component → Prisma → Supabase → render → cache
```

**Mutaciones (crear/borrar)**
```
Modal/Botón → POST/DELETE /api/restaurants → Prisma → Supabase
                                          → revalidatePath('/') invalida caché
```

### Estructura de carpetas

```
onmenjo/
├── app/
│   ├── page.tsx                    Server Component, lee de Prisma
│   ├── layout.tsx                  Layout global con header/footer
│   ├── globals.css                 Tailwind + reset
│   ├── restaurants/[id]/page.tsx   Detalle (Server Component)
│   └── api/restaurants/
│       ├── route.ts                GET (lista) + POST (crear)
│       └── [id]/route.ts           DELETE (borrar)
├── components/
│   ├── RestaurantsExplorer.tsx     Client — search + filters + add modal
│   ├── SearchBar.tsx               Input controlado
│   ├── FilterChips.tsx             Chips de tarjetas
│   ├── RestaurantCard.tsx          Card de restaurante
│   ├── AddRestaurantModal.tsx      Formulario en modal
│   ├── DeleteButton.tsx            Botón con confirmación
│   └── ConfirmModal.tsx            Modal genérico de confirmación
├── lib/
│   ├── data.ts                     Tipos (Card, Restaurant) + CARD_LABELS
│   ├── prisma.ts                   Cliente Prisma compartido (singleton)
│   ├── restaurant.ts               toRestaurant() — transform DB → API
│   └── useDebouncedEffect.ts       Custom hook reutilizable
├── prisma/
│   ├── schema.prisma               Modelo Restaurant + índices
│   ├── migrations/                 Historial versionado
│   └── seed.ts                     Datos iniciales
├── vercel.json                     Region pinning a Dublín
└── PLAN.md, LEARNINGS.md, PRD.md
```

---

## 6. Stack y decisiones

| Capa | Tecnología | Por qué |
|---|---|---|
| Framework | Next.js 16 App Router | Server Components + caché nativo + API routes en un mismo proyecto |
| Lenguaje | TypeScript | Tipado estricto, autocompletado con Prisma generado |
| UI | Tailwind CSS v4 | Estilos sin escribir CSS, estados (hover/focus) sin JS |
| ORM | Prisma 7 | Schema declarativo + tipos autogenerados + migraciones versionadas |
| Driver BD | `pg` + `@prisma/adapter-pg` | Driver nativo de Postgres requerido por Prisma 7 |
| BD | Supabase (PostgreSQL) | Postgres gestionado, capa de auth disponible para fase 2, panel visual |
| Hosting | Vercel | Despliegue automático desde GitHub, soporte first-class de Next.js |
| Package manager | pnpm | Más rápido y eficiente en disco que npm |

### Decisiones de diseño relevantes

- **App Router > Pages Router** — Server Components y `revalidate` reducen JS enviado al cliente
- **Filtrado en cliente para listas pequeñas** — el catálogo cabe en memoria del navegador, búsqueda instantánea sin API calls
- **Columnas booleanas planas en BD** (no tabla `Card` separada) — para 4 tarjetas fijas, una tabla pivote sería over-engineering
- **`revalidate` + `revalidatePath`** en lugar de SSG puro — la home cambia cuando alguien añade/borra, así que se necesita invalidación bajo demanda
- **Driver adapter (`@prisma/adapter-pg`)** — obligatorio en Prisma 7, además compatible con runtimes serverless

---

## 7. Métricas de éxito

| Métrica | Hoy (estimado) | Objetivo |
|---|---|---|
| **Tiempo a primer pintado de la lista** (cold start prod) | ~2-3 s | < 1 s |
| **LCP (Largest Contentful Paint)** | No medido | < 2.5 s |
| **Latencia búsqueda/filtro** | ~300 ms (debounce) | < 50 ms (filtrado en cliente) |
| **Nº de restaurantes en BD** | 10 (seed) | 200+ (objetivo a 6 meses) |
| **% restaurantes verificados** (futuro) | — | 70%+ con auth + votos |

---

## 8. Roadmap futuro

### Fase 2 — Crowdsourcing real
- **Auth con Supabase Auth** — login con email/Google
- **Asociar restaurantes al usuario que los crea** — auditoría
- **Sistema de votos por tarjeta** — cada usuario puede confirmar/desmentir si una tarjeta funciona
- **Estados** "verificado por X usuarios" / "reportado como erróneo"
- **Moderación**: solo el creador o admins pueden borrar

### Fase 3 — Geolocalización
- **Coordenadas** (lat/lng) en cada restaurante
- **Vista mapa** con clustering (Mapbox o Maplibre)
- **"Cerca de mí"** usando geolocation del navegador
- **Búsqueda por radio**

### Fase 4 — Expansión
- **Más ciudades** — Madrid, Valencia, Bilbao
- **Más tarjetas** — Edenred, Up Spain, etc.
- **Internacionalización** del UI (cat / es / en)
- **App nativa** (PWA primero, luego React Native si tiene tracción)

### Mejoras técnicas pendientes
- Loading skeleton en vez de "Buscant..." (low-effort, mejor UX percibida)
- Estados de error explícitos (qué pasa si la API falla)
- Página 404 personalizada
- Tests con Vitest (unitarios) + Playwright (e2e)
- Lighthouse CI en cada PR
- Sentry o similar para error tracking en producción
- Rate limiting en POST/DELETE (cuando haya auth)

---

## 9. Limitaciones conocidas

- **Sin auth** → hoy cualquiera puede borrar todos los restaurantes desde la web. Se asume que el riesgo es aceptable durante el aprendizaje y mientras el catálogo es pequeño.
- **Datos no verificados** → un usuario malintencionado podría crear restaurantes inventados. Se compensa con `Date.now()` como id antes pero ahora autoincrement.
- **Plan free de Supabase** → 500 MB de BD y 1 GB de transferencia/mes. Suficiente para arrancar; hay que monitorizar.
- **Plan free de Vercel** → 100 GB de bandwidth. Suficiente para escala personal.
- **Una sola región de Vercel (dub1)** → si el público objetivo se expande fuera de Europa, hay que multi-region.

---

## 10. Glosario

- **Tarjeta restaurante** — tarjeta prepago que algunas empresas dan a empleados como complemento salarial exento de IRPF para gastos en restauración
- **Server Component** — componente Next.js que se ejecuta en el servidor y devuelve HTML, sin enviar JS al cliente
- **Client Component** — componente que se ejecuta en el navegador, puede tener estado, eventos y efectos
- **Revalidate** — mecanismo de Next.js para regenerar HTML cacheado en background tras un tiempo
- **Cold start** — primera ejecución de una función serverless tras un periodo inactivo, lenta porque hay que arrancar el contenedor
