"use client";

import { useLayoutEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  DEFAULT_RESERVATION_SECONDS,
  clearReservation,
  getRemainingSeconds,
  startReservation,
} from "@/lib/reservation";

interface ReservationTimerProps {
  showtimeId: string;
  durationSeconds?: number;
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
}: ReservationTimerProps) {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [remainingSeconds, setRemainingSeconds] = useState(durationSeconds);

  // useLayoutEffect (not useEffect) so the sessionStorage-derived remaining
  // time is applied before the browser paints, avoiding a visible flash of
  // the full duration when a reservation was already started on a prior page.
  useLayoutEffect(() => {
    startReservation(showtimeId);

    function updateRemainingTime() {
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

  const isUrgent = remainingSeconds < 60;

  return (
    <div
      aria-live="polite"
      className={`mx-auto mt-4 w-fit rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-widest ${
        isUrgent
          ? "border-red-600 bg-red-600/15 text-red-400"
          : "border-neutral-700 bg-neutral-900 text-neutral-400"
      }`}
    >
      Reservation {formatRemainingTime(remainingSeconds)}
    </div>
  );
}
