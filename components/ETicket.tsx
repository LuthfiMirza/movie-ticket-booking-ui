"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import { formatDateLabel, formatPrice } from "@/lib/format";
import { calculateTotal } from "@/lib/pricing";
import { clearReservation } from "@/lib/reservation";
import type { Movie, Showtime } from "@/types";

interface ETicketProps {
  movie: Movie;
  showtime: Showtime;
  seatIds: string[];
  pricePerSeat: number;
  voucherCode?: string;
}

// Deterministic (not random) so the same booking always displays the same
// reference across refreshes/revisits — no storage needed as a source of truth.
function generateBookingReference(showtimeId: string, seatIds: string[]): string {
  const seed = `${showtimeId}:${seatIds.slice().sort().join(",")}`;
  let hash = 0;
  for (let index = 0; index < seed.length; index++) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }
  return `CB-${hash.toString(36).toUpperCase()}`;
}

export default function ETicket({
  movie,
  showtime,
  seatIds,
  pricePerSeat,
  voucherCode = "",
}: ETicketProps) {
  const bookingReference = useMemo(
    () => generateBookingReference(showtime.id, seatIds),
    [showtime.id, seatIds]
  );
  const pricing = useMemo(
    () => calculateTotal(seatIds.length, pricePerSeat, voucherCode),
    [pricePerSeat, seatIds.length, voucherCode]
  );

  useEffect(() => {
    clearReservation(showtime.id);
  }, [showtime.id]);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/60 bg-white/60 shadow-xl shadow-black/5 backdrop-blur-xl">
      <div className="bg-gradient-to-r from-brand to-brand-light px-6 py-5 text-white">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-white/80">
          Booking Confirmed
        </p>
        <h2 className="mt-2 font-serif text-2xl font-semibold tracking-tight">E-Ticket</h2>
      </div>

      <div className="p-6">
        <div className="flex gap-4">
          <div className="relative h-32 w-24 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
            <Image
              src={movie.posterUrl}
              alt={movie.title}
              fill
              unoptimized
              sizes="96px"
              className="object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="font-serif text-xl font-semibold leading-tight text-neutral-800">{movie.title}</h3>
            <p className="mt-2 text-sm text-neutral-500">
              {formatDateLabel(showtime.date)} · {showtime.time}
            </p>
            <p className="mt-1 text-sm text-neutral-500">{showtime.studio}</p>
            <p className="mt-3 text-xs uppercase tracking-widest text-neutral-400">
              Reference
            </p>
            <p className="mt-1 break-all text-lg font-bold tracking-widest text-brand-dark">
              {bookingReference}
            </p>
          </div>
        </div>

        <div className="my-6 border-t border-dashed border-neutral-300" />

        <div className="grid gap-4 text-sm sm:grid-cols-3">
          <div>
            <p className="text-neutral-500">Seats</p>
            <p className="mt-1 font-semibold text-neutral-800">{seatIds.join(", ")}</p>
          </div>
          <div>
            <p className="text-neutral-500">Tickets</p>
            <p className="mt-1 font-semibold text-neutral-800">{seatIds.length}</p>
          </div>
          <div>
            <p className="text-neutral-500">Total</p>
            <p className="mt-1 font-semibold text-neutral-800">{formatPrice(pricing.total)}</p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 rounded-xl border border-neutral-200 bg-white/60 p-4 text-sm sm:grid-cols-3">
          <div>
            <p className="text-neutral-500">Subtotal</p>
            <p className="mt-1 font-semibold text-neutral-800">{formatPrice(pricing.subtotal)}</p>
          </div>
          <div>
            <p className="text-neutral-500">Admin Fee</p>
            <p className="mt-1 font-semibold text-neutral-800">{formatPrice(pricing.adminFee)}</p>
          </div>
          <div>
            <p className="text-neutral-500">Discount</p>
            <p className="mt-1 font-semibold text-green-600">
              {pricing.discount > 0 ? `-${formatPrice(pricing.discount)}` : "—"}
            </p>
          </div>
        </div>

        <div className="my-6 border-t border-dashed border-neutral-300" />

        <div className="flex flex-col items-center justify-between gap-5 sm:flex-row">
          <div>
            <p className="text-sm font-medium text-neutral-800">Show this ticket at the cinema.</p>
            <p className="mt-1 text-sm text-neutral-500">
              Please arrive at least 15 minutes before showtime.
            </p>
          </div>

          <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-white text-sm font-bold tracking-widest text-neutral-400">
            QR
          </div>
        </div>
      </div>

      <div className="border-t border-white/60 bg-white/40 px-6 py-4">
        <Link
          href="/"
          className="inline-flex w-full items-center justify-center rounded-full bg-neutral-100 px-5 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-200"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
