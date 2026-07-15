import type { Movie, Showtime, Seat, SeatMap } from "@/types";

export const movies: Movie[] = [
  {
    id: "m1",
    title: "Nebula Drift",
    posterUrl: "https://placehold.co/300x450/1a1a2e/fff.png?text=Nebula+Drift",
    genres: ["Sci-Fi", "Adventure"],
    durationMinutes: 128,
    synopsis:
      "A salvage crew stranded at the edge of known space must outrun a collapsing star.",
    rating: "PG-13",
  },
  {
    id: "m2",
    title: "The Last Ember",
    posterUrl: "https://placehold.co/300x450/2e1a1a/fff.png?text=The+Last+Ember",
    genres: ["Drama", "War"],
    durationMinutes: 141,
    synopsis:
      "Two estranged brothers reunite on the front line of a war neither of them chose.",
    rating: "R",
  },
  {
    id: "m3",
    title: "Paper Tigers",
    posterUrl: "https://placehold.co/300x450/1a2e1a/fff.png?text=Paper+Tigers",
    genres: ["Comedy"],
    durationMinutes: 102,
    synopsis:
      "A washed-up boy band reunites for one last show, whether the city wants it or not.",
    rating: "PG",
  },
  {
    id: "m4",
    title: "Glass Horizon",
    posterUrl: "https://placehold.co/300x450/2e2a1a/fff.png?text=Glass+Horizon",
    genres: ["Thriller", "Mystery"],
    durationMinutes: 115,
    synopsis:
      "A detective's last case unravels a conspiracy hiding in plain sight.",
    rating: "PG-13",
  },
  {
    id: "m5",
    title: "Midnight Orchard",
    posterUrl: "https://placehold.co/300x450/241a2e/fff.png?text=Midnight+Orchard",
    genres: ["Horror"],
    durationMinutes: 97,
    synopsis:
      "A family inherits an orchard that only blooms after dark, for reasons best left buried.",
    rating: "R",
  },
  {
    id: "m6",
    title: "Coral & Compass",
    posterUrl: "https://placehold.co/300x450/1a2e2a/fff.png?text=Coral+%26+Compass",
    genres: ["Animation", "Family"],
    durationMinutes: 94,
    synopsis:
      "A young cartographer maps a reef that keeps redrawing itself overnight.",
    rating: "G",
  },
];

export const showtimes: Showtime[] = [
  { id: "s1", movieId: "m1", date: "2026-07-16", time: "13:00", studio: "Studio 1", price: 45000 },
  { id: "s2", movieId: "m1", date: "2026-07-16", time: "16:30", studio: "IMAX", price: 75000 },
  { id: "s3", movieId: "m1", date: "2026-07-17", time: "19:45", studio: "Studio 2", price: 45000 },
  { id: "s4", movieId: "m2", date: "2026-07-16", time: "14:15", studio: "Studio 3", price: 45000 },
  { id: "s5", movieId: "m2", date: "2026-07-17", time: "20:00", studio: "Premiere", price: 90000 },
  { id: "s6", movieId: "m3", date: "2026-07-16", time: "11:30", studio: "Studio 2", price: 40000 },
  { id: "s7", movieId: "m3", date: "2026-07-17", time: "17:00", studio: "Studio 1", price: 40000 },
  { id: "s8", movieId: "m4", date: "2026-07-16", time: "18:30", studio: "Studio 3", price: 45000 },
  { id: "s9", movieId: "m5", date: "2026-07-16", time: "21:15", studio: "Studio 1", price: 45000 },
  { id: "s10", movieId: "m5", date: "2026-07-17", time: "22:00", studio: "IMAX", price: 75000 },
  { id: "s11", movieId: "m6", date: "2026-07-16", time: "10:00", studio: "Studio 2", price: 40000 },
  { id: "s12", movieId: "m6", date: "2026-07-17", time: "13:30", studio: "Studio 2", price: 40000 },
];

const SEAT_ROWS = ["A", "B", "C", "D", "E", "F"];
const SEATS_PER_ROW = 8;

function createSeatMap(showtimeId: string, bookedSeatIds: string[]): SeatMap {
  const seats: Seat[] = [];

  for (const row of SEAT_ROWS) {
    for (let column = 1; column <= SEATS_PER_ROW; column++) {
      const id = `${row}${column}`;
      seats.push({
        id,
        row,
        column,
        status: bookedSeatIds.includes(id) ? "booked" : "available",
      });
    }
  }

  return {
    showtimeId,
    rows: SEAT_ROWS,
    columns: SEATS_PER_ROW,
    seats,
  };
}

export const seatMaps: SeatMap[] = [
  createSeatMap("s1", ["A1", "A2", "C4", "C5", "F8"]),
  createSeatMap("s2", ["B3", "B4", "B5", "D6", "D7", "E1"]),
  createSeatMap("s3", ["A1", "F1", "F2", "F3"]),
  createSeatMap("s4", ["C1", "C2", "C3", "C4", "D1", "D2"]),
  createSeatMap("s5", ["A4", "A5", "B4", "B5"]),
  createSeatMap("s6", []),
  createSeatMap("s7", ["E5", "E6", "E7", "E8"]),
  createSeatMap("s8", ["A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8"]),
  createSeatMap("s9", ["D4", "D5"]),
  createSeatMap("s10", ["B1", "B2", "C1", "C2", "F7", "F8"]),
  createSeatMap("s11", []),
  createSeatMap("s12", ["A8", "B8", "C8"]),
];

export function getMovieById(id: string): Movie | undefined {
  return movies.find((movie) => movie.id === id);
}

export function getShowtimesByMovie(movieId: string): Showtime[] {
  return showtimes.filter((showtime) => showtime.movieId === movieId);
}

export function getSeatMapByShowtime(showtimeId: string): SeatMap | undefined {
  return seatMaps.find((seatMap) => seatMap.showtimeId === showtimeId);
}
