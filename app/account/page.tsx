import EmptyState from "@/components/EmptyState";

export default function AccountPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="mb-6 font-serif text-2xl font-semibold text-neutral-50">
        Account
      </h1>
      <EmptyState
        title="Not signed in"
        description="Account is a demo placeholder — this project has no real authentication."
      />
    </main>
  );
}
