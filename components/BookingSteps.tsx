type BookingStep = "showtime" | "seats" | "payment" | "done";

interface BookingStepsProps {
  currentStep: BookingStep;
}

const STEPS: { id: BookingStep; label: string }[] = [
  { id: "showtime", label: "Showtime" },
  { id: "seats", label: "Seats" },
  { id: "payment", label: "Payment" },
  { id: "done", label: "Selesai" },
];

export default function BookingSteps({ currentStep }: BookingStepsProps) {
  const currentStepIndex = STEPS.findIndex((step) => step.id === currentStep);

  return (
    <nav aria-label="Booking progress" className="mb-8">
      <ol className="flex items-center gap-2 sm:gap-3">
        {STEPS.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (
            <li key={step.id} className="flex flex-1 items-center gap-2 sm:gap-3">
              <div className="flex min-w-0 flex-col items-center gap-2">
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold transition-colors ${
                    isCompleted
                      ? "border-green-600 bg-green-600 text-white"
                      : isCurrent
                        ? "border-red-600 bg-red-600 text-white"
                        : "border-neutral-800 bg-neutral-900 text-neutral-600"
                  }`}
                >
                  {isCompleted ? "✓" : index + 1}
                </span>
                <span
                  className={`max-w-16 truncate text-center text-[11px] font-medium sm:max-w-none sm:text-xs ${
                    isCurrent
                      ? "text-red-500"
                      : isCompleted
                        ? "text-green-500"
                        : "text-neutral-600"
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {index < STEPS.length - 1 && (
                <span
                  aria-hidden="true"
                  className={`h-px flex-1 ${
                    index < currentStepIndex
                      ? "bg-green-600"
                      : "bg-neutral-800"
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
