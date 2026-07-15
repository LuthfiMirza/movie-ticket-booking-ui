import type { Movie, Showtime } from "@/types";
import { formatDateLabel, formatPrice } from "@/lib/format";

interface OrderSummaryProps {
  movie: Movie;
  showtime: Showtime;
  seatIds: string[];
  total: number;
}

export default function OrderSummary({
  movie,
  showtime,
  seatIds,
  total,
}: OrderSummaryProps) {
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

      <div className="flex items-center justify-between border-t border-neutral-800 pt-4">
        <span className="text-neutral-400">Total</span>
        <span className="text-lg font-semibold">{formatPrice(total)}</span>
      </div>
    </div>
  );
}
