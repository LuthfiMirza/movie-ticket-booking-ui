"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { formatDateLabel, formatPrice } from "@/lib/format";
import { calculateTotal, getPricingSessionKey } from "@/lib/pricing";
import { clearReservation } from "@/lib/reservation";
import type { Movie, Showtime } from "@/types";

interface ETicketProps {
  movie: Movie;
  showtime: Showtime;
  seatIds: string[];
  pricePerSeat: number;
}

function generateBookingReference(): string {
  const stamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `CB-${stamp}-${random}`;
}

export default function ETicket({
  movie,
  showtime,
  seatIds,
  pricePerSeat,
}: ETicketProps) {
  const [bookingReference] = useState(() => generateBookingReference());
  const [voucherCode, setVoucherCode] = useState("");
  const pricing = useMemo(
    () => calculateTotal(seatIds.length, pricePerSeat, voucherCode),
    [pricePerSeat, seatIds.length, voucherCode]
  );

  useEffect(() => {
    const storedVoucher = window.sessionStorage.getItem(
      getPricingSessionKey(showtime.id, seatIds)
    );

    if (storedVoucher) {
      setVoucherCode(storedVoucher);
    }

    clearReservation(showtime.id);
  }, [seatIds, showtime.id]);

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl shadow-black/20">
      <div className="bg-gradient-to-r from-red-600 to-red-500 px-6 py-5 text-white">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-red-100">
          Booking Confirmed
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight">E-Ticket</h2>
      </div>

      <div className="p-6">
        <div className="flex gap-4">
          <div className="relative h-32 w-24 shrink-0 overflow-hidden rounded-lg bg-neutral-800">
            <Image
              src={movie.posterUrl}
              alt={movie.title}
              fill
              sizes="96px"
              className="object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-xl font-semibold leading-tight">{movie.title}</h3>
            <p className="mt-2 text-sm text-neutral-400">
              {formatDateLabel(showtime.date)} · {showtime.time}
            </p>
            <p className="mt-1 text-sm text-neutral-400">{showtime.studio}</p>
            <p className="mt-3 text-xs uppercase tracking-widest text-neutral-500">
              Reference
            </p>
            <p className="mt-1 break-all text-lg font-bold tracking-widest text-red-500">
              {bookingReference}
            </p>
          </div>
        </div>

        <div className="my-6 border-t border-dashed border-neutral-700" />

        <div className="grid gap-4 text-sm sm:grid-cols-3">
          <div>
            <p className="text-neutral-500">Seats</p>
            <p className="mt-1 font-semibold">{seatIds.join(", ")}</p>
          </div>
          <div>
            <p className="text-neutral-500">Tickets</p>
            <p className="mt-1 font-semibold">{seatIds.length}</p>
          </div>
          <div>
            <p className="text-neutral-500">Total</p>
            <p className="mt-1 font-semibold">{formatPrice(pricing.total)}</p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 rounded-lg border border-neutral-800 bg-neutral-950 p-4 text-sm sm:grid-cols-3">
          <div>
            <p className="text-neutral-500">Subtotal</p>
            <p className="mt-1 font-semibold">{formatPrice(pricing.subtotal)}</p>
          </div>
          <div>
            <p className="text-neutral-500">Admin Fee</p>
            <p className="mt-1 font-semibold">{formatPrice(pricing.adminFee)}</p>
          </div>
          <div>
            <p className="text-neutral-500">Discount</p>
            <p className="mt-1 font-semibold text-green-500">
              {pricing.discount > 0 ? `-${formatPrice(pricing.discount)}` : "—"}
            </p>
          </div>
        </div>

        <div className="my-6 border-t border-dashed border-neutral-700" />

        <div className="flex flex-col items-center justify-between gap-5 sm:flex-row">
          <div>
            <p className="text-sm font-medium">Show this ticket at the cinema.</p>
            <p className="mt-1 text-sm text-neutral-500">
              Please arrive at least 15 minutes before showtime.
            </p>
          </div>

          <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-lg border border-neutral-700 bg-neutral-950 text-sm font-bold tracking-widest text-neutral-500">
            QR
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-800 bg-neutral-950 px-6 py-4">
        <Link
          href="/"
          className="inline-flex w-full items-center justify-center rounded-md bg-neutral-800 px-5 py-2.5 text-sm font-medium text-neutral-200 transition-colors hover:bg-neutral-700"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
