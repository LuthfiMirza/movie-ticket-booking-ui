import { notFound } from "next/navigation";
import { getMovieById, getShowtimesByMovie } from "@/lib/data";
import OrderSummary from "@/components/OrderSummary";
import PaymentMethodSelector from "@/components/PaymentMethodSelector";

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

  const total = seatIds.length * showtime.price;

  return (
    <main className="mx-auto max-w-lg px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Payment</h1>

      <div className="flex flex-col gap-6">
        <OrderSummary
          movie={movie}
          showtime={showtime}
          seatIds={seatIds}
          total={total}
        />
        <PaymentMethodSelector />
      </div>
    </main>
  );
}
