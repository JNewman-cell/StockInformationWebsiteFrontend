import type { FC } from 'react';
import type { FilterOptions } from '../filterBar/types';

interface ColumnsProps {
  filters: FilterOptions;
  onSort: (columnName: string) => void;
}

const Columns: FC<ColumnsProps> = ({ filters, onSort }) => {
  return (
    <thead>
      <tr>
        <th
          className={`sortable-header ${filters.sortBy === 'ticker' ? 'sorted' : ''}`}
          scope="col"
          role="columnheader"
          aria-sort={
            filters.sortBy === 'ticker' ?
              (filters.sortOrder === 'ASC' ? 'ascending' : 'descending') :
              'none'
          }
          onClick={() => onSort('Symbol')}
        >
          Symbol {filters.sortBy === 'ticker' ? (filters.sortOrder === 'ASC' ? <i className="bi bi-arrow-up-short" /> : <i className="bi bi-arrow-down-short" />) : <i className="bi bi-arrow-down-up" />}
        </th>
        <th
          className={`sortable-header ${filters.sortBy === 'company_name' ? 'sorted' : ''}`}
          scope="col"
          role="columnheader"
          aria-sort={
            filters.sortBy === 'company_name' ?
              (filters.sortOrder === 'ASC' ? 'ascending' : 'descending') :
              'none'
          }
          onClick={() => onSort('Name')}
        >
          Name {filters.sortBy === 'company_name' ? (filters.sortOrder === 'ASC' ? <i className="bi bi-arrow-up-short" /> : <i className="bi bi-arrow-down-short" />) : <i className="bi bi-arrow-down-up" />}
        </th>
        <th
          className={`sortable-header ${filters.sortBy === 'market_cap' ? 'sorted' : ''}`}
          scope="col"
          role="columnheader"
          aria-sort={
            filters.sortBy === 'market_cap' ?
              (filters.sortOrder === 'ASC' ? 'ascending' : 'descending') :
              'none'
          }
          onClick={() => onSort('Market Cap')}
        >
          Market Cap {filters.sortBy === 'market_cap' ? (filters.sortOrder === 'ASC' ? <i className="bi bi-arrow-up-short" /> : <i className="bi bi-arrow-down-short" />) : <i className="bi bi-arrow-down-up" />}
        </th>
        <th
          className={`sortable-header ${filters.sortBy === 'previous_close' ? 'sorted' : ''}`}
          scope="col"
          role="columnheader"
          aria-sort={
            filters.sortBy === 'previous_close' ?
              (filters.sortOrder === 'ASC' ? 'ascending' : 'descending') :
              'none'
          }
          onClick={() => onSort('Previous Close')}
        >
          Previous Close{' '}
          {filters.sortBy === 'previous_close' ? (filters.sortOrder === 'ASC' ? <i className="bi bi-arrow-up-short" /> : <i className="bi bi-arrow-down-short" />) : <i className="bi bi-arrow-down-up" />}
        </th>
        <th>50-Day Avg</th>
        <th>200-Day Avg</th>
        <th
          className={`sortable-header ${filters.sortBy === 'pe' ? 'sorted' : ''}`}
          scope="col"
          role="columnheader"
          aria-sort={
            filters.sortBy === 'pe' ?
              (filters.sortOrder === 'ASC' ? 'ascending' : 'descending') :
              'none'
          }
          onClick={() => onSort('P/E Ratio')}
        >
          P/E Ratio {filters.sortBy === 'pe' ? (filters.sortOrder === 'ASC' ? <i className="bi bi-arrow-up-short" /> : <i className="bi bi-arrow-down-short" />) : <i className="bi bi-arrow-down-up" />}
        </th>
        <th
          className={`sortable-header ${filters.sortBy === 'forward_pe' ? 'sorted' : ''}`}
          scope="col"
          role="columnheader"
          aria-sort={
            filters.sortBy === 'forward_pe' ?
              (filters.sortOrder === 'ASC' ? 'ascending' : 'descending') :
              'none'
          }
          onClick={() => onSort('Forward P/E')}
        >
          Forward P/E {filters.sortBy === 'forward_pe' ? (filters.sortOrder === 'ASC' ? <i className="bi bi-arrow-up-short" /> : <i className="bi bi-arrow-down-short" />) : <i className="bi bi-arrow-down-up" />}
        </th>
        <th
          className={`sortable-header ${filters.sortBy === 'dividend_yield' ? 'sorted' : ''}`}
          scope="col"
          role="columnheader"
          aria-sort={
            filters.sortBy === 'dividend_yield' ?
              (filters.sortOrder === 'ASC' ? 'ascending' : 'descending') :
              'none'
          }
          onClick={() => onSort('Dividend Yield')}
        >
          Dividend Yield{' '}
          {filters.sortBy === 'dividend_yield' ? (filters.sortOrder === 'ASC' ? <i className="bi bi-arrow-up-short" /> : <i className="bi bi-arrow-down-short" />) : <i className="bi bi-arrow-down-up" />}
        </th>
        <th
          className={`sortable-header ${filters.sortBy === 'payout_ratio' ? 'sorted' : ''}`}
          scope="col"
          role="columnheader"
          aria-sort={
            filters.sortBy === 'payout_ratio' ?
              (filters.sortOrder === 'ASC' ? 'ascending' : 'descending') :
              'none'
          }
          onClick={() => onSort('Payout Ratio')}
        >
          Payout Ratio {filters.sortBy === 'payout_ratio' ? (filters.sortOrder === 'ASC' ? <i className="bi bi-arrow-up-short" /> : <i className="bi bi-arrow-down-short" />) : <i className="bi bi-arrow-down-up" />}
        </th>
        
      </tr>
    </thead>
  );
};

export default Columns;
