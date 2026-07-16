import Image from "next/image";
import { notFound } from "next/navigation";
import BookingSteps from "@/components/BookingSteps";
import { getMovieById, getShowtimesByMovie } from "@/lib/data";
import ShowtimeSelector from "@/components/ShowtimeSelector";
import TrailerButton from "@/components/TrailerButton";

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
        <div className="relative aspect-[2/3] w-40 shrink-0 overflow-hidden rounded-lg border border-brand/15 sm:w-52">
          <Image
            src={movie.posterUrl}
            alt={movie.title}
            fill
            unoptimized
            sizes="(max-width: 640px) 160px, 208px"
            className="object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-black/70 to-transparent p-2">
            <TrailerButton movieTitle={movie.title} />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-neutral-50">{movie.title}</h1>
          <p className="text-sm text-neutral-400">
            {movie.rating} · {movie.durationMinutes} min
          </p>
          <div className="flex flex-wrap gap-1.5">
            {movie.genres.map((genre) => (
              <span
                key={genre}
                className="rounded-full bg-white/[0.06] px-2 py-0.5 text-xs text-neutral-300"
              >
                {genre}
              </span>
            ))}
          </div>
          <p className="max-w-xl text-neutral-400">{movie.synopsis}</p>

          <div className="mt-2">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-neutral-500">
              Cast
            </h2>
            <div className="flex flex-wrap gap-4">
              {movie.cast.map((member) => (
                <div key={member.name} className="flex flex-col items-center gap-1.5 text-center">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-brand/30 bg-gradient-to-br from-brand-light to-brand text-sm font-bold text-brand-ink">
                    {member.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </span>
                  <span className="text-[11px] font-medium text-neutral-200">{member.name}</span>
                  <span className="text-[10px] text-neutral-500">{member.role}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-white/10 pt-8">
        {searchParams.expired === "1" && (
          <div className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-300 backdrop-blur-xl">
            Sesi reservasi sebelumnya sudah habis, silakan pilih ulang.
          </div>
        )}
        <ShowtimeSelector showtimes={showtimes} />
      </div>
    </main>
  );
}
