export const API_CONFIG = {
  DEFAULT_PAGE_SIZE: 25,
  DEFAULT_SORT_BY: 'ticker',
  DEFAULT_SORT_ORDER: 'ASC' as const,
  DEBOUNCE_DELAY: 500,
  AUTOCOMPLETE_MIN_LENGTH: 1,
} as const;

export const QUERY_CONFIG = {
  STALE_TIME: {
    AUTOCOMPLETE: 5 * 1000,
    SEARCH: 2 * 60 * 1000,
    STOCK_DETAIL: 5 * 60 * 1000,
  },
  CACHE_TIME: 5 * 60 * 1000,
  RETRY_COUNT: 1,
  REFETCH_ON_WINDOW_FOCUS: false,
} as const;

export const PAGINATION_CONFIG = {
  DEFAULT_PAGE: 1,
  PAGE_RANGE_RADIUS: 2,
  PAGE_SIZE_OPTIONS: [5, 10, 25, 50],
} as const;

export const FILTER_DEFAULTS = {
  sortBy: API_CONFIG.DEFAULT_SORT_BY,
  sortOrder: API_CONFIG.DEFAULT_SORT_ORDER,
  page: PAGINATION_CONFIG.DEFAULT_PAGE,
  pageSize: API_CONFIG.DEFAULT_PAGE_SIZE,
} as const;

export const COLUMN_TO_API_FIELD: Record<string, string> = {
  'Symbol': 'ticker',
  'Name': 'company_name',
  'Previous Close': 'previous_close',
  'P/E Ratio': 'pe',
  'Forward P/E': 'forward_pe',
  'Dividend Yield': 'dividend_yield',
  'Market Cap': 'market_cap',
  'Payout Ratio': 'payout_ratio',
  'Dividend Growth': 'annual_dividend_growth',
  '50-Day Avg': 'fifty_day_average',
  '200-Day Avg': 'two_hundred_day_average',
} as const;

export const MARKET_CAP_RANGES = {
  'Mega Cap': { min: 200000000000, max: undefined, label: 'Mega Cap ($200B+)' },
  'Large Cap': { min: 10000000000, max: 200000000000, label: 'Large Cap ($10B - $200B)' },
  'Mid Cap': { min: 2000000000, max: 10000000000, label: 'Mid Cap ($2B - $10B)' },
  'Small Cap': { min: 300000000, max: 2000000000, label: 'Small Cap ($300M - $2B)' },
  'Micro Cap': { min: 50000000, max: 300000000, label: 'Micro Cap ($50M - $300M)' },
  'Nano Cap': { min: undefined, max: 50000000, label: 'Nano Cap (<$50M)' },
} as const;
