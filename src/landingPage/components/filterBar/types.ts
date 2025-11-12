// Filter types - matches backend query params
export interface FilterOptions {
  // Search and pagination
  query?: string;
  page?: number;
  pageSize?: number;

  // Sorting - camelCase to match API
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';

  // Price filters
  minPreviousClose?: number;
  maxPreviousClose?: number;

  // P/E Ratio filters
  minPe?: number;
  maxPe?: number;
  minForwardPe?: number;
  maxForwardPe?: number;

  // Dividend yield filters
  minDividendYield?: number;
  maxDividendYield?: number;

  // Market cap filters
  minMarketCap?: number;
  maxMarketCap?: number;

  // Payout ratio filters
  minPayoutRatio?: number;
  maxPayoutRatio?: number;
}

export type FilterChangeHandler = (filters: FilterOptions, opts?: { reset?: boolean }) => void;