"use client";

import { useMemo, useState } from "react";
import type { Movie, Showtime } from "@/types";
import { formatDateLabel, formatPrice } from "@/lib/format";
import { calculateTotal, isValidVoucher } from "@/lib/pricing";

interface OrderSummaryProps {
  movie: Movie;
  showtime: Showtime;
  seatIds: string[];
  pricePerSeat: number;
  onVoucherApplied?: (voucherCode: string) => void;
}

export default function OrderSummary({
  movie,
  showtime,
  seatIds,
  pricePerSeat,
  onVoucherApplied,
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
      onVoucherApplied?.("");
      return;
    }

    if (!isValidVoucher(normalizedVoucher)) {
      setAppliedVoucher("");
      setVoucherMessage("Kode tidak valid");
      onVoucherApplied?.("");
      return;
    }

    setAppliedVoucher(normalizedVoucher);
    setVoucherMessage(`${normalizedVoucher} applied`);
    onVoucherApplied?.(normalizedVoucher);
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-brand/15 bg-white/[0.04] p-6 backdrop-blur-xl">
      <div>
        <h2 className="font-serif text-lg font-semibold text-neutral-50">{movie.title}</h2>
        <p className="mt-1 text-sm text-neutral-400">
          {formatDateLabel(showtime.date)} · {showtime.time} · {showtime.studio}
        </p>
      </div>

      <div className="flex items-center justify-between border-t border-white/10 pt-4 text-sm">
        <span className="text-neutral-400">Seats</span>
        <span className="font-medium text-neutral-100">{seatIds.join(", ")}</span>
      </div>

      <div className="border-t border-white/10 pt-4">
        <label className="text-sm font-medium text-neutral-300" htmlFor="voucher-code">
          Voucher Code
        </label>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input
            id="voucher-code"
            value={voucherInput}
            onChange={(event) => setVoucherInput(event.target.value)}
            placeholder="CINEBOOK10"
            className="min-w-0 flex-1 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-neutral-100 outline-none transition-colors placeholder:text-neutral-500 focus:border-brand"
          />
          <button
            type="button"
            onClick={handleApplyVoucher}
            className="rounded-full bg-gradient-to-br from-brand-light to-brand px-4 py-2 text-sm font-semibold text-brand-ink transition-opacity hover:opacity-90"
          >
            Apply
          </button>
        </div>
        {voucherMessage && (
          <p
            className={`mt-2 text-sm ${
              appliedVoucher ? "text-green-500" : "text-red-400"
            }`}
          >
            {voucherMessage}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3 border-t border-white/10 pt-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-neutral-400">Subtotal</span>
          <span className="font-medium text-neutral-100">{formatPrice(pricing.subtotal)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-neutral-400">Admin Fee</span>
          <span className="font-medium text-neutral-100">{formatPrice(pricing.adminFee)}</span>
        </div>
        {pricing.discount > 0 && (
          <div className="flex items-center justify-between text-green-500">
            <span>Discount</span>
            <span className="font-medium">-{formatPrice(pricing.discount)}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-white/10 pt-4">
        <span className="text-neutral-400">Total</span>
        <span className="text-lg font-semibold text-brand-light">{formatPrice(pricing.total)}</span>
      </div>
    </div>
  );
}
