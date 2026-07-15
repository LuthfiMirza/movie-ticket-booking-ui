const RESERVATION_PREFIX = "reservation:";

function getReservationKey(showtimeId: string): string {
  return `${RESERVATION_PREFIX}${showtimeId}`;
}

function canUseSessionStorage(): boolean {
  return typeof window !== "undefined" && Boolean(window.sessionStorage);
}

export function startReservation(showtimeId: string): void {
  if (!canUseSessionStorage()) return;

  const key = getReservationKey(showtimeId);

  if (!window.sessionStorage.getItem(key)) {
    window.sessionStorage.setItem(key, Date.now().toString());
  }
}

export function getRemainingSeconds(
  showtimeId: string,
  durationSeconds = 600
): number {
  if (!canUseSessionStorage()) return durationSeconds;

  const startedAt = Number(window.sessionStorage.getItem(getReservationKey(showtimeId)));
  if (!Number.isFinite(startedAt) || startedAt <= 0) return durationSeconds;

  const elapsedSeconds = Math.floor((Date.now() - startedAt) / 1000);

  return Math.max(durationSeconds - elapsedSeconds, 0);
}

export function clearReservation(showtimeId: string): void {
  if (!canUseSessionStorage()) return;

  window.sessionStorage.removeItem(getReservationKey(showtimeId));
}
