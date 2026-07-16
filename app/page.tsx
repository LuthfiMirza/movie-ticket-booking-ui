import LocationPicker from "@/components/LocationPicker";
import MovieCard from "@/components/MovieCard";
import { movies } from "@/lib/data";

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <span className="w-fit rounded-full border border-brand/30 bg-brand-light/20 px-3 py-1 text-xs font-medium uppercase tracking-widest text-brand-dark">
            Now Showing
          </span>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-neutral-800 sm:text-4xl">
            CineBook
          </h1>
          <p className="max-w-lg text-neutral-500">
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
    </main>
  );
}
