import Link from "next/link";

type BookingStep = "showtime" | "seats" | "payment" | "done";

interface BookingStepsProps {
  currentStep: BookingStep;
  stepHrefs?: Partial<Record<BookingStep, string>>;
}

const STEPS: { id: BookingStep; label: string }[] = [
  { id: "showtime", label: "Showtime" },
  { id: "seats", label: "Seats" },
  { id: "payment", label: "Payment" },
  { id: "done", label: "Done" },
];

export default function BookingSteps({ currentStep, stepHrefs }: BookingStepsProps) {
  const currentStepIndex = STEPS.findIndex((step) => step.id === currentStep);

  return (
    <nav aria-label="Booking progress" className="mb-8">
      <ol className="flex items-center gap-2 sm:gap-3">
        {STEPS.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const isSuccess = isCurrent && step.id === "done";
          const href = isCompleted ? stepHrefs?.[step.id] : undefined;

          const circle = (
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold transition-colors ${
                isSuccess
                  ? "border-green-600 bg-green-600 text-white"
                  : isCompleted
                    ? "border-green-600 bg-green-600 text-white"
                    : isCurrent
                      ? "border-red-600 bg-red-600 text-white"
                      : "border-neutral-800 bg-neutral-900 text-neutral-600"
              }`}
            >
              {isCompleted || isSuccess ? "✓" : index + 1}
            </span>
          );

          const label = (
            <span
              className={`max-w-16 truncate text-center text-[11px] font-medium sm:max-w-none sm:text-xs ${
                isSuccess
                  ? "text-green-500"
                  : isCurrent
                    ? "text-red-500"
                    : isCompleted
                      ? "text-green-500"
                      : "text-neutral-600"
              }`}
            >
              {step.label}
            </span>
          );

          return (
            <li key={step.id} className="flex flex-1 items-center gap-2 sm:gap-3">
              {href ? (
                <Link
                  href={href}
                  className="flex min-w-0 flex-col items-center gap-2 rounded-md transition-opacity hover:opacity-80"
                >
                  {circle}
                  {label}
                </Link>
              ) : (
                <div className="flex min-w-0 flex-col items-center gap-2">
                  {circle}
                  {label}
                </div>
              )}

              {index < STEPS.length - 1 && (
                <span
                  aria-hidden="true"
                  className={`h-px flex-1 ${
                    index < currentStepIndex ? "bg-green-600" : "bg-neutral-800"
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
