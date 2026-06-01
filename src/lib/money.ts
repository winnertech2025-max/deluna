export function formatEUR(amount: number) {
  return new Intl.NumberFormat("en-NL", {
    style: "currency",
    currency: "EUR"
  }).format(amount);
}

export function formatDate(value: string | Date) {
  return new Intl.DateTimeFormat("en-NL", {
    dateStyle: "medium"
  }).format(new Date(value));
}
