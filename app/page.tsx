import MovieCard from "@/components/MovieCard";
import { movies } from "@/lib/data";

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-8 flex flex-col gap-2">
        <span className="w-fit rounded-full border border-neutral-700 px-3 py-1 text-xs font-medium uppercase tracking-widest text-neutral-400">
          Now Showing
        </span>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          CineBook
        </h1>
        <p className="max-w-lg text-neutral-400">
          Pick a movie, choose your showtime, and reserve your seats.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </main>
  );
}
