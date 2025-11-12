const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const API_ENDPOINTS = {
  autocomplete: `${API_BASE_URL}/api/v1/search/auto-complete`,
  search: `${API_BASE_URL}/api/v1/ticker-summary/list`,
  getStock: (symbol: string) => `${API_BASE_URL}/stocks/${symbol}`,
  startup: `${API_BASE_URL}/api/v1/startup`,
} as const;
