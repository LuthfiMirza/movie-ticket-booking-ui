"use client";

import { useState } from "react";
import type { Movie, Showtime } from "@/types";
import OrderSummary from "@/components/OrderSummary";
import PaymentMethodSelector from "@/components/PaymentMethodSelector";

interface PaymentPanelProps {
  movie: Movie;
  showtime: Showtime;
  seatIds: string[];
  baseTicketHref: string;
}

export default function PaymentPanel({
  movie,
  showtime,
  seatIds,
  baseTicketHref,
}: PaymentPanelProps) {
  const [voucherCode, setVoucherCode] = useState("");

  const ticketHref = voucherCode
    ? `${baseTicketHref}&voucher=${encodeURIComponent(voucherCode)}`
    : baseTicketHref;

  return (
    <div className="flex flex-col gap-6">
      <OrderSummary
        movie={movie}
        showtime={showtime}
        seatIds={seatIds}
        pricePerSeat={showtime.price}
        onVoucherApplied={setVoucherCode}
      />
      <PaymentMethodSelector ticketHref={ticketHref} />
    </div>
  );
}
