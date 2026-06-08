export type ShippingCountry = "NL" | "BE" | "DE" | "FR" | "OTHER_EU";
export type CustomerType = "private" | "business";

export const countryOptions: Array<{ code: ShippingCountry; label: string }> = [
  { code: "NL", label: "Netherlands" },
  { code: "BE", label: "Belgium" },
  { code: "DE", label: "Germany" },
  { code: "FR", label: "France" },
  { code: "OTHER_EU", label: "Other European country" }
];

const euVatPrefixes = new Set([
  "AT", "BE", "BG", "CY", "CZ", "DE", "DK", "EE", "EL", "ES", "FI", "FR", "HR", "HU", "IE", "IT",
  "LT", "LU", "LV", "MT", "NL", "PL", "PT", "RO", "SE", "SI", "SK"
]);

export function getShippingRule(country: ShippingCountry) {
  if (country === "NL") return { threshold: 49, fee: 4.95, label: "NL" };
  if (country === "BE" || country === "DE") return { threshold: 69, fee: 6.95, label: "BE/DE" };
  if (country === "FR") return { threshold: 69, fee: 7.95, label: "FR" };
  return { threshold: 99, fee: 9.95, label: "Rest of Europe" };
}

export function getShippingAmount(subtotalGross: number, country: ShippingCountry) {
  const rule = getShippingRule(country);
  return subtotalGross >= rule.threshold ? 0 : rule.fee;
}

export function normalizeVatNumber(value: string) {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function validateVatNumber(value: string) {
  const normalized = normalizeVatNumber(value);
  const prefix = normalized.slice(0, 2);
  return {
    normalized,
    prefix,
    isValid: normalized.length >= 8 && normalized.length <= 14 && euVatPrefixes.has(prefix),
    isDutch: prefix === "NL",
    isEuNonDutch: euVatPrefixes.has(prefix) && prefix !== "NL"
  };
}

export function calculateCheckoutTotals(input: {
  subtotalGross: number;
  country: ShippingCountry;
  customerType: CustomerType;
  vatNumber?: string;
}) {
  const shippingGross = getShippingAmount(input.subtotalGross, input.country);
  const vat = validateVatNumber(input.vatNumber || "");
  const vatExempt = input.customerType === "business" && vat.isValid && vat.isEuNonDutch;
  const grossTotal = input.subtotalGross + shippingGross;
  const netTotal = vatExempt ? grossTotal / 1.21 : grossTotal;
  const vatAmount = vatExempt ? 0 : grossTotal - grossTotal / 1.21;

  return {
    subtotalGross: roundMoney(input.subtotalGross),
    shippingGross: roundMoney(shippingGross),
    total: roundMoney(netTotal),
    vatAmount: roundMoney(vatAmount),
    vatExempt,
    vatNumber: vat.normalized,
    vatValid: !input.vatNumber || vat.isValid,
    shippingRule: getShippingRule(input.country)
  };
}

function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}

