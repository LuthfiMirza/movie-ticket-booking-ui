"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const PAYMENT_METHODS = [
  {
    id: "credit-card",
    label: "Credit Card",
    description: "Pay with Visa, Mastercard, or JCB.",
  },
  {
    id: "bank-transfer",
    label: "Bank Transfer",
    description: "Use a virtual account from your bank app.",
  },
  {
    id: "e-wallet",
    label: "E-Wallet",
    description: "Continue with a supported digital wallet.",
  },
] as const;

interface PaymentMethodSelectorProps {
  ticketHref: string;
}

export default function PaymentMethodSelector({
  ticketHref,
}: PaymentMethodSelectorProps) {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  function handlePayNow() {
    if (!selectedMethod) return;

    router.push(ticketHref);
  }

  return (
    <>
      <section className="rounded-2xl border border-brand/15 bg-white/[0.04] p-6 backdrop-blur-xl">
        <h2 className="font-serif text-lg font-semibold text-neutral-50">Payment Method</h2>
        <p className="mt-1 text-sm text-neutral-400">
          Choose a dummy payment method to continue this demo flow.
        </p>

        <div className="mt-5 flex flex-col gap-3">
          {PAYMENT_METHODS.map((method) => {
            const isSelected = selectedMethod === method.id;

            return (
              <label
                key={method.id}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand ${
                  isSelected
                    ? "border-brand bg-brand-light/10"
                    : "border-white/10 bg-white/[0.03] hover:border-brand/40"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={isSelected}
                  onChange={() => setSelectedMethod(method.id)}
                  className="sr-only"
                />
                <span
                  aria-hidden="true"
                  className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors ${
                    isSelected ? "border-brand" : "border-white/20"
                  }`}
                >
                  {isSelected && (
                    <span className="h-2 w-2 rounded-full bg-gradient-to-br from-brand-light to-brand" />
                  )}
                </span>
                <span className="flex flex-col">
                  <span className="text-sm font-medium text-neutral-100">
                    {method.label}
                  </span>
                  <span className="mt-1 text-xs text-neutral-400">
                    {method.description}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-brand/15 bg-white/[0.04] px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-4px_24px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:px-6">
        <div className="mx-auto max-w-lg">
          <button
            type="button"
            onClick={handlePayNow}
            disabled={!selectedMethod}
            className={`inline-flex w-full items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition-opacity ${
              selectedMethod
                ? "bg-gradient-to-br from-brand-light to-brand text-brand-ink hover:opacity-90"
                : "cursor-not-allowed bg-white/[0.05] text-neutral-600"
            }`}
          >
            Pay Now
          </button>
        </div>
      </div>
    </>
  );
}
