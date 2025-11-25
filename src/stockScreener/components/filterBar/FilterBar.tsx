import type { FC } from 'react';
import { useState, useCallback } from 'react';
import { FILTER_DEFAULTS, MARKET_CAP_RANGES } from '../../../config/constants';
import type { FilterOptions, FilterChangeHandler } from './types';
import RangeFilter from './components/RangeFilter';
import MarketCapFilter from './components/MarketCapFilter';
import './FilterBar.css';

const getAppliedFiltersCount = (filters: FilterOptions): number => {
  let count = 0;
  const filterKeys: Array<keyof FilterOptions> = [
    'minPreviousClose',
    'maxPreviousClose',
    'minPe',
    'maxPe',
    'minForwardPe',
    'maxForwardPe',
    'minDividendYield',
    'maxDividendYield',
    'minAnnualDividendGrowth',
    'maxAnnualDividendGrowth',
    'minMarketCap',
    'maxMarketCap',
    'minPayoutRatio',
    'maxPayoutRatio',
  ];

  filterKeys.forEach(key => {
    if (filters[key] !== undefined) {
      count++;
    }
  });

  if (filters.marketCapCategories && filters.marketCapCategories.length > 0) {
    count++;
  }

  return count;
};

const getDirtyFilterTypesCount = (dirtyFilters: Set<keyof FilterOptions>): number => {
  const filterTypeMap = new Map<string, boolean>();

  dirtyFilters.forEach(field => {
    let filterType = '';
    if (field.includes('PreviousClose')) filterType = 'price';
    else if (field.includes('Pe') && !field.includes('Forward')) filterType = 'pe';
    else if (field.includes('ForwardPe')) filterType = 'forwardPe';
    else if (field.includes('DividendYield')) filterType = 'dividend';
    else if (field.includes('DividendGrowth')) filterType = 'dividendGrowth';
    else if (field.includes('MarketCap')) filterType = 'marketCap';
    else if (field.includes('Payout')) filterType = 'payout';

    if (filterType) {
      filterTypeMap.set(filterType, true);
    }
  });

  return filterTypeMap.size;
};

interface FiltersProps {
  // second argument signals special intent (reset)
  onFilterChange: FilterChangeHandler;
}

const Filters: FC<FiltersProps> = ({ onFilterChange }) => {
  const [appliedFilters, setAppliedFilters] = useState<FilterOptions>(FILTER_DEFAULTS);
  const [pendingFilters, setPendingFilters] = useState<FilterOptions>(FILTER_DEFAULTS);
  const [dirtyFilters, setDirtyFilters] = useState<Set<keyof FilterOptions>>(new Set());
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [resetCounter, setResetCounter] = useState(0);

  const handlePendingFilterUpdate = useCallback((key: keyof FilterOptions, value: unknown) => {
    setPendingFilters(prev => ({ ...prev, [key]: value }));

    setDirtyFilters(prev => {
      const newDirty = new Set(prev);
      if (appliedFilters[key] !== value) {
        newDirty.add(key);
      } else {
        newDirty.delete(key);
      }
      return newDirty;
    });
  }, [appliedFilters]);

  const handleApplyRangeFilter = useCallback(
    (
      minKey: keyof FilterOptions,
      maxKey: keyof FilterOptions,
      minValue?: number,
      maxValue?: number
    ) => {
      // build the updated filters object from the latest appliedFilters state
      const updated: FilterOptions = {
        ...appliedFilters,
        [minKey]: minValue,
        [maxKey]: maxValue,
        page: 1,
      } as FilterOptions;

      // update local state
      setAppliedFilters(updated);
      setPendingFilters(prev => ({ ...prev, [minKey]: minValue, [maxKey]: maxValue }));

      // update dirty set synchronously
      setDirtyFilters(prev => {
        const newDirty = new Set(prev);
        newDirty.delete(minKey);
        newDirty.delete(maxKey);
        return newDirty;
      });

      // close the dropdown and blur any focused inputs so UI is unfocused before parent update
      setOpenFilter(null);
      try {
        (document.activeElement as HTMLElement | null)?.blur();
      } catch (e) {
        // ignore in non-browser environments
      }

      // call parent filter change async to avoid setState during render of another component
      Promise.resolve().then(() => onFilterChange(updated));
    },
    [onFilterChange, appliedFilters]
  );

  const handleApplyAll = useCallback(() => {
    setAppliedFilters(pendingFilters);
    setDirtyFilters(new Set());
    // close any open filter dropdowns and remove focus from inputs
    setOpenFilter(null);
    try {
      // blur active element (if any input inside a RangeFilter is focused)
      (document.activeElement as HTMLElement | null)?.blur();
    } catch (e) {
      // ignore in non-browser environments
    }
    // call parent filter change asynchronously to avoid setState-in-render
    Promise.resolve().then(() => onFilterChange(pendingFilters));
  }, [pendingFilters, onFilterChange]);

  const handleReset = useCallback(() => {
    setAppliedFilters(FILTER_DEFAULTS);
    setPendingFilters(FILTER_DEFAULTS);
    setDirtyFilters(new Set());
    setOpenFilter(null);
    // bump a counter so children can clear their internal pending inputs
    setResetCounter(c => c + 1);
  // call parent update asynchronously to avoid setState during child render
  // signal this is an explicit reset so parent can choose to reset sort
  Promise.resolve().then(() => onFilterChange(FILTER_DEFAULTS, { reset: true }));
  }, [onFilterChange]);

  const handleFilterToggle = useCallback((filterKey: string) => {
    setOpenFilter(current => current === filterKey ? null : filterKey);
  }, []);

  const handleApplyMarketCapCategories = useCallback((categories: string[]) => {
    // Convert categories to min/max market cap ranges
    // For multiple categories, we want the overall min and max across all selections
    let minMarketCap: number | undefined = undefined;
    let maxMarketCap: number | undefined = undefined;

    if (categories.length > 0) {
      const allValues: number[] = [];

      categories.forEach(category => {
        const range = MARKET_CAP_RANGES[category as keyof typeof MARKET_CAP_RANGES];
        if (range) {
          if (range.min !== undefined) allValues.push(range.min);
          if (range.max !== undefined) allValues.push(range.max);
        }
      });

      // Get the absolute min and max across all selected categories
      if (allValues.length > 0) {
        minMarketCap = Math.min(...allValues);
        maxMarketCap = Math.max(...allValues);
      }

      // Handle edge case: if a category has no min (like Nano Cap), set minMarketCap to undefined
      const hasOpenLowerBound = categories.some(cat => {
        const range = MARKET_CAP_RANGES[cat as keyof typeof MARKET_CAP_RANGES];
        return range && range.min === undefined;
      });
      if (hasOpenLowerBound) {
        minMarketCap = undefined;
      }

      // Handle edge case: if a category has no max (like Mega Cap), set maxMarketCap to undefined
      const hasOpenUpperBound = categories.some(cat => {
        const range = MARKET_CAP_RANGES[cat as keyof typeof MARKET_CAP_RANGES];
        return range && range.max === undefined;
      });
      if (hasOpenUpperBound) {
        maxMarketCap = undefined;
      }
    }

    const updated: FilterOptions = {
      ...appliedFilters,
      marketCapCategories: categories,
      minMarketCap,
      maxMarketCap,
      page: 1,
    } as FilterOptions;

    setAppliedFilters(updated);
    setPendingFilters(prev => ({
      ...prev,
      marketCapCategories: categories,
      minMarketCap,
      maxMarketCap,
    }));

    setDirtyFilters(prev => {
      const newDirty = new Set(prev);
      newDirty.delete('marketCapCategories');
      newDirty.delete('minMarketCap');
      newDirty.delete('maxMarketCap');
      return newDirty;
    });

    setOpenFilter(null);
    try {
      (document.activeElement as HTMLElement | null)?.blur();
    } catch (e) {
      // ignore in non-browser environments
    }

    Promise.resolve().then(() => onFilterChange(updated));
  }, [onFilterChange, appliedFilters]);

  const handlePendingMarketCapCategories = useCallback((categories: string[]) => {
    setPendingFilters(prev => ({ ...prev, marketCapCategories: categories }));

    setDirtyFilters(prev => {
      const newDirty = new Set(prev);
      const currentCategories = appliedFilters.marketCapCategories || [];
      if (JSON.stringify([...categories].sort()) !== JSON.stringify([...currentCategories].sort())) {
        newDirty.add('marketCapCategories');
      } else {
        newDirty.delete('marketCapCategories');
      }
      return newDirty;
    });
  }, [appliedFilters]);

  // number of individual dirty filter fields (min/max keys)
  const dirtyCount = dirtyFilters.size;
  const hasDirtyFilters = dirtyCount > 0;
  const appliedCount = getAppliedFiltersCount(appliedFilters);

  return (
    <div className="filters-container">

      {/* badge moved into actions so it appears next to Reset */}

      <div className="filters-row">
        <RangeFilter
          resetSignal={resetCounter}
          filterKey="price"
          label="Price"
          minKey="minPreviousClose"
          maxKey="maxPreviousClose"
          appliedMinValue={appliedFilters.minPreviousClose}
          appliedMaxValue={appliedFilters.maxPreviousClose}
          isOpen={openFilter === 'price'}
          onToggle={() => handleFilterToggle('price')}
          onApply={(minValue, maxValue) =>
            handleApplyRangeFilter('minPreviousClose', 'maxPreviousClose', minValue, maxValue)
          }
          onPendingChange={(minValue, maxValue) => {
            handlePendingFilterUpdate('minPreviousClose', minValue);
            handlePendingFilterUpdate('maxPreviousClose', maxValue);
          }}
          title="Previous Close Price"
          minPlaceholder="Min"
          maxPlaceholder="Max"
        />

        <MarketCapFilter
          resetSignal={resetCounter}
          appliedCategories={appliedFilters.marketCapCategories || []}
          isOpen={openFilter === 'marketCap'}
          onToggle={() => handleFilterToggle('marketCap')}
          onApply={handleApplyMarketCapCategories}
          onPendingChange={handlePendingMarketCapCategories}
        />

        <RangeFilter
          resetSignal={resetCounter}
          filterKey="pe"
          label="P/E"
          minKey="minPe"
          maxKey="maxPe"
          appliedMinValue={appliedFilters.minPe}
          appliedMaxValue={appliedFilters.maxPe}
          isOpen={openFilter === 'pe'}
          onToggle={() => handleFilterToggle('pe')}
          onApply={(minValue, maxValue) => handleApplyRangeFilter('minPe', 'maxPe', minValue, maxValue)}
          onPendingChange={(minValue, maxValue) => {
            handlePendingFilterUpdate('minPe', minValue);
            handlePendingFilterUpdate('maxPe', maxValue);
          }}
          title="P/E Ratio"
          minPlaceholder="Min P/E"
          maxPlaceholder="Max P/E"
          allowNegative={true}
        />

        <RangeFilter
          resetSignal={resetCounter}
          filterKey="forwardPe"
          label="Forward P/E"
          minKey="minForwardPe"
          maxKey="maxForwardPe"
          appliedMinValue={appliedFilters.minForwardPe}
          appliedMaxValue={appliedFilters.maxForwardPe}
          isOpen={openFilter === 'forwardPe'}
          onToggle={() => handleFilterToggle('forwardPe')}
          onApply={(minValue, maxValue) =>
            handleApplyRangeFilter('minForwardPe', 'maxForwardPe', minValue, maxValue)
          }
          onPendingChange={(minValue, maxValue) => {
            handlePendingFilterUpdate('minForwardPe', minValue);
            handlePendingFilterUpdate('maxForwardPe', maxValue);
          }}
          title="Forward P/E Ratio"
          minPlaceholder="Min Forward P/E"
          maxPlaceholder="Max Forward P/E"
          allowNegative={true}
        />

        <RangeFilter
          resetSignal={resetCounter}
          filterKey="dividend"
          label="Dividend"
          minKey="minDividendYield"
          maxKey="maxDividendYield"
          appliedMinValue={appliedFilters.minDividendYield}
          appliedMaxValue={appliedFilters.maxDividendYield}
          isOpen={openFilter === 'dividend'}
          onToggle={() => handleFilterToggle('dividend')}
          onApply={(minValue, maxValue) =>
            handleApplyRangeFilter('minDividendYield', 'maxDividendYield', minValue, maxValue)
          }
          onPendingChange={(minValue, maxValue) => {
            handlePendingFilterUpdate('minDividendYield', minValue);
            handlePendingFilterUpdate('maxDividendYield', maxValue);
          }}
          title="Dividend Yield (%)"
          minPlaceholder="Min %"
          maxPlaceholder="Max %"
          step={0.01}
        />

        <RangeFilter
          resetSignal={resetCounter}
          filterKey="dividendGrowth"
          label="Dividend Growth"
          minKey="minAnnualDividendGrowth"
          maxKey="maxAnnualDividendGrowth"
          appliedMinValue={appliedFilters.minAnnualDividendGrowth}
          appliedMaxValue={appliedFilters.maxAnnualDividendGrowth}
          isOpen={openFilter === 'dividendGrowth'}
          onToggle={() => handleFilterToggle('dividendGrowth')}
          onApply={(minValue, maxValue) =>
            handleApplyRangeFilter('minAnnualDividendGrowth', 'maxAnnualDividendGrowth', minValue, maxValue)
          }
          onPendingChange={(minValue, maxValue) => {
            handlePendingFilterUpdate('minAnnualDividendGrowth', minValue);
            handlePendingFilterUpdate('maxAnnualDividendGrowth', maxValue);
          }}
          title="Annual Dividend Growth (%)"
          minPlaceholder="Min %"
          maxPlaceholder="Max %"
          step={0.01}
          allowNegative={true}
        />

        <RangeFilter
          resetSignal={resetCounter}
          filterKey="payout"
          label="Payout"
          minKey="minPayoutRatio"
          maxKey="maxPayoutRatio"
          appliedMinValue={appliedFilters.minPayoutRatio}
          appliedMaxValue={appliedFilters.maxPayoutRatio}
          isOpen={openFilter === 'payout'}
          onToggle={() => handleFilterToggle('payout')}
          onApply={(minValue, maxValue) =>
            handleApplyRangeFilter('minPayoutRatio', 'maxPayoutRatio', minValue, maxValue)
          }
          onPendingChange={(minValue, maxValue) => {
            handlePendingFilterUpdate('minPayoutRatio', minValue);
            handlePendingFilterUpdate('maxPayoutRatio', maxValue);
          }}
          title="Payout Ratio (%)"
          minPlaceholder="Min %"
          maxPlaceholder="Max %"
          step={0.01}
        />

        <div className="filters-actions">
          {hasDirtyFilters && (
            <button
              className="apply-all-button"
              onClick={handleApplyAll}
              title="Apply all pending filter changes"
            >
              Apply All
              <span className="badge-count">{dirtyCount}</span>
            </button>
          )}
          {appliedCount > 0 && (
            <span className="filters-badge action-badge">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-funnel-fill" viewBox="0 0 16 16">
                <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5z"/>
              </svg>
              <span className="badge-count">{appliedCount}</span>
            </span>
          )}
          <button
            className="filter-reset-button"
            onClick={handleReset}
            disabled={appliedCount === 0 && !hasDirtyFilters}
            title={appliedCount === 0 && !hasDirtyFilters ? 'No filters to reset' : 'Reset'}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filters;
