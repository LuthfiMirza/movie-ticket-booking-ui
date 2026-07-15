"use client";

import { useState } from "react";
import Link from "next/link";
import Modal from "@/components/Modal";
import { formatDateLabel, formatPrice } from "@/lib/format";
import type { Showtime } from "@/types";

interface BookingConfirmationProps {
  movieTitle: string;
  showtime: Showtime;
  seatIds: string[];
  total: number;
}

function generateBookingReference(): string {
  const stamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `CB-${stamp}-${random}`;
}

export default function BookingConfirmation({
  movieTitle,
  showtime,
  seatIds,
  total,
}: BookingConfirmationProps) {
  const [bookingReference, setBookingReference] = useState<string | null>(null);

  function handleConfirm() {
    setBookingReference(generateBookingReference());
  }

  return (
    <>
      <button
        type="button"
        onClick={handleConfirm}
        className="inline-flex w-full items-center justify-center rounded-md bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-500 sm:w-fit"
      >
        Confirm Booking
      </button>

      <Modal open={bookingReference !== null} onClose={() => setBookingReference(null)}>
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="rounded-full bg-green-600/15 px-3 py-1 text-xs font-medium uppercase tracking-widest text-green-500">
            Booking Confirmed
          </span>
          <p className="text-sm text-neutral-400">Your booking reference is</p>
          <p className="text-xl font-bold tracking-widest">{bookingReference}</p>

          <div className="mt-2 w-full rounded-md border border-neutral-800 bg-neutral-950 p-4 text-left text-sm">
            <p className="font-medium">{movieTitle}</p>
            <p className="mt-1 text-neutral-400">
              {formatDateLabel(showtime.date)} · {showtime.time} · {showtime.studio}
            </p>
            <p className="mt-1 text-neutral-400">Seats: {seatIds.join(", ")}</p>
            <p className="mt-2 font-semibold">{formatPrice(total)}</p>
          </div>

          <Link
            href="/"
            className="mt-4 inline-flex w-full items-center justify-center rounded-md bg-neutral-800 px-5 py-2.5 text-sm font-medium text-neutral-200 transition-colors hover:bg-neutral-700"
          >
            Back to Home
          </Link>
        </div>
      </Modal>
    </>
  );
}
