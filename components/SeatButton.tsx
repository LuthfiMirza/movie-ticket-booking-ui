import type { SeatStatus } from "@/types";

interface SeatButtonProps {
  seatId: string;
  status: SeatStatus;
  onClick: () => void;
}

const STATUS_CLASSES: Record<SeatStatus, string> = {
  available:
    "border-neutral-700 bg-neutral-900 text-neutral-300 hover:border-neutral-500 hover:bg-neutral-800",
  selected: "border-red-600 bg-red-600 text-white",
  booked: "cursor-not-allowed border-neutral-800 bg-neutral-950 text-neutral-700",
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
