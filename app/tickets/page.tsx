import EmptyState from "@/components/EmptyState";

export default function TicketsPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="mb-6 font-serif text-2xl font-semibold text-neutral-50">
        Tickets
      </h1>
      <EmptyState
        title="No tickets yet"
        description="Tickets you've booked will show up here once payment is complete."
      />
    </main>
  );
}
