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
    <div className="overflow-hidden rounded-2xl border border-brand/15 bg-white/[0.04] shadow-xl shadow-black/40 backdrop-blur-xl">
      <div className="bg-gradient-to-r from-brand to-brand-light px-6 py-5 text-brand-ink">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-brand-ink/70">
          Booking Confirmed
        </p>
        <h2 className="mt-2 font-serif text-2xl font-semibold tracking-tight">E-Ticket</h2>
      </div>

      <div className="p-6">
        <div className="flex gap-4">
          <div className="relative h-32 w-24 shrink-0 overflow-hidden rounded-lg bg-white/[0.06]">
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
            <h3 className="font-serif text-xl font-semibold leading-tight text-neutral-50">{movie.title}</h3>
            <p className="mt-2 text-sm text-neutral-400">
              {formatDateLabel(showtime.date)} · {showtime.time}
            </p>
            <p className="mt-1 text-sm text-neutral-400">{showtime.studio}</p>
            <p className="mt-3 text-xs uppercase tracking-widest text-neutral-500">
              Reference
            </p>
            <p className="mt-1 break-all text-lg font-bold tracking-widest text-brand-light">
              {bookingReference}
            </p>
          </div>
        </div>

        <div className="my-6 border-t border-dashed border-white/15" />

        <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-neutral-400">Seats</span>
            <span className="font-semibold text-neutral-100">{seatIds.join(", ")}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-400">Tickets</span>
            <span className="font-semibold text-neutral-100">{seatIds.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-400">Subtotal</span>
            <span className="font-semibold text-neutral-100">{formatPrice(pricing.subtotal)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-400">Admin Fee</span>
            <span className="font-semibold text-neutral-100">{formatPrice(pricing.adminFee)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-400">Discount</span>
            <span className="font-semibold text-green-500">
              {pricing.discount > 0 ? `-${formatPrice(pricing.discount)}` : "—"}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-dashed border-white/15 pt-3">
            <span className="font-medium text-neutral-200">Total</span>
            <span className="text-lg font-bold text-brand-light">{formatPrice(pricing.total)}</span>
          </div>
        </div>

        <div className="my-6 border-t border-dashed border-white/15" />

        <div className="flex flex-col items-center justify-between gap-5 sm:flex-row">
          <div>
            <p className="text-sm font-medium text-neutral-100">Show this ticket at the cinema.</p>
            <p className="mt-1 text-sm text-neutral-400">
              Please arrive at least 15 minutes before showtime.
            </p>
          </div>

          <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-sm font-bold tracking-widest text-neutral-500">
            QR
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-white/[0.02] px-6 py-4">
        <Link
          href="/"
          className="inline-flex w-full items-center justify-center rounded-full bg-white/[0.06] px-5 py-2.5 text-sm font-medium text-neutral-200 transition-colors hover:bg-white/[0.1]"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
