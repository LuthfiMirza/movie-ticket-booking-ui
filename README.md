# CineBook — Movie Ticket Booking UI

A front-end movie ticket booking flow built with Next.js 14 (App Router), TypeScript, and Tailwind CSS. Portfolio piece — no backend, no auth, no real payments; the focus is a fully working, defensible React/Next.js UI: movie listing → showtime selection → interactive seat map → dummy payment → e-ticket confirmation.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Design process

Before implementation, low-fidelity wireframes were sketched for the two highest-complexity screens — the movie listing grid and the interactive seat map — to work out layout and state before writing component code:

- [docs/wireframes/movie-grid.svg](docs/wireframes/movie-grid.svg)
- [docs/wireframes/seat-map.svg](docs/wireframes/seat-map.svg)

## Component inventory

| Component | Props | Used in |
|---|---|---|
| `MovieCard` | `movie: Movie` | Home page (`app/page.tsx`) movie grid |
| `ShowtimeSelector` | `showtimes: Showtime[]` | Movie detail page (`app/movie/[id]/page.tsx`) |
| `SeatButton` | `seatId: string`, `status: SeatStatus`, `onClick: () => void` | `SeatSelector` (one per seat in the grid) |
| `SeatSelector` | `seats: Seat[]`, `rows: string[]`, `pricePerSeat: number`, `movieId: string`, `showtimeId: string` | Seats page (`app/movie/[id]/seats/page.tsx`) |
| `OrderSummary` | `movie: Movie`, `showtime: Showtime`, `seatIds: string[]`, `total: number` | Payment page (`app/movie/[id]/payment/page.tsx`) |
| `PaymentMethodSelector` | `ticketHref: string` | Payment page dummy method selection |
| `ETicket` | `movie: Movie`, `showtime: Showtime`, `seatIds: string[]`, `total: number` | E-ticket page (`app/movie/[id]/e-ticket/page.tsx`) |

Shared, non-visual modules:

- `lib/data.ts` — mock movies, showtimes, and seat maps, plus lookup helpers (`getMovieById`, `getShowtimesByMovie`, `getSeatMapByShowtime`).
- `lib/format.ts` — `formatDateLabel` and `formatPrice`, shared by `ShowtimeSelector`, the seats page, `OrderSummary`, and `ETicket` to keep date/currency formatting consistent.
- `types/` — `Movie`, `Showtime`, `Studio`, `Seat`, `SeatStatus`, `SeatMap`.

## Design decisions

**Local component state over Context/Redux.** The booking flow's state is either local to one screen (which seats are selected, which date tab is active, which dummy payment method is selected) or naturally expressed as URL state (`showtime` and `seats` query params carry the selection from the seats page to the payment and e-ticket pages). Nothing needs to be shared across distant parts of the tree at the same time, so a global store would add indirection without solving a real problem here. If a future step needed the in-progress booking to survive a refresh or be shared across unrelated routes, that would be the trigger to revisit this.

**Seat status derived at render time, not stored as selected.** The mock seat map only encodes ground truth: `available` or `booked`. `SeatSelector` holds the set of selected seat IDs in `useState` and computes the seat's *displayed* status (`selected` vs the mock data's status) on each render. This keeps the mock data a pure fixture and avoids two sources of truth for the same seat.

**Route-driven flow instead of a wizard component.** Each booking step is its own route (`/movie/[id]`, `/movie/[id]/seats`, `/movie/[id]/payment`, `/movie/[id]/e-ticket`) rather than one client component swapping steps internally. This makes each step deep-linkable and keeps data-fetching in server components close to where it's used, which is the idiomatic App Router pattern rather than a Blade/Livewire-style single-controller flow.

## Non-goals

No real payment integration, authentication, or backend/database — this is a front-end evidence piece, scoped to stay fully defensible under interview questioning.
