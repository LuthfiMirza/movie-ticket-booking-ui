import Image from "next/image";
import Link from "next/link";
import type { Movie } from "@/types";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900">
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
          <h3 className="font-semibold leading-tight">{movie.title}</h3>
          <p className="mt-1 text-xs text-neutral-500">
            {movie.rating} · {movie.durationMinutes} min
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {movie.genres.map((genre) => (
            <span
              key={genre}
              className="rounded bg-neutral-800 px-2 py-0.5 text-xs text-neutral-300"
            >
              {genre}
            </span>
          ))}
        </div>
        <Link
          href={`/movie/${movie.id}`}
          className="mt-auto inline-flex items-center justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-500"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
}
