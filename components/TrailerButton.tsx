"use client";

import { useState } from "react";

interface TrailerButtonProps {
  movieTitle: string;
  trailerKey?: string;
}

export default function TrailerButton({ movieTitle, trailerKey }: TrailerButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-brand/25 bg-black/50 px-3 py-1.5 text-xs font-semibold text-brand-light backdrop-blur-xl transition-colors hover:border-brand/50"
      >
        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-light to-brand">
          <svg viewBox="0 0 10 10" width="6" height="6" className="ml-px fill-brand-ink">
            <path d="M1 0 9 5 1 10Z" />
          </svg>
        </span>
        Watch Trailer
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setIsOpen(false)}
        >
          {trailerKey ? (
            <div
              onClick={(event) => event.stopPropagation()}
              className="aspect-video w-full max-w-2xl overflow-hidden rounded-2xl border border-brand/20 bg-black shadow-2xl"
            >
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                title={`${movieTitle} trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          ) : (
            <div
              role="dialog"
              aria-modal="true"
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-sm rounded-2xl border border-brand/20 bg-neutral-900 p-6 text-center"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-brand-light to-brand">
                <svg viewBox="0 0 10 10" width="14" height="14" className="ml-0.5 fill-brand-ink">
                  <path d="M1 0 9 5 1 10Z" />
                </svg>
              </div>
              <p className="font-serif text-lg font-semibold text-neutral-50">{movieTitle}</p>
              <p className="mt-2 text-sm text-neutral-400">
                No trailer is available for this title right now.
              </p>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-white/[0.06] px-4 py-2.5 text-sm font-medium text-neutral-200 transition-colors hover:bg-white/[0.1]"
              >
                Close
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
