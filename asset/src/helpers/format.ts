const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

const numberFormatter = new Intl.NumberFormat("vi-VN", {
  maximumFractionDigits: 1,
});

export const formatVND = (value: number) => currencyFormatter.format(value);

export const formatNumber = (value: number) => numberFormatter.format(value);

export const formatCompactVND = (value: number) => {
  const abs = Math.abs(value);
  if (abs >= 1e6) return `${numberFormatter.format(value / 1e6)}tr`;
  if (abs >= 1e3) return `${numberFormatter.format(value / 1e3)}k`;
  return numberFormatter.format(value);
};

export const formatPercent = (value: number) =>
  `${numberFormatter.format(value)}%`;

export const formatShortDate = (isoDate: string) => {
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
};
