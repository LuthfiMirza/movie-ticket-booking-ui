interface EmptyStateProps {
  title: string;
  description: string;
}

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/60 bg-white/50 px-6 py-16 text-center shadow-sm backdrop-blur-xl">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-light/30 text-brand">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12 12 4h8v8l-8 8-8-8Z" />
          <circle cx="14.5" cy="9.5" r="1.5" />
        </svg>
      </div>
      <h2 className="font-serif text-lg font-semibold text-neutral-800">{title}</h2>
      <p className="max-w-xs text-sm text-neutral-500">{description}</p>
    </div>
  );
}
