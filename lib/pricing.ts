export const ADMIN_FEE_PER_SEAT = 5000;

const VOUCHERS: Record<string, number> = {
  CINEBOOK10: 0.1,
  HEMAT20: 0.2,
};

export interface PricingBreakdown {
  subtotal: number;
  adminFee: number;
  discount: number;
  total: number;
}

export function calculateTotal(
  seatCount: number,
  pricePerSeat: number,
  voucherCode?: string
): PricingBreakdown {
  const subtotal = seatCount * pricePerSeat;
  const adminFee = seatCount * ADMIN_FEE_PER_SEAT;
  const normalizedVoucherCode = voucherCode?.trim().toUpperCase() ?? "";
  const discountRate = VOUCHERS[normalizedVoucherCode] ?? 0;
  const discount = Math.round(subtotal * discountRate);

  return {
    subtotal,
    adminFee,
    discount,
    total: subtotal + adminFee - discount,
  };
}

export function isValidVoucher(voucherCode: string): boolean {
  return voucherCode.trim().toUpperCase() in VOUCHERS;
}
