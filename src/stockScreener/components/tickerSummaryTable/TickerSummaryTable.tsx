import type { FC, ChangeEvent, ReactNode } from 'react';
import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import type { Stock } from '../../types/types';
import type { FilterOptions } from '../filterBar/types';
import Columns from './Columns';
import { formatCurrency, formatNumber, formatPercent, formatMarketCap } from './utils/utils';
import { PAGINATION_CONFIG, API_CONFIG } from '../../../config/constants';
import './TickerSummaryTable.css';

const formatDividendGrowth = (value?: number): ReactNode => {
  if (value === undefined || value === null) return 'N/A';
  const isPositive = value >= 0;
  const iconClass = isPositive ? 'bi-arrow-up-short' : 'bi-arrow-down-short';
  return (
    <span className={`dividend-growth ${isPositive ? 'positive' : 'negative'}`}>
      <i className={`bi ${iconClass}`} aria-hidden="true" /> {formatPercent(value)}
    </span>
  );
};

interface TickerSummaryTableProps {
  stocks: Stock[];
  filters: FilterOptions;
  onSort: (columnName: string) => void;
  onPageSizeChange: (pageSize: number) => void;
}

const TickerSummaryTable: FC<TickerSummaryTableProps> = ({
  stocks,
  filters,
  onSort,
  onPageSizeChange,
}) => {
  const handlePageSizeChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    onPageSizeChange(parseInt(e.currentTarget.value));
  }, [onPageSizeChange]);

  return (
    <div className="stocks-table-container">
      <div className="table-controls">
        <div className="table-controls-group">
          <label htmlFor="page-size-select" className="table-control-label">
            Results per page:
          </label>
          <select
            id="page-size-select"
            className="table-control-select"
            value={filters.pageSize || API_CONFIG.DEFAULT_PAGE_SIZE}
            onChange={handlePageSizeChange}
          >
            {PAGINATION_CONFIG.PAGE_SIZE_OPTIONS.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
      </div>

      <table className="stocks-table" role="table" aria-describedby="results-heading">
        <caption className="sr-only">List of stocks and key metrics</caption>
        <Columns filters={filters} onSort={onSort} />
        <tbody>
          {stocks.map((stock: Stock) => (
            <tr key={stock.ticker}>
              <td className="stock-symbol">
                <Link to={`/screener/${stock.ticker}/details`} className="ticker-link">
                  {stock.ticker}
                </Link>
              </td>
              <td className="stock-name">{stock.companyName}</td>
              <td>{formatMarketCap(stock.marketCap)}</td>
              <td>{formatCurrency(stock.previousClose)}</td>
              <td>{formatCurrency(stock.fiftyDayAverage)}</td>
              <td>{formatCurrency(stock.twoHundredDayAverage)}</td>
              <td>{formatNumber(stock.peRatio)}</td>
              <td>{formatNumber(stock.forwardPeRatio)}</td>
              <td>{formatPercent(stock.dividendYield)}</td>
              <td>{formatPercent(stock.payoutRatio)}</td>
              <td>{formatDividendGrowth(stock.annualDividendGrowth)}</td>
              <td>{formatPercent(stock.fiveYearAvgDividendYield)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TickerSummaryTable;
