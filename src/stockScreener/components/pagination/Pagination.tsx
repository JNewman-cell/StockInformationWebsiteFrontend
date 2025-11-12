import type { FC, KeyboardEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import { PAGINATION_CONFIG } from '../../../config/constants';
import './Pagination.css';

interface PaginationProps {
  searchResults: {
    page: number;
    total_pages: number;
  };
  handlePageChange: (page: number) => void;
  pageInputValue: string;
  setPageInputValue: (value: string) => void;
  handleGoToPage: () => void;
  handlePageInputKeyPress: (e: KeyboardEvent<HTMLInputElement>) => void;
}

const Pagination: FC<PaginationProps> = ({
  searchResults,
  handlePageChange,
  pageInputValue,
  setPageInputValue,
  handleGoToPage,
  handlePageInputKeyPress,
}) => {
  // number of page buttons to try to show in the center area between Prev/Next
  const [visiblePageCount, setVisiblePageCount] = useState<number>(PAGINATION_CONFIG.PAGE_RANGE_RADIUS * 2 + 1);

  const buildPageRange = (current: number, total: number, visible = Math.min(visiblePageCount, 7)) => {
    const pages: number[] = [];

    // If total pages less than or equal to visible slots, show all
    if (total <= visible) {
      for (let i = 1; i <= total; i++) pages.push(i);
      return pages;
    }

    // Determine sliding window of pages of size 'visible' centered on current
    const half = Math.floor(visible / 2);
    let start = Math.max(1, current - half);
    let end = start + visible - 1;

    if (end > total) {
      end = total;
      start = end - visible + 1;
    }

    for (let i = start; i <= end; i++) pages.push(i);

    // Prepend first page / gap if not included
    if (start > 1) {
      if (start > 2) pages.unshift(-1);
      pages.unshift(1);
    }

    // Append gap / last page if not included
    if (end < total) {
      if (end < total - 1) pages.push(-1);
      pages.push(total);
    }

    return pages;
  };

  // Measure the available width between the left and right groups and compute
  // how many page buttons can fit. Use ResizeObserver for accuracy.
  const paginationRef = useRef<HTMLDivElement | null>(null);
  const leftRef = useRef<HTMLDivElement | null>(null);
  const rightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = paginationRef.current;
    if (!el) return;

    const updateVisible = () => {
      const leftW = leftRef.current?.offsetWidth || 0;
      const rightW = rightRef.current?.offsetWidth || 0;
      const available = Math.max(0, el.clientWidth - leftW - rightW - 32); // padding/gaps

      // Estimate button width including gap (min-width + paddings/margins)
      const approxButton = 56; // px per page-number
      const maxButtons = Math.max(1, Math.floor(available / approxButton));

      // Use odd count to keep current centered where possible
      const count = maxButtons % 2 === 0 ? Math.max(1, maxButtons - 1) : maxButtons;
      setVisiblePageCount(Math.min(count, 21));
    };

    updateVisible();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateVisible);
      return () => window.removeEventListener('resize', updateVisible);
    }

    const ro = new ResizeObserver(() => updateVisible());
    ro.observe(el);
    if (leftRef.current) ro.observe(leftRef.current);
    if (rightRef.current) ro.observe(rightRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="pagination" aria-label="pagination" ref={paginationRef}>
      <div className="pagination-left">
        <button
          className="pagination-btn"
          onClick={() => handlePageChange(1)}
          disabled={searchResults.page === 1}
          aria-label="First page"
        >
          <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-chevron-double-left" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8.354 1.646a.5.5 0 0 1 0 .708L2.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/><path fillRule="evenodd" d="M12.354 1.646a.5.5 0 0 1 0 .708L6.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/></svg>
          First
        </button>
        <button
          className="pagination-btn"
          onClick={() => handlePageChange(searchResults.page - 1)}
          disabled={searchResults.page === 1}
          aria-label="Previous page"
        >
          <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-chevron-left" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/></svg>
          Prev
        </button>
      </div>

      <div className="pagination-center">
        {buildPageRange(searchResults.page, searchResults.total_pages).map((p, idx) => (
          p === -1 ? (
            <span key={`gap-${idx}`} className="text-muted">…</span>
          ) : (
            <button
              key={p}
              className={`page-number${p === searchResults.page ? ' active' : ''}`}
              onClick={() => handlePageChange(p)}
              aria-current={p === searchResults.page ? 'page' : undefined}
            >
              {p}
            </button>
          )
        ))}
      </div>

      <div className="pagination-right">
        <button
          className="pagination-btn"
          onClick={() => handlePageChange(searchResults.page + 1)}
          disabled={searchResults.page >= searchResults.total_pages}
          aria-label="Next page"
        >
          Next
          <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-chevron-right" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/></svg>
        </button>
        <button
          className="pagination-btn"
          onClick={() => handlePageChange(searchResults.total_pages)}
          disabled={searchResults.page >= searchResults.total_pages}
          aria-label="Last page"
        >
          Last
          <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-chevron-double-right" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708z"/><path fillRule="evenodd" d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708z"/></svg>
        </button>
        <div className="page-input-container">
          <span>Go to:</span>
          <input
            type="number"
            className="page-input"
            min="1"
            max={searchResults.total_pages}
            value={pageInputValue}
            onChange={(e) => setPageInputValue(e.target.value)}
            onKeyPress={handlePageInputKeyPress}
            placeholder="Page"
            aria-label="Go to page"
          />
          <button
            className="go-to-page-btn"
            onClick={handleGoToPage}
            disabled={!pageInputValue}
            aria-label="Go to specified page"
          >
            Go
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
