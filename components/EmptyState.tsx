interface EmptyStateProps {
  title: string;
  description: string;
}

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-brand/15 bg-white/[0.04] px-6 py-16 text-center backdrop-blur-xl">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-light to-brand text-brand-ink">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12 12 4h8v8l-8 8-8-8Z" />
          <circle cx="14.5" cy="9.5" r="1.5" />
        </svg>
      </div>
      <h2 className="font-serif text-lg font-semibold text-neutral-50">{title}</h2>
      <p className="max-w-xs text-sm text-neutral-400">{description}</p>
    </div>
  );
}
