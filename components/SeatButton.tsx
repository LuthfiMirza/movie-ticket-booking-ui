import type { SeatStatus } from "@/types";

interface SeatButtonProps {
  seatId: string;
  status: SeatStatus;
  onClick: () => void;
}

const STATUS_CLASSES: Record<SeatStatus, string> = {
  available:
    "border-neutral-200 bg-white/70 text-neutral-600 backdrop-blur-xl hover:border-brand/50 hover:bg-brand-light/10",
  selected: "border-brand bg-brand text-white",
  booked: "cursor-not-allowed border-neutral-100 bg-neutral-100 text-neutral-300",
};

export default function SeatButton({ seatId, status, onClick }: SeatButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={status === "booked"}
      aria-label={`Seat ${seatId} — ${status}`}
      aria-pressed={status === "selected"}
      className={`flex h-10 w-10 items-center justify-center rounded border text-xs font-medium transition-colors sm:h-9 sm:w-9 sm:text-[11px] ${STATUS_CLASSES[status]}`}
    >
      {seatId}
    </button>
  );
}
