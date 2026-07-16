import { notFound } from "next/navigation";
import BookingSteps from "@/components/BookingSteps";
import { getMovieById, getShowtimesByMovie } from "@/lib/data";
import PaymentPanel from "@/components/PaymentPanel";
import ReservationTimer from "@/components/ReservationTimer";

interface PaymentPageProps {
  params: { id: string };
  searchParams: { showtime?: string; seats?: string };
}

export default function PaymentPage({ params, searchParams }: PaymentPageProps) {
  const movie = getMovieById(params.id);
  if (!movie) notFound();

  const showtime = getShowtimesByMovie(movie.id).find(
    (item) => item.id === searchParams.showtime
  );
  if (!showtime) notFound();

  const seatIds = searchParams.seats?.split(",").filter(Boolean) ?? [];
  if (seatIds.length === 0) notFound();

  const baseTicketHref = `/movie/${movie.id}/e-ticket?showtime=${showtime.id}&seats=${seatIds.join(",")}`;

  return (
    <main className="mx-auto max-w-lg px-4 py-10 sm:px-6 sm:py-14">
      <BookingSteps currentStep="payment" />

      <header className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Payment</h1>
        <ReservationTimer showtimeId={showtime.id} />
      </header>

      <PaymentPanel
        movie={movie}
        showtime={showtime}
        seatIds={seatIds}
        baseTicketHref={baseTicketHref}
      />
    </main>
  );
}
