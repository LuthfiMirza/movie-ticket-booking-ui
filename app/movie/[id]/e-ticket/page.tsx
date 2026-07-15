import { notFound } from "next/navigation";
import ETicket from "@/components/ETicket";
import { getMovieById, getShowtimesByMovie } from "@/lib/data";

interface ETicketPageProps {
  params: { id: string };
  searchParams: { showtime?: string; seats?: string };
}

export default function ETicketPage({ params, searchParams }: ETicketPageProps) {
  const movie = getMovieById(params.id);
  if (!movie) notFound();

  const showtime = getShowtimesByMovie(movie.id).find(
    (item) => item.id === searchParams.showtime
  );
  if (!showtime) notFound();

  const seatIds = searchParams.seats?.split(",").filter(Boolean) ?? [];
  if (seatIds.length === 0) notFound();

  const total = seatIds.length * showtime.price;

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      <ETicket movie={movie} showtime={showtime} seatIds={seatIds} total={total} />
    </main>
  );
}
