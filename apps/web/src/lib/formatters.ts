export function formatMoneyETB(value: number, locale: "en" | "am") {
  return new Intl.NumberFormat(locale === "am" ? "am-ET" : "en-ET", {
    style: "currency",
    currency: "ETB",
    maximumFractionDigits: 2
  }).format(value);
}

export function formatLocalDate(value: Date | string, locale: "en" | "am") {
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat(locale === "am" ? "am-ET" : "en-ET", {
    dateStyle: "medium"
  }).format(date);
}
