import type { SeatStatus } from "@/types";

interface SeatButtonProps {
  seatId: string;
  status: SeatStatus;
  onClick: () => void;
}

const STATUS_CLASSES: Record<SeatStatus, string> = {
  available:
    "border-white/15 bg-white/[0.04] text-neutral-300 backdrop-blur-xl hover:border-brand/50 hover:bg-brand-light/10",
  selected:
    "border-transparent bg-gradient-to-br from-brand-light to-brand text-brand-ink shadow-[0_0_10px_rgba(198,161,91,0.5)]",
  booked: "cursor-not-allowed border-white/5 bg-white/[0.02] text-neutral-700",
};

export default function SeatButton({ seatId, status, onClick }: SeatButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={status === "booked"}
      aria-label={`Seat ${seatId} — ${status}`}
      aria-pressed={status === "selected"}
      className={`flex h-10 w-10 items-center justify-center rounded-t-lg rounded-b-md border text-xs font-medium transition-colors sm:h-9 sm:w-9 sm:text-[11px] ${STATUS_CLASSES[status]}`}
    >
      {seatId}
    </button>
  );
}
