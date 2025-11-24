export const formatCurrency = (value?: number): string => {
  if (value === undefined || value === null) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatNumber = (value?: number, decimals: number = 2): string => {
  if (value === undefined || value === null) return 'N/A';
  return value.toFixed(decimals);
};

export const formatPercent = (value?: number, decimals: number = 2): string => {
  if (value === undefined || value === null) return 'N/A';
  return `${value.toFixed(decimals)}%`;
};

export const formatMarketCap = (value?: number): string => {
  if (value === undefined || value === null) return 'N/A';
  if (value >= 1e12) {
    return `$${(value / 1e12).toFixed(2)}T`;
  } else if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`;
  } else if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`;
  } else {
    return formatCurrency(value);
  }
};

export default {
  formatCurrency,
  formatNumber,
  formatPercent,
  formatMarketCap,
};