"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Showtime } from "@/types";
import { getStoredLocation } from "@/components/LocationPicker";
import { cinemas, isShowtimeSoldOut } from "@/lib/data";
import { formatDateLabel, formatPrice } from "@/lib/format";

interface ShowtimeSelectorProps {
  showtimes: Showtime[];
}

export default function ShowtimeSelector({ showtimes }: ShowtimeSelectorProps) {
  const [selectedCinemaId, setSelectedCinemaId] = useState(cinemas[0]?.id ?? "");

  useEffect(() => {
    setSelectedCinemaId(getStoredLocation().cinemaId);
  }, []);

  const filteredShowtimes = useMemo(
    () => showtimes.filter((showtime) => showtime.cinemaId === selectedCinemaId),
    [selectedCinemaId, showtimes]
  );

  const dates = useMemo(
    () => Array.from(new Set(filteredShowtimes.map((showtime) => showtime.date))).sort(),
    [filteredShowtimes]
  );

  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const [selectedShowtimeId, setSelectedShowtimeId] = useState<string | null>(null);

  useEffect(() => {
    setSelectedDate(dates[0]);
    setSelectedShowtimeId(null);
  }, [dates]);

  const showtimesForDate = filteredShowtimes
    .filter((showtime) => showtime.date === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  const selectedShowtime = filteredShowtimes.find(
    (showtime) => showtime.id === selectedShowtimeId
  );

  const selectedCinema = cinemas.find((cinema) => cinema.id === selectedCinemaId);

  function handleSelectDate(date: string) {
    setSelectedDate(date);
    setSelectedShowtimeId(null);
  }

  return (
    <div className="flex flex-col gap-6">
      {filteredShowtimes.length === 0 && (
        <div className="rounded-2xl border border-white/60 bg-white/50 px-4 py-3 text-sm text-neutral-500 backdrop-blur-xl">
          Tidak ada jadwal di bioskop ini
          {selectedCinema ? ` (${selectedCinema.name})` : ""}. Silakan ganti bioskop
          dari halaman utama.
        </div>
      )}

      {filteredShowtimes.length > 0 && (
        <>
          <div>
            <h2 className="mb-3 text-sm font-medium uppercase tracking-widest text-neutral-500">
              Select Date
            </h2>
            <div className="flex flex-wrap gap-2">
              {dates.map((date) => {
                const isSelected = date === selectedDate;
                return (
                  <button
                    key={date}
                    type="button"
                    onClick={() => handleSelectDate(date)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      isSelected
                        ? "bg-brand text-white"
                        : "border border-neutral-200 bg-white/60 text-neutral-600 hover:border-brand/40"
                    }`}
                  >
                    {formatDateLabel(date)}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-sm font-medium uppercase tracking-widest text-neutral-500">
              Select Time
            </h2>
            <div className="flex flex-wrap gap-2">
              {showtimesForDate.map((showtime) => {
                const isSoldOut = isShowtimeSoldOut(showtime.id);
                const isSelected = showtime.id === selectedShowtimeId;
                return (
                  <button
                    key={showtime.id}
                    type="button"
                    onClick={() => setSelectedShowtimeId(showtime.id)}
                    disabled={isSoldOut}
                    className={`flex flex-col items-start rounded-xl border px-4 py-2 text-left backdrop-blur-xl transition-colors ${
                      isSoldOut
                        ? "cursor-not-allowed border-neutral-200 bg-white/30 opacity-60"
                        : isSelected
                        ? "border-brand bg-brand-light/20"
                        : "border-white/60 bg-white/50 hover:border-brand/40"
                    }`}
                  >
                    <span
                      className={`text-sm font-semibold ${
                        isSoldOut
                          ? "text-neutral-400"
                          : isSelected
                            ? "text-brand-dark"
                            : "text-neutral-800"
                      }`}
                    >
                      {showtime.time}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {showtime.studio} · {isSoldOut ? "Sold Out" : formatPrice(showtime.price)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <Link
            href={selectedShowtime ? `/movie/${selectedShowtime.movieId}/seats?showtime=${selectedShowtime.id}` : "#"}
            aria-disabled={!selectedShowtime}
            className={`mt-2 inline-flex w-fit items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
              selectedShowtime
                ? "bg-brand text-white hover:bg-brand-dark"
                : "pointer-events-none bg-neutral-200 text-neutral-400"
            }`}
          >
            Continue to Seats
          </Link>
        </>
      )}
    </div>
  );
}
