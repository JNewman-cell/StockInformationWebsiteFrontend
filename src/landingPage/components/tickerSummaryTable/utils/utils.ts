export const formatNumber = (num: number | undefined): string => {
  if (num === undefined || num === null) return 'N/A';
  return num.toLocaleString();
};

export const formatCurrency = (num: number | undefined): string => {
  if (num === undefined || num === null) return 'N/A';
  return `$${num.toFixed(2)}`;
};

export const formatPercent = (num: number | undefined): string => {
  if (num === undefined || num === null) return 'N/A';
  return `${num.toFixed(2)}%`;
};

export const formatMarketCap = (num: number | undefined): string => {
  if (num === undefined || num === null) return 'N/A';
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  return `$${num.toLocaleString()}`;
};