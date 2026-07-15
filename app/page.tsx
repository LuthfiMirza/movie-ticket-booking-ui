export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <span className="rounded-full border border-neutral-700 px-3 py-1 text-xs font-medium uppercase tracking-widest text-neutral-400">
        Phase 0 · Scaffold
      </span>
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">CineBook</h1>
      <p className="max-w-md text-balance text-neutral-400">
        A movie ticket booking UI built with Next.js 14, TypeScript, and
        Tailwind CSS. Movie listing, showtimes, and an interactive seat map are
        on the way.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-neutral-500">
        <span className="rounded bg-neutral-800 px-2 py-1">Next.js 14</span>
        <span className="rounded bg-neutral-800 px-2 py-1">TypeScript</span>
        <span className="rounded bg-neutral-800 px-2 py-1">Tailwind CSS</span>
        <span className="rounded bg-neutral-800 px-2 py-1">App Router</span>
      </div>
    </main>
  );
}
