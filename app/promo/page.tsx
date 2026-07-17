import EmptyState from "@/components/EmptyState";

export default function PromoPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="mb-6 font-serif text-2xl font-semibold text-neutral-50">
        Promo
      </h1>
      <EmptyState
        title="No active promos"
        description="Vouchers and special offers will show up here. Try code CINEBOOK10 at checkout."
      />
    </main>
  );
}
