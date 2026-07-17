import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import BookingSteps from "@/components/BookingSteps";
import { getMovieById, getShowtimesByMovie } from "@/lib/data";
import ShowtimeSelector from "@/components/ShowtimeSelector";
import TrailerButton from "@/components/TrailerButton";

interface MoviePageProps {
  params: { id: string };
  searchParams: { expired?: string };
}

export default async function MoviePage({ params, searchParams }: MoviePageProps) {
  const movie = await getMovieById(params.id);

  if (!movie) {
    notFound();
  }

  const showtimes = getShowtimesByMovie(movie.id);

  return (
    <div className="relative">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute inset-0 scale-110"
          style={{
            backgroundImage: `url(${movie.posterUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(40px) brightness(0.5)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/80" />
      </div>

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <BookingSteps currentStep="showtime" />

        <div className="mb-6 flex flex-wrap items-center gap-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/[0.08] px-3 py-1.5 text-xs font-medium text-neutral-200 backdrop-blur-xl transition-colors hover:bg-white/[0.14]"
          >
            ← Back
          </Link>
          {movie.genres.map((genre) => (
            <span
              key={genre}
              className="rounded-full border border-white/15 bg-white/[0.08] px-3 py-1.5 text-xs font-medium text-neutral-200 backdrop-blur-xl"
            >
              {genre}
            </span>
          ))}
          <span className="rounded-full border border-white/15 bg-white/[0.08] px-3 py-1.5 text-xs font-medium text-neutral-200 backdrop-blur-xl">
            {movie.durationMinutes} min
          </span>
          <span className="rounded-full border border-white/15 bg-white/[0.08] px-3 py-1.5 text-xs font-medium text-neutral-200 backdrop-blur-xl">
            {movie.rating}
          </span>
        </div>

        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <div className="relative aspect-[2/3] w-full max-w-xs overflow-hidden rounded-2xl border border-white/15 shadow-2xl shadow-black/50 sm:w-52 sm:max-w-none sm:shrink-0">
            <Image
              src={movie.posterUrl}
              alt={movie.title}
              fill
              unoptimized
              sizes="(max-width: 640px) 320px, 208px"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-black/70 to-transparent p-2">
              <TrailerButton movieTitle={movie.title} trailerKey={movie.trailerKey} />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-neutral-50">{movie.title}</h1>
            <p className="max-w-xl text-neutral-300">{movie.synopsis}</p>

            <div className="mt-2">
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-neutral-400">
                Cast
              </h2>
              <div className="flex flex-wrap gap-4">
                {movie.cast.map((member) => (
                  <div key={member.name} className="flex flex-col items-center gap-1.5 text-center">
                    {member.profileUrl ? (
                      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-brand/30">
                        <Image
                          src={member.profileUrl}
                          alt={member.name}
                          fill
                          unoptimized
                          sizes="44px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-brand/30 bg-gradient-to-br from-brand-light to-brand text-sm font-bold text-brand-ink">
                        {member.name
                          .split(" ")
                          .map((part) => part[0])
                          .join("")}
                      </span>
                    )}
                    <span className="text-[11px] font-medium text-neutral-200">{member.name}</span>
                    <span className="text-[10px] text-neutral-400">{member.role}</span>
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
    </div>
  );
}
