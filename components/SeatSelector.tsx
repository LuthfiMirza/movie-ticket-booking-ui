"use client";

import { useState } from "react";
import Link from "next/link";
import type { Seat } from "@/types";
import { formatPrice } from "@/lib/format";
import SeatButton from "@/components/SeatButton";

interface SeatSelectorProps {
  seats: Seat[];
  rows: string[];
  pricePerSeat: number;
  movieId: string;
  showtimeId: string;
}

const MAX_SEATS = 6;

export default function SeatSelector({
  seats,
  rows,
  pricePerSeat,
  movieId,
  showtimeId,
}: SeatSelectorProps) {
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  function toggleSeat(seat: Seat) {
    if (seat.status === "booked") return;

    setValidationMessage(null);
    setSelectedSeatIds((current) => {
      if (current.includes(seat.id)) {
        return current.filter((id) => id !== seat.id);
      }
      if (current.length >= MAX_SEATS) {
        setValidationMessage(`You can select up to ${MAX_SEATS} seats.`);
        return current;
      }
      return [...current, seat.id];
    });
  }

  const total = selectedSeatIds.length * pricePerSeat;
  const seatsByRow = rows.map((row) =>
    seats.filter((seat) => seat.row === row).sort((a, b) => a.column - b.column)
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-4">
        <div className="mb-2 h-1.5 w-2/3 max-w-sm rounded-full bg-neutral-800" />
        <div className="flex flex-col gap-1.5">
          {seatsByRow.map((rowSeats, index) => (
            <div key={rows[index]} className="flex items-center gap-1.5">
              <span className="w-4 text-xs text-neutral-500">{rows[index]}</span>
              <div className="flex gap-1.5">
                {rowSeats.map((seat) => {
                  const status = selectedSeatIds.includes(seat.id)
                    ? "selected"
                    : seat.status;
                  return (
                    <SeatButton
                      key={seat.id}
                      seatId={seat.id}
                      status={status}
                      onClick={() => toggleSeat(seat)}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-neutral-400">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded border border-neutral-700 bg-neutral-900" />
          Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded border border-red-600 bg-red-600" />
          Selected
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded border border-neutral-800 bg-neutral-950" />
          Booked
        </span>
      </div>

      {validationMessage && (
        <p className="text-center text-sm text-red-500">{validationMessage}</p>
      )}

      <div className="flex flex-col items-center gap-3 border-t border-neutral-800 pt-6 sm:flex-row sm:justify-between">
        <div>
          <p className="text-sm text-neutral-400">
            {selectedSeatIds.length} seat{selectedSeatIds.length === 1 ? "" : "s"}{" "}
            selected
          </p>
          <p className="text-lg font-semibold">{formatPrice(total)}</p>
        </div>
        <Link
          href={
            selectedSeatIds.length > 0
              ? `/movie/${movieId}/payment?showtime=${showtimeId}&seats=${selectedSeatIds.join(",")}`
              : "#"
          }
          aria-disabled={selectedSeatIds.length === 0}
          className={`inline-flex w-full items-center justify-center rounded-md px-5 py-2.5 text-sm font-medium transition-colors sm:w-fit ${
            selectedSeatIds.length > 0
              ? "bg-red-600 text-white hover:bg-red-500"
              : "pointer-events-none bg-neutral-800 text-neutral-500"
          }`}
        >
          Continue to Payment
        </Link>
      </div>
    </div>
  );
}
