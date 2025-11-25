import type { FC, ReactNode } from 'react';
import { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import type { FilterOptions } from '../types';
import './RangeFilter.css';

const getAppliedFilterCount = (minValue: number | undefined, maxValue: number | undefined): number => {
  let count = 0;
  if (minValue !== undefined) count++;
  if (maxValue !== undefined) count++;
  return count;
};

interface RangeFilterProps {
  filterKey: string;
  label: string;
  minKey: keyof FilterOptions;
  maxKey: keyof FilterOptions;
  appliedMinValue?: number;
  appliedMaxValue?: number;
  isOpen: boolean;
  onToggle: () => void;
  onApply: (minValue?: number, maxValue?: number) => void;
  onPendingChange?: (minValue?: number, maxValue?: number) => void;
  minPlaceholder?: string;
  maxPlaceholder?: string;
  step?: number;
  title?: string;
  allowNegative?: boolean;
  renderErrorMessages?: (errors: Record<string, string>) => ReactNode;
  resetSignal?: number;
}

const RangeFilter: FC<RangeFilterProps> = ({
  filterKey,
  label,
  minKey,
  maxKey,
  appliedMinValue,
  appliedMaxValue,
  isOpen,
  onToggle,
  onApply,
  onPendingChange,
  minPlaceholder = 'Min',
  maxPlaceholder = 'Max',
  step,
  title,
  allowNegative = false,
  renderErrorMessages,
  resetSignal,
}) => {
  const [pendingMinValue, setPendingMinValue] = useState<number | undefined>(appliedMinValue);
  const [pendingMaxValue, setPendingMaxValue] = useState<number | undefined>(appliedMaxValue);
  

  useEffect(() => {
    setPendingMinValue(appliedMinValue);
    setPendingMaxValue(appliedMaxValue);
  }, [appliedMinValue, appliedMaxValue]);

  // Clear pending inputs when parent signals a reset
  useEffect(() => {
    if (typeof resetSignal !== 'undefined') {
      setPendingMinValue(undefined);
      setPendingMaxValue(undefined);
    }
  }, [resetSignal]);

  const handleMinChange = useCallback((value: number | undefined) => {
    setPendingMinValue(value);
    if (onPendingChange) {
      onPendingChange(value, pendingMaxValue);
    }
  }, [onPendingChange, pendingMaxValue]);

  const handleMaxChange = useCallback((value: number | undefined) => {
    setPendingMaxValue(value);
    if (onPendingChange) {
      onPendingChange(pendingMinValue, value);
    }
  }, [onPendingChange, pendingMinValue]);

  const minValue = pendingMinValue;
  const maxValue = pendingMaxValue;
  const hasPendingValues = minValue !== undefined || maxValue !== undefined;
  const hasChanges = hasPendingValues && (
    minValue !== appliedMinValue || maxValue !== appliedMaxValue
  );

  const isPeKey = (k: string) => ['minPe', 'maxPe', 'minForwardPe', 'maxForwardPe'].includes(k);

  const validateValue = useCallback((key: keyof FilterOptions, value: unknown): string | null => {
    if (value === undefined || value === null || value === '') return null;
    if (typeof value !== 'number') return null;

    const num = value as number;

    if (key === 'minDividendYield' || key === 'maxDividendYield' ||
        key === 'minPayoutRatio' || key === 'maxPayoutRatio') {
      if (num < 0 || num > 999.99) return 'Must be between 0.00 and 999.99';
      return null;
    }

    if (isPeKey(key as string)) return null;

    if (!allowNegative && num < 0) return 'Must be a positive number';
    return null;
  }, [allowNegative]);

  const errors = useMemo(() => {
    const result: Record<string, string> = {};

    const minErr = validateValue(minKey, minValue);
    const maxErr = validateValue(maxKey, maxValue);

    if (minErr) result[minKey as string] = minErr;
    if (maxErr) result[maxKey as string] = maxErr;

    if (typeof minValue === 'number' && typeof maxValue === 'number' && minValue > maxValue) {
      result['range'] = 'Min must be less than or equal to Max';
    }

    return result;
  }, [minKey, maxKey, minValue, maxValue, validateValue]);

  const hasErrors = Object.keys(errors).length > 0;
  const appliedCount = getAppliedFilterCount(minValue, maxValue);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Close the dropdown when clicking/tapping outside the component
  useEffect(() => {
    if (!isOpen) return;

    const handleOutside = (e: Event) => {
      const target = e.target as Node | null;
      if (containerRef.current && target && !containerRef.current.contains(target)) {
        onToggle();
      }
    };

    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);

    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
    };
  }, [isOpen, onToggle]);

  return (
  <div className="filter-dropdown-container" ref={containerRef}>
      <button
        className={`filter-dropdown-button ${hasPendingValues ? 'dirty' : ''} ${appliedCount > 0 ? 'active' : ''}`}
        onClick={onToggle}
      >
        <span className="filter-label-with-badge">
          <span className="label-text">{label}</span>
          {appliedCount > 0 && (
            <span className="count-badge">{appliedCount}</span>
          )}
          {hasPendingValues && !appliedCount && <span className="dirty-indicator">*</span>}
        </span>
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>
      {isOpen && (
        <div className="filter-dropdown">
          <div className="filter-dropdown-content">
            {title && <h4>{title}</h4>}
            <div className="filter-group">
              <label>{minPlaceholder}</label>
              <input
                type="number"
                placeholder={minPlaceholder}
                value={minValue || ''}
                step={step}
                className={errors[minKey as string] ? 'input-invalid' : ''}
                onChange={(e) => handleMinChange(
                  e.currentTarget.value ? parseFloat(e.currentTarget.value) : undefined
                )}
              />
            </div>
            <div className="filter-group">
              <label>{maxPlaceholder}</label>
              <input
                type="number"
                placeholder={maxPlaceholder}
                step={step}
                value={maxValue || ''}
                className={errors[maxKey as string] ? 'input-invalid' : ''}
                onChange={(e) => handleMaxChange(
                  e.currentTarget.value ? parseFloat(e.currentTarget.value) : undefined
                )}
              />
            </div>
            {hasPendingValues && (
              <>
                {renderErrorMessages ? (
                  renderErrorMessages(errors)
                ) : (
                  <>
                    {errors['range'] && <div className="invalid-message">{errors['range']}</div>}
                    {errors[minKey as string] && (
                      <div className="invalid-message">{errors[minKey as string]}</div>
                    )}
                    {errors[maxKey as string] && (
                      <div className="invalid-message">{errors[maxKey as string]}</div>
                    )}
                  </>
                )}
                <button
                  className="apply-filter-button"
                  disabled={hasErrors || !hasChanges}
                  onClick={() => onApply(pendingMinValue, pendingMaxValue)}
                >
                  Apply {label}
                  <span className="apply-count-badge">{appliedCount}</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RangeFilter;
