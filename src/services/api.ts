import { API_ENDPOINTS } from '../config/api';
import type {
  StockSuggestion,
  StockSearchResponse,
  AutocompleteResponse,
} from '../types';
import type { FilterOptions } from '../landingPage/components/filterBar/types';

export const stockAPI = {
  autocomplete: async (query: string): Promise<StockSuggestion[]> => {
    try {
      const response = await fetch(
        `${API_ENDPOINTS.autocomplete}?query=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error('Autocomplete request failed');
      }

      const data = await response.json() as AutocompleteResponse;
      return data.results || [];
    } catch (error) {
      console.error('Autocomplete error:', error);
      return [];
    }
  },

  searchStocks: async (
    query: string,
    filters?: FilterOptions
  ): Promise<StockSearchResponse> => {
    try {
      const params = new URLSearchParams();

      if (query) {
        params.append('query', encodeURIComponent(query));
      }

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            if (key === 'page' && typeof value === 'number') {
              params.append(key, String(value - 1));
            } else {
              params.append(key, String(value));
            }
          }
        });
      }

      const response = await fetch(`${API_ENDPOINTS.search}?${params}`);

      if (!response.ok) {
        throw new Error('Search request failed');
      }

      return await response.json() as StockSearchResponse;
    } catch (error) {
      console.error('Search error:', error);
      return {
        content: [],
        pageNumber: 0,
        pageSize: 25,
        totalElements: 0,
        totalPages: 0,
        numberOfElements: 0,
        sort: { empty: true, sorted: false, unsorted: true },
      };
    }
  },

  getStock: async (symbol: string) => {
    try {
      const response = await fetch(API_ENDPOINTS.getStock(symbol));

      if (!response.ok) {
        throw new Error('Failed to fetch stock');
      }

      return await response.json();
    } catch (error) {
      console.error('Get stock error:', error);
      return null;
    }
  },
};