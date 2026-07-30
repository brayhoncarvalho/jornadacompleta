import { APP_CURRENCY, APP_LOCALE } from '../config/constants';

export function formatCurrencyBRL(value: number, maximumFractionDigits = 2): string {
  return value.toLocaleString(APP_LOCALE, {
    style: 'currency',
    currency: APP_CURRENCY,
    maximumFractionDigits,
  });
}

export function formatPercentPtBr(rate: number, fractionDigits = 2): string {
  return `${(rate * 100).toFixed(fractionDigits).replace('.', ',')}%`;
}

export function formatMonthlyRate(rate: number): string {
  return `${formatPercentPtBr(rate)} a.m.`;
}

export function formatAnnualRateFromMonthly(rate: number): string {
  const annual = Math.pow(1 + rate, 12) - 1;
  return `${formatPercentPtBr(annual)} a.a.`;
}

export function formatDatePtBr(date: Date): string {
  return date.toLocaleDateString(APP_LOCALE, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function onlyDigits(value: string): string {
  return value.replace(/\D+/g, '');
}

export function parseCurrencyInputToCents(value: string): number {
  const digits = onlyDigits(value);
  return parseInt(digits, 10) || 0;
}

export function parseCurrencyInputToValue(value: string): number {
  return parseCurrencyInputToCents(value) / 100;
}

export function formatPhonePtBr(value: string): string {
  const digits = onlyDigits(value).slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}
