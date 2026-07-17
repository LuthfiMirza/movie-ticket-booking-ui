import LocationPicker from "@/components/LocationPicker";
import MovieCard from "@/components/MovieCard";
import { getMovies } from "@/lib/data";

export default async function Home() {
  const movies = await getMovies();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <span className="w-fit rounded-full border border-brand/30 bg-brand-light/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-brand-light">
            Now Showing
          </span>
          <h1 className="bg-gradient-to-r from-neutral-50 to-brand-light bg-clip-text font-serif text-3xl font-semibold tracking-tight text-transparent sm:text-4xl">
            CineBook
          </h1>
          <p className="max-w-lg text-neutral-400">
            Pick a movie, choose your showtime, and reserve your seats.
          </p>
        </div>
        <LocationPicker />
      </header>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      <p className="mt-10 text-center text-xs text-neutral-600">
        Movie data and trailers provided by{" "}
        <a
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noreferrer"
          className="underline hover:text-neutral-400"
        >
          TMDB
        </a>
        . This product uses the TMDB API but is not endorsed or certified by TMDB.
      </p>
    </main>
  );
}
