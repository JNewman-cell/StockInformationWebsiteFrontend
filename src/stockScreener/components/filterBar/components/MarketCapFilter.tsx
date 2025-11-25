import type { FC, ChangeEvent } from 'react';
import { useState, useEffect, useCallback } from 'react';
import { MARKET_CAP_RANGES } from '../../../../config/constants';
import './MarketCapFilter.css';

interface MarketCapFilterProps {
  resetSignal: number;
  appliedCategories: string[];
  isOpen: boolean;
  onToggle: () => void;
  onApply: (categories: string[]) => void;
  onPendingChange: (categories: string[]) => void;
}

const MarketCapFilter: FC<MarketCapFilterProps> = ({
  resetSignal,
  appliedCategories,
  isOpen,
  onToggle,
  onApply,
  onPendingChange,
}) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(appliedCategories);

  useEffect(() => {
    setSelectedCategories(appliedCategories);
  }, [appliedCategories]);

  useEffect(() => {
    setSelectedCategories([]);
  }, [resetSignal]);

  const handleCheckboxChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const category = e.target.value;
    const newCategories = e.target.checked
      ? [...selectedCategories, category]
      : selectedCategories.filter(c => c !== category);
    
    setSelectedCategories(newCategories);
    onPendingChange(newCategories);
  }, [selectedCategories, onPendingChange]);

  const handleApply = useCallback(() => {
    onApply(selectedCategories);
  }, [selectedCategories, onApply]);

  const handleClear = useCallback(() => {
    setSelectedCategories([]);
    onPendingChange([]);
  }, [onPendingChange]);

  const hasSelection = selectedCategories.length > 0;
  const isDirty = JSON.stringify([...selectedCategories].sort()) !== JSON.stringify([...appliedCategories].sort());

  return (
    <div className="filter-dropdown-wrapper">
      <button
        className={`filter-button ${hasSelection || appliedCategories.length > 0 ? 'active' : ''} ${isOpen ? 'open' : ''}`}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-haspopup="true"
        type="button"
      >
        Market Cap
        {appliedCategories.length > 0 && (
          <span className="filter-badge">{appliedCategories.length}</span>
        )}
        <i className={`bi bi-chevron-${isOpen ? 'up' : 'down'}`} />
      </button>

      {isOpen && (
        <div className="filter-dropdown market-cap-filter">
          <div className="filter-dropdown-header">
            <h3 className="filter-dropdown-title">Market Cap Categories</h3>
          </div>

          <div className="filter-dropdown-content">
            <div className="market-cap-checkboxes">
              {Object.entries(MARKET_CAP_RANGES).map(([key, value]) => (
                <label key={key} className="checkbox-label">
                  <input
                    type="checkbox"
                    value={key}
                    checked={selectedCategories.includes(key)}
                    onChange={handleCheckboxChange}
                  />
                  <span className="checkbox-text">
                    {value.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-dropdown-actions">
            <button
              className="filter-action-button secondary"
              onClick={handleClear}
              disabled={!hasSelection}
              type="button"
            >
              Clear
            </button>
            <button
              className="filter-action-button primary"
              onClick={handleApply}
              disabled={!isDirty}
              type="button"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketCapFilter;
