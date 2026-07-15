export type SeatStatus = "available" | "booked" | "selected";

export interface Seat {
  id: string;
  row: string;
  column: number;
  status: SeatStatus;
}

export interface SeatMap {
  showtimeId: string;
  rows: string[];
  columns: number;
  seats: Seat[];
}
