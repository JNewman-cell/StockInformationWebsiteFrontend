import type { FC, FormEvent, ChangeEvent } from 'react';
import type { KeyboardEvent } from 'react';
import { useState, useEffect, useRef, memo } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import { useStockAutocomplete } from '../../../hooks/useStockQueries';
import { API_CONFIG } from '../../../config/constants';
import type { StockSuggestion } from '../../../types';
import './SearchBar.css';

const SuggestionItem = memo(({
  suggestion,
  onClick,
}: {
  suggestion: StockSuggestion;
  onClick: (suggestion: StockSuggestion) => void;
}) => (
  <div className="suggestion-item" onClick={() => onClick(suggestion)}>
    <span className="suggestion-symbol">{suggestion.symbol}</span>
    <span className="suggestion-name">{suggestion.name}</span>
  </div>
));

SuggestionItem.displayName = 'SuggestionItem';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBar: FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Search for stocks...',
}) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionSelected, setSuggestionSelected] = useState(false);
  const debouncedQuery = useDebounce(query, API_CONFIG.DEBOUNCE_DELAY);
  const searchRef = useRef<HTMLDivElement>(null);
  // When the user manually clears the input we want to prevent the
  // autocomplete suggestions from opening for the stale debounced value.
  // Use a ref flag to ignore the next debounced update after a manual clear.
  const ignoreNextDebouncedShow = useRef(false);

  const { data: suggestions = [], isLoading } = useStockAutocomplete(
    debouncedQuery,
    debouncedQuery.trim().length >= API_CONFIG.AUTOCOMPLETE_MIN_LENGTH
  );

  useEffect(() => {
    if (debouncedQuery.trim().length > 0 && !suggestionSelected && !ignoreNextDebouncedShow.current) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }

    // If the debounced query has settled to empty, stop ignoring future shows
    if (debouncedQuery.trim().length === 0) {
      ignoreNextDebouncedShow.current = false;
    }
  }, [debouncedQuery, suggestionSelected]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setQuery(value);
    setSuggestionSelected(false);
  };

  // Handle keyboard events on the input (Escape clears the input)
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape' && query) {
      e.preventDefault();
      // clear and trigger a search with an empty query so parent can react
      // prevent the stale debounced value from opening suggestions
      ignoreNextDebouncedShow.current = true;
      setQuery('');
      setSuggestionSelected(false);
      handleSearch('');
    }
  };

  const handleSearch = (searchQuery: string) => {
    onSearch(searchQuery);
    setShowSuggestions(false);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      handleSearch(query);
    }
  };

  const handleSuggestionClick = (suggestion: StockSuggestion) => {
    setQuery(`${suggestion.symbol}`);
    handleSearch(suggestion.symbol);
    setShowSuggestions(false);
    setSuggestionSelected(true);
  };

  return (
    <div className="search-bar-container" ref={searchRef}>
      <form onSubmit={handleSubmit} className="search-form">
        <div className="input-wrapper">
          <span className="input-icon" aria-hidden="true">
            {/* Bootstrap search icon (inline SVG) */}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85zm-5.242 1.11a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"/>
            </svg>
          </span>
          <input
            type="text"
            className="search-input with-icon"
            placeholder={placeholder}
            value={query}
            onChange={handleInputChange}
            onFocus={() => {
              if (query.trim().length > 0) {
                setSuggestionSelected(false);
                setShowSuggestions(true);
              }
            }}
            onKeyDown={handleKeyDown}
          />

          {/* Clear / X button shown when there's text in the input */}
          {query && (
            <button
              type="button"
              className="clear-button"
              aria-label="Clear search"
              onClick={() => {
                // Prevent the stale debounced value from opening suggestions
                ignoreNextDebouncedShow.current = true;
                // Clear without focusing the input (autocomplete depends on focus)
                setQuery('');
                setSuggestionSelected(false);
                // trigger an empty search so parent updates to 'no query' state
                handleSearch('');
              }}
            >
              {/* Bootstrap 'x' icon (inline SVG) */}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
              </svg>
            </button>
          )}

          {showSuggestions && (
            <div className="suggestions-dropdown">
              {isLoading ? (
                <div className="suggestion-item loading">Loading...</div>
              ) : suggestions.length > 0 ? (
                suggestions.map((suggestion) => (
                  <SuggestionItem
                    key={suggestion.symbol}
                    suggestion={suggestion}
                    onClick={handleSuggestionClick}
                  />
                ))
              ) : debouncedQuery.trim().length > 0 ? (
                <div className="suggestion-item no-results">No results found</div>
              ) : null}
            </div>
          )}
        </div>

        <button type="submit" className="search-button apply-filter-button">
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
