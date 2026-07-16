import type { Seat } from "@/types";

interface SeatBlockCandidate {
  seatIds: string[];
  score: number;
}

// Single source of truth for the visual aisle gap rendered in SeatSelector
// (the gap sits before this column), so the suggestion algorithm never
// recommends a block that looks adjacent by column number but is split
// by the aisle on screen.
export const AISLE_BEFORE_COLUMN = 5;

function getRowDistance(row: string, rows: string[]): number {
  const rowIndex = rows.indexOf(row);
  const rowCenter = (rows.length - 1) / 2;

  return Math.abs(rowIndex - rowCenter);
}

function isConsecutiveBlock(seats: Seat[]): boolean {
  return seats.every((seat, index) => {
    if (index === 0) return true;

    const previousColumn = seats[index - 1].column;
    if (seat.column !== previousColumn + 1) return false;

    return seat.column !== AISLE_BEFORE_COLUMN;
  });
}

export function suggestBestSeats(
  seats: Seat[],
  rows: string[],
  count: number
): string[] {
  if (count <= 0) return [];

  const columns = seats.map((seat) => seat.column);
  const gridCenter = (Math.min(...columns) + Math.max(...columns)) / 2;
  const candidates: SeatBlockCandidate[] = [];

  for (const row of rows) {
    const availableSeats = seats
      .filter((seat) => seat.row === row && seat.status === "available")
      .sort((a, b) => a.column - b.column);

    for (let index = 0; index <= availableSeats.length - count; index++) {
      const block = availableSeats.slice(index, index + count);
      if (!isConsecutiveBlock(block)) continue;

      const firstColumn = block[0].column;
      const lastColumn = block[block.length - 1].column;
      const blockCenter = (firstColumn + lastColumn) / 2;
      const score = getRowDistance(row, rows) * 100 + Math.abs(blockCenter - gridCenter);

      candidates.push({
        seatIds: block.map((seat) => seat.id),
        score,
      });
    }
  }

  candidates.sort((a, b) => a.score - b.score);

  return candidates[0]?.seatIds ?? [];
}
