import type { FC, ChangeEvent } from 'react';
import { useState, useEffect, useCallback, useRef } from 'react';
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
  const prevAppliedRef = useRef<string>(JSON.stringify(appliedCategories.sort()));

  // Only sync when appliedCategories actually changes (after apply or from parent)
  useEffect(() => {
    const currentApplied = JSON.stringify([...appliedCategories].sort());
    if (currentApplied !== prevAppliedRef.current) {
      prevAppliedRef.current = currentApplied;
      setSelectedCategories(appliedCategories);
    }
  }, [appliedCategories]);

  useEffect(() => {
    setSelectedCategories([]);
  }, [resetSignal]);

  const handleCheckboxChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const category = e.target.value;
    const isChecked = e.target.checked;
    
    setSelectedCategories(prev => 
      isChecked
        ? [...prev, category]
        : prev.filter(c => c !== category)
    );
  }, []);

  const handleApply = useCallback(() => {
    onApply(selectedCategories);
  }, [selectedCategories, onApply]);

  const hasSelection = selectedCategories.length > 0;
  const isDirty = JSON.stringify([...selectedCategories].sort()) !== JSON.stringify([...appliedCategories].sort());
  const displayCount = isDirty && hasSelection ? selectedCategories.length : appliedCategories.length;
  const isActive = appliedCategories.length > 0;

  return (
    <div className="filter-dropdown-container">
      <button
        className={`filter-dropdown-button ${isDirty ? 'dirty' : ''} ${isActive ? 'active' : ''}`}
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-haspopup="true"
        type="button"
      >
        <span className="filter-label-with-badge">
          <span className="label-text">Market Cap</span>
          {displayCount > 0 && (
            <span className="count-badge">{displayCount}</span>
          )}
          {isDirty && !hasSelection && <span className="dirty-indicator">*</span>}
        </span>
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="filter-dropdown">
          <div className="filter-dropdown-content">
            <h4>Market Cap Categories</h4>

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

            <button
              className="apply-filter-button"
              onClick={handleApply}
              disabled={!isDirty}
              type="button"
            >
              Apply Market Cap
              {selectedCategories.length > 0 && (
                <span className="apply-count-badge">{selectedCategories.length}</span>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketCapFilter;
