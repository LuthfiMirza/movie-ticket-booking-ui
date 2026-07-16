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
    <section className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
      <h2 className="text-lg font-semibold">Payment Method</h2>
      <p className="mt-1 text-sm text-neutral-400">
        Choose a dummy payment method to continue this demo flow.
      </p>

      <div className="mt-5 flex flex-col gap-3">
        {PAYMENT_METHODS.map((method) => {
          const isSelected = selectedMethod === method.id;

          return (
            <label
              key={method.id}
              className={`flex cursor-pointer items-start gap-3 rounded-md border p-4 transition-colors ${
                isSelected
                  ? "border-red-600 bg-red-600/10"
                  : "border-neutral-800 bg-neutral-950 hover:border-neutral-700"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method.id}
                checked={isSelected}
                onChange={() => setSelectedMethod(method.id)}
                className="mt-1 h-4 w-4 accent-red-600"
              />
              <span className="flex flex-col">
                <span className="text-sm font-medium text-neutral-100">
                  {method.label}
                </span>
                <span className="mt-1 text-xs text-neutral-500">
                  {method.description}
                </span>
              </span>
            </label>
          );
        })}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-800 bg-neutral-950/95 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-2xl shadow-black/40 backdrop-blur sm:px-6">
        <div className="mx-auto max-w-lg">
          <button
            type="button"
            onClick={handlePayNow}
            disabled={!selectedMethod}
            className={`inline-flex w-full items-center justify-center rounded-md px-5 py-2.5 text-sm font-medium transition-colors ${
              selectedMethod
                ? "bg-red-600 text-white hover:bg-red-500"
                : "cursor-not-allowed bg-neutral-800 text-neutral-500"
            }`}
          >
            Pay Now
          </button>
        </div>
      </div>
    </section>
  );
}
