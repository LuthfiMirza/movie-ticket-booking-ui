import Image from "next/image";
import { notFound } from "next/navigation";
import BookingSteps from "@/components/BookingSteps";
import { getMovieById, getShowtimesByMovie } from "@/lib/data";
import ShowtimeSelector from "@/components/ShowtimeSelector";

interface MoviePageProps {
  params: { id: string };
  searchParams: { expired?: string };
}

export default function MoviePage({ params, searchParams }: MoviePageProps) {
  const movie = getMovieById(params.id);

  if (!movie) {
    notFound();
  }

  const showtimes = getShowtimesByMovie(movie.id);

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <BookingSteps currentStep="showtime" />

      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="relative aspect-[2/3] w-40 shrink-0 overflow-hidden rounded-lg sm:w-52">
          <Image
            src={movie.posterUrl}
            alt={movie.title}
            fill
            unoptimized
            sizes="(max-width: 640px) 160px, 208px"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-3">
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-neutral-800">{movie.title}</h1>
          <p className="text-sm text-neutral-500">
            {movie.rating} · {movie.durationMinutes} min
          </p>
          <div className="flex flex-wrap gap-1.5">
            {movie.genres.map((genre) => (
              <span
                key={genre}
                className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600"
              >
                {genre}
              </span>
            ))}
          </div>
          <p className="max-w-xl text-neutral-500">{movie.synopsis}</p>
        </div>
      </div>

      <div className="mt-10 border-t border-neutral-200 pt-8">
        {searchParams.expired === "1" && (
          <div className="mb-6 rounded-2xl border border-amber-300/60 bg-amber-50/80 px-4 py-3 text-sm text-amber-700 backdrop-blur-xl">
            Sesi reservasi sebelumnya sudah habis, silakan pilih ulang.
          </div>
        )}
        <ShowtimeSelector showtimes={showtimes} />
      </div>
    </main>
  );
}
