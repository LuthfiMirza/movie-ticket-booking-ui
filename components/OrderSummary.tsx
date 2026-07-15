"use client";

import { useMemo, useState } from "react";
import type { Movie, Showtime } from "@/types";
import { formatDateLabel, formatPrice } from "@/lib/format";
import {
  calculateTotal,
  getPricingSessionKey,
  isValidVoucher,
} from "@/lib/pricing";

interface OrderSummaryProps {
  movie: Movie;
  showtime: Showtime;
  seatIds: string[];
  pricePerSeat: number;
}

export default function OrderSummary({
  movie,
  showtime,
  seatIds,
  pricePerSeat,
}: OrderSummaryProps) {
  const [voucherInput, setVoucherInput] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState("");
  const [voucherMessage, setVoucherMessage] = useState<string | null>(null);
  const pricing = useMemo(
    () => calculateTotal(seatIds.length, pricePerSeat, appliedVoucher),
    [appliedVoucher, pricePerSeat, seatIds.length]
  );

  function handleApplyVoucher() {
    const normalizedVoucher = voucherInput.trim().toUpperCase();

    if (!normalizedVoucher) {
      setAppliedVoucher("");
      setVoucherMessage(null);
      window.sessionStorage.removeItem(getPricingSessionKey(showtime.id, seatIds));
      return;
    }

    if (!isValidVoucher(normalizedVoucher)) {
      setAppliedVoucher("");
      setVoucherMessage("Kode tidak valid");
      window.sessionStorage.removeItem(getPricingSessionKey(showtime.id, seatIds));
      return;
    }

    setAppliedVoucher(normalizedVoucher);
    setVoucherMessage(`${normalizedVoucher} applied`);
    window.sessionStorage.setItem(getPricingSessionKey(showtime.id, seatIds), normalizedVoucher);
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-neutral-800 bg-neutral-900 p-6">
      <div>
        <h2 className="text-lg font-semibold">{movie.title}</h2>
        <p className="mt-1 text-sm text-neutral-400">
          {formatDateLabel(showtime.date)} · {showtime.time} · {showtime.studio}
        </p>
      </div>

      <div className="flex items-center justify-between border-t border-neutral-800 pt-4 text-sm">
        <span className="text-neutral-400">Seats</span>
        <span className="font-medium">{seatIds.join(", ")}</span>
      </div>

      <div className="border-t border-neutral-800 pt-4">
        <label className="text-sm font-medium text-neutral-300" htmlFor="voucher-code">
          Voucher Code
        </label>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input
            id="voucher-code"
            value={voucherInput}
            onChange={(event) => setVoucherInput(event.target.value)}
            placeholder="CINEBOOK10"
            className="min-w-0 flex-1 rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 outline-none transition-colors placeholder:text-neutral-600 focus:border-red-600"
          />
          <button
            type="button"
            onClick={handleApplyVoucher}
            className="rounded-md bg-neutral-800 px-4 py-2 text-sm font-medium text-neutral-100 transition-colors hover:bg-neutral-700"
          >
            Apply
          </button>
        </div>
        {voucherMessage && (
          <p
            className={`mt-2 text-sm ${
              appliedVoucher ? "text-green-500" : "text-red-500"
            }`}
          >
            {voucherMessage}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3 border-t border-neutral-800 pt-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-neutral-400">Subtotal</span>
          <span className="font-medium">{formatPrice(pricing.subtotal)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-neutral-400">Admin Fee</span>
          <span className="font-medium">{formatPrice(pricing.adminFee)}</span>
        </div>
        {pricing.discount > 0 && (
          <div className="flex items-center justify-between text-green-500">
            <span>Discount</span>
            <span className="font-medium">-{formatPrice(pricing.discount)}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-neutral-800 pt-4">
        <span className="text-neutral-400">Total</span>
        <span className="text-lg font-semibold">{formatPrice(pricing.total)}</span>
      </div>
    </div>
  );
}
