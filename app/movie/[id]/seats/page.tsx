import { notFound } from "next/navigation";
import { getMovieById, getShowtimesByMovie, getSeatMapByShowtime } from "@/lib/data";
import { formatDateLabel, formatPrice } from "@/lib/format";
import SeatSelector from "@/components/SeatSelector";

interface SeatsPageProps {
  params: { id: string };
  searchParams: { showtime?: string };
}

export default function SeatsPage({ params, searchParams }: SeatsPageProps) {
  const movie = getMovieById(params.id);
  if (!movie) notFound();

  const showtime = getShowtimesByMovie(movie.id).find(
    (item) => item.id === searchParams.showtime
  );
  if (!showtime) notFound();

  const seatMap = getSeatMapByShowtime(showtime.id);
  if (!seatMap) notFound();

  return (
    <main className="mx-auto max-w-2xl px-4 pb-36 pt-10 sm:px-6 sm:pb-32 sm:pt-14">
      <header className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight">{movie.title}</h1>
        <p className="mt-1 text-sm text-neutral-400">
          {formatDateLabel(showtime.date)} · {showtime.time} · {showtime.studio} ·{" "}
          {formatPrice(showtime.price)} / seat
        </p>
      </header>

      <SeatSelector
        seats={seatMap.seats}
        rows={seatMap.rows}
        pricePerSeat={showtime.price}
        movieId={movie.id}
        showtimeId={showtime.id}
      />
    </main>
  );
}
