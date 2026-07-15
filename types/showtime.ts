export type Studio = "Studio 1" | "Studio 2" | "Studio 3" | "IMAX" | "Premiere";

export interface Showtime {
  id: string;
  movieId: string;
  cinemaId: string;
  date: string;
  time: string;
  studio: Studio;
  price: number;
}
