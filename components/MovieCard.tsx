import Image from "next/image";
import Link from "next/link";
import type { Movie } from "@/types";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-white/60 bg-white/50 shadow-sm backdrop-blur-xl transition-shadow hover:shadow-md">
      <div className="relative aspect-[2/3] w-full">
        <Image
          src={movie.posterUrl}
          alt={movie.title}
          fill
          unoptimized
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="font-semibold leading-tight text-neutral-800">{movie.title}</h3>
          <p className="mt-1 text-xs text-neutral-500">
            {movie.rating} · {movie.durationMinutes} min
          </p>
        </div>
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
        <Link
          href={`/movie/${movie.id}`}
          className="mt-auto inline-flex items-center justify-center rounded-full bg-brand px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
}
