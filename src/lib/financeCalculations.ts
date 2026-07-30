export function calculatePricePMT(principal: number, monthlyRate: number, months: number): number {
  if (months <= 0) return 0;
  if (monthlyRate === 0) return principal / months;

  const factor = Math.pow(1 + monthlyRate, months);
  return (principal * (monthlyRate * factor)) / (factor - 1);
}

export function annualRateFromMonthly(monthlyRate: number): number {
  return Math.pow(1 + monthlyRate, 12) - 1;
}

export function monthlyRateFromAnnual(annualRate: number): number {
  return Math.pow(1 + annualRate, 1 / 12) - 1;
}

export function withCetDelta(monthlyRate: number, delta = 0.001): number {
  return monthlyRate + delta;
}

export function calculateTotalPayment(monthlyPayment: number, months: number): number {
  return monthlyPayment * months;
}

export function calculateTotalInterest(totalPayment: number, principal: number): number {
  return totalPayment - principal;
}
