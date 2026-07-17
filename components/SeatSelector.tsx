"use client";

import { useState } from "react";
import Link from "next/link";
import type { Seat } from "@/types";
import { formatPrice } from "@/lib/format";
import { startReservation } from "@/lib/reservation";
import { AISLE_BEFORE_COLUMN, suggestBestSeats } from "@/lib/seat-suggestion";
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
  const [autoPickCount, setAutoPickCount] = useState(2);
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
      startReservation(showtimeId);
      return [...current, seat.id];
    });
  }

  function handleAutoPick() {
    const nextSeatIds = suggestBestSeats(seats, rows, autoPickCount);

    if (nextSeatIds.length === 0) {
      setValidationMessage("No adjacent seats available for that amount.");
      return;
    }

    setValidationMessage(null);
    startReservation(showtimeId);
    setSelectedSeatIds(nextSeatIds);
  }

  const total = selectedSeatIds.length * pricePerSeat;
  const seatsByRow = rows.map((row) =>
    seats.filter((seat) => seat.row === row).sort((a, b) => a.column - b.column)
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-4">
        <div className="flex w-2/3 max-w-sm flex-col items-center gap-1">
          <div
            className="h-8 w-full rounded-b-full"
            style={{
              background:
                "radial-gradient(ellipse at 50% -60%, rgba(231,205,147,0.5), rgba(231,205,147,0.05) 70%)",
              boxShadow: "0 -8px 24px -6px rgba(198,161,91,0.35)",
            }}
          />
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-neutral-500">
            Screen
          </span>
        </div>
        <div className="flex w-full flex-col gap-3 rounded-2xl border border-brand/15 bg-white/[0.04] p-4 backdrop-blur-xl sm:flex-row sm:items-end sm:justify-between">
          <label className="flex flex-col gap-1 text-sm font-medium text-neutral-300">
            Auto-pick seat count
            <input
              type="number"
              min={1}
              max={MAX_SEATS}
              step={1}
              value={autoPickCount}
              onChange={(event) => {
                const value = Math.round(Number(event.target.value));
                setAutoPickCount(Math.min(Math.max(value, 1), MAX_SEATS));
              }}
              className="w-24 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-neutral-100 outline-none transition-colors focus:border-brand"
            />
          </label>
          <button
            type="button"
            onClick={handleAutoPick}
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-brand-light to-brand px-4 py-2 text-sm font-semibold text-brand-ink transition-opacity hover:opacity-90"
          >
            Auto-Pick
          </button>
        </div>
        <p className="text-xs text-neutral-500 sm:hidden">
          Swipe sideways to see all seats →
        </p>
        <div className="w-full overflow-x-auto pb-2">
          <div className="mx-auto flex w-max flex-col gap-1.5">
          {seatsByRow.map((rowSeats, index) => (
            <div key={rows[index]} className="flex items-center gap-1.5">
              <span className="w-4 text-xs text-neutral-400">{rows[index]}</span>
              <div className="flex gap-1.5">
                {rowSeats.map((seat) => {
                  const status = selectedSeatIds.includes(seat.id)
                    ? "selected"
                    : seat.status;
                  return (
                    <div key={seat.id} className={seat.column === AISLE_BEFORE_COLUMN ? "ml-3" : ""}>
                      <SeatButton
                        seatId={seat.id}
                        status={status}
                        onClick={() => toggleSeat(seat)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-neutral-400">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded border border-white/15 bg-white/[0.04]" />
          Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded border border-transparent bg-gradient-to-br from-brand-light to-brand" />
          Selected
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded border border-white/5 bg-white/[0.02]" />
          Booked
        </span>
      </div>

      {validationMessage && (
        <p className="text-center text-sm text-red-500">{validationMessage}</p>
      )}

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-brand/15 bg-white/[0.04] px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-4px_24px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:px-6">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <div>
            <p aria-live="polite" className="text-sm text-neutral-400">
              {selectedSeatIds.length} seat{selectedSeatIds.length === 1 ? "" : "s"}{" "}
              selected
            </p>
            <p className="text-lg font-semibold text-neutral-50">{formatPrice(total)}</p>
          </div>
          <Link
            href={
              selectedSeatIds.length > 0
                ? `/movie/${movieId}/payment?showtime=${showtimeId}&seats=${selectedSeatIds.join(",")}`
                : "#"
            }
            aria-disabled={selectedSeatIds.length === 0}
            className={`inline-flex w-full items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition-opacity sm:w-fit ${
              selectedSeatIds.length > 0
                ? "bg-gradient-to-br from-brand-light to-brand text-brand-ink hover:opacity-90"
                : "pointer-events-none bg-white/[0.05] text-neutral-600"
            }`}
          >
            Continue to Payment
          </Link>
        </div>
      </div>
    </div>
  );
}
