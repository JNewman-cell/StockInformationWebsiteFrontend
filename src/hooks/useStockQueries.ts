import { useQuery } from '@tanstack/react-query';
import { stockAPI } from '../services/api';
import { QUERY_CONFIG } from '../config/constants';
import type { StockSuggestion } from '../types';
import type { FilterOptions } from '../landingPage/components/filterBar/types';

interface LegacyStockSearchResponse {
  stocks: Stock[];
  total: number;
  page: number;
  pageSize: number;
  total_pages: number;
}

interface Stock {
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

export const useStockAutocomplete = (query: string, enabled: boolean = true) => {
  return useQuery<StockSuggestion[]>({
    queryKey: ['stocks', 'autocomplete', query],
    queryFn: () => stockAPI.autocomplete(query),
    enabled: enabled && query.trim().length > 0,
    staleTime: QUERY_CONFIG.STALE_TIME.AUTOCOMPLETE,
    gcTime: QUERY_CONFIG.CACHE_TIME,
    retry: QUERY_CONFIG.RETRY_COUNT,
  });
};

export const useStockSearch = (query: string, filters?: FilterOptions) => {
  return useQuery<LegacyStockSearchResponse>({
    queryKey: ['stocks', 'search', query, filters],
    queryFn: async () => {
      const response = await stockAPI.searchStocks(query, filters);

      return {
        stocks: response.content,
        total: response.totalElements,
        page: response.pageNumber + 1,
        pageSize: response.pageSize,
        total_pages: response.totalPages,
      };
    },
    enabled: true,
    staleTime: QUERY_CONFIG.STALE_TIME.SEARCH,
    retry: QUERY_CONFIG.RETRY_COUNT,
  });
};

export const useStock = (symbol: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['stocks', 'detail', symbol],
    queryFn: () => stockAPI.getStock(symbol),
    enabled: enabled && symbol.length > 0,
    staleTime: QUERY_CONFIG.STALE_TIME.STOCK_DETAIL,
    retry: QUERY_CONFIG.RETRY_COUNT,
  });
};
