export interface Stock {
  ticker: string;
  companyName: string;
  marketCap?: number;
  previousClose?: number;
  peRatio?: number;
  forwardPeRatio?: number;
  dividendYield?: number;
  payoutRatio?: number;
  fiftyDayAverage?: number;
  twoHundredDayAverage?: number;
}

export interface StockSuggestion {
  symbol: string;
  name: string;
  score?: number;
}

export interface AutocompleteResponse {
  query: string;
  results: StockSuggestion[];
}

export interface StockSearchResponse {
  content: Stock[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  numberOfElements: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
}
