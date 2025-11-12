import type { FC, KeyboardEvent } from 'react';
import { useState, useCallback } from 'react';
import SearchBar from './components/searchBar/SearchBar';
import Filters from './components/filterBar/FilterBar';
import Pagination from './components/pagination/Pagination';
import TickerSummaryTable from './components/tickerSummaryTable/TickerSummaryTable';
import Loading from '../components/Loading';
import { useStockSearch } from '../hooks/useStockQueries';
import {
  FILTER_DEFAULTS,
  COLUMN_TO_API_FIELD,
} from '../config/constants';
import type { FilterOptions } from './components/filterBar/types';
import './StockScreener.css';

const Landing: FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>(FILTER_DEFAULTS);
  const [hasSearched, setHasSearched] = useState(false);
  const [pageInputValue, setPageInputValue] = useState('');

  const { data: searchResults, isLoading } = useStockSearch(searchQuery, filters);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    const searchFilters = { ...filters, page: 1 };
    setFilters(searchFilters);
    setHasSearched(true);
  }, [filters]);

  // Accept an optional opts param that signals special actions (like reset).
  const handleFilterChange = useCallback((newFilters: FilterOptions, opts?: { reset?: boolean }) => {
    if (opts?.reset) {
      // Explicit reset from child: accept the incoming filters fully so
      // sortBy/sortOrder are reset back to defaults.
      setFilters(newFilters);
      return;
    }

    // Normal filter updates: preserve existing sort settings so applying/removing
    // filters does not reset sortBy/sortOrder. Force the previous sort values
    // after spreading newFilters so child-sent defaults can't overwrite user sort.
    setFilters(prev => ({
      ...newFilters,
      sortBy: prev.sortBy,
      sortOrder: prev.sortOrder,
    } as FilterOptions));
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    const updatedFilters = { ...filters, page: newPage };
    setFilters(updatedFilters);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [filters]);

  const handleGoToPage = () => {
    const pageNum = parseInt(pageInputValue, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && searchResults && pageNum <= searchResults.total_pages) {
      handlePageChange(pageNum);
      setPageInputValue('');
    }
  };

  const handlePageInputKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleGoToPage();
    }
  };

  const handleSort = useCallback((columnName: string) => {
    const apiField = COLUMN_TO_API_FIELD[columnName];
    if (!apiField) return;

    const newSortOrder: 'ASC' | 'DESC' =
      filters.sortBy === apiField && filters.sortOrder === 'ASC' ? 'DESC' : 'ASC';

    const updatedFilters = {
      ...filters,
      sortBy: apiField,
      sortOrder: newSortOrder,
      page: 1,
    };

    setFilters(updatedFilters);
    // rely on useStockSearch to refetch when `filters` changes
  }, [filters]);

  const handlePageSizeChange = useCallback((pageSize: number) => {
    const updatedFilters = { ...filters, pageSize, page: 1 };
    setFilters(updatedFilters);
  }, [filters]);

  return (
    <div className="landing-page">
      <header className="landing-hero" role="banner">
        <h1 className="landing-title">Market Ease</h1>
        <p className="landing-subtitle">
          Search and discover real-time stock information with powerful filters
        </p>
      </header>

      <div className="landing-search-section">
        <div className="search-and-filters">
          <SearchBar onSearch={handleSearch} />
          <Filters onFilterChange={handleFilterChange} />
        </div>
      </div>

      <div className="landing-content">
        <main className="landing-main" role="main">
          {isLoading ? (
            <Loading message="Loading results..." />
          ) : searchResults ? (
            <section className="search-results" aria-labelledby="results-heading">
              <div className="results-header">
                <h2 id="results-heading" className="heading-lg">
                  {hasSearched ? 'Search Results' : 'Stock Listings'}
                </h2>
                <p className="results-count">
                  Showing {searchResults.stocks.length > 0 ?
                    ((searchResults.page - 1) * searchResults.pageSize + 1) : 0} -{' '}
                  {Math.min(searchResults.page * searchResults.pageSize, searchResults.total)} of{' '}
                  {searchResults.total} results
                </p>
              </div>

              {searchResults.stocks.length > 0 ? (
                <>
                  <div className="table-with-pagination">
                    <TickerSummaryTable
                      stocks={searchResults.stocks}
                      filters={filters}
                      onSort={handleSort}
                      onPageSizeChange={handlePageSizeChange}
                    />

                    {searchResults.total_pages > 1 && (
                      <Pagination
                        searchResults={searchResults}
                        handlePageChange={handlePageChange}
                        pageInputValue={pageInputValue}
                        setPageInputValue={setPageInputValue}
                        handleGoToPage={handleGoToPage}
                        handlePageInputKeyPress={handlePageInputKeyPress}
                      />
                    )}
                  </div>
                </>
              ) : (
                <div className="no-results">
                  <p>No stocks found matching your criteria.</p>
                  <p>Try adjusting your filters or search query.</p>
                </div>
              )}
            </section>
          ) : (
            <div className="welcome-section">
              <h2>Welcome to Market Ease</h2>
              <p>
                Use the search bar above to find stocks by symbol or company name.
                Apply filters on the left to narrow down your search.
              </p>
              <div className="features-grid">
                <div className="feature-card">
                  <div className="feature-icon">🔍</div>
                  <h3>Smart Search</h3>
                  <p>Real-time autocomplete powered by debouncing for efficient searches</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">📊</div>
                  <h3>Advanced Filters</h3>
                  <p>Filter stocks by P/E ratio, dividend yield, market cap, and more</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">🔐</div>
                  <h3>Secure Auth</h3>
                  <p>Protected with NeonDB authentication for personalized experience</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">⚡</div>
                  <h3>Fast & Reliable</h3>
                  <p>Built with React and TypeScript for optimal performance</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Landing;
