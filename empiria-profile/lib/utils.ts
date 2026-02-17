/**
 * Format a monetary amount with correct currency symbol and locale.
 */
export function formatCurrency(amount: number, currency: string = "cad"): string {
  const upper = currency.toUpperCase();
  const localeMap: Record<string, string> = {
    CAD: "en-CA", USD: "en-US", INR: "en-IN", GBP: "en-GB",
    EUR: "de-DE", AUD: "en-AU", NZD: "en-NZ", SGD: "en-SG",
    HKD: "en-HK", JPY: "ja-JP", MXN: "es-MX", BRL: "pt-BR",
  };
  return new Intl.NumberFormat(localeMap[upper] ?? "en-CA", {
    style: "currency",
    currency: upper,
  }).format(amount);
}

export function getCurrencySymbol(currency: string): string {
  return formatCurrency(0, currency).replace(/[\d.,\s]/g, "").trim();
}

/**
 * Relative date string for display.
 */
export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(dateStr));
}

/**
 * Generate initials from a full name.
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
