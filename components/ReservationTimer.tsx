"use client";

import { useLayoutEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  DEFAULT_RESERVATION_SECONDS,
  clearReservation,
  getRemainingSeconds,
  hasActiveReservation,
} from "@/lib/reservation";

interface ReservationTimerProps {
  showtimeId: string;
  durationSeconds?: number;
  idleMessage?: string;
}

function formatRemainingTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}

export default function ReservationTimer({
  showtimeId,
  durationSeconds = DEFAULT_RESERVATION_SECONDS,
  idleMessage = "Select a seat to start your reservation",
}: ReservationTimerProps) {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [remainingSeconds, setRemainingSeconds] = useState(durationSeconds);
  const [isActive, setIsActive] = useState(false);

  // This component only reads/displays the reservation — it does not start
  // one. The reservation itself is started by SeatSelector on the first seat
  // pick, so browsing seats without selecting anything doesn't burn the clock.
  // useLayoutEffect (not useEffect) so the sessionStorage-derived remaining
  // time is applied before the browser paints, avoiding a visible flash.
  useLayoutEffect(() => {
    function updateRemainingTime() {
      const active = hasActiveReservation(showtimeId);
      setIsActive(active);

      if (!active) {
        setRemainingSeconds(durationSeconds);
        return;
      }

      const nextRemainingSeconds = getRemainingSeconds(showtimeId, durationSeconds);
      setRemainingSeconds(nextRemainingSeconds);

      if (nextRemainingSeconds <= 0) {
        clearReservation(showtimeId);
        router.push(`/movie/${params.id}?expired=1`);
      }
    }

    updateRemainingTime();
    const intervalId = window.setInterval(updateRemainingTime, 1000);

    return () => window.clearInterval(intervalId);
  }, [durationSeconds, params.id, router, showtimeId]);

  const isUrgent = isActive && remainingSeconds < 60;

  return (
    <div
      aria-live="polite"
      className={`mx-auto mt-4 w-fit rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-widest backdrop-blur-xl ${
        isUrgent
          ? "border-red-300 bg-red-50/80 text-red-600"
          : "border-white/60 bg-white/50 text-neutral-500"
      }`}
    >
      {isActive ? `Reservation ${formatRemainingTime(remainingSeconds)}` : idleMessage}
    </div>
  );
}
