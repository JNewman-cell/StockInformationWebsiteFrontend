import { type FC, type ReactNode } from 'react';
import type { StockDetailsSummary } from './types';
import './StockDetailsSummary.css';
import {
  formatCurrency,
  formatNumber,
  formatPercent,
  formatMarketCap,
} from '../../utils.ts';

interface Props {
  stockDetails: StockDetailsSummary;
}

const formatPercentWithArrow = (value?: number, decimals: number = 2): ReactNode => {
  if (value === undefined || value === null) return 'N/A';
  const isPositive = value >= 0;
  const iconClass = isPositive ? 'bi-arrow-up-short' : 'bi-arrow-down-short';
  return (
    <span className={`change ${isPositive ? 'positive' : 'negative'}`}>
      <i className={`bi ${iconClass}`} aria-hidden="true" /> {Math.abs(value).toFixed(decimals)}%
    </span>
  );
};

const StockDetailsSummaryComponent: FC<Props> = ({ stockDetails }) => {
  return (
    <div className="stock-details-card">
      <div className="summary-label">Stock Summary</div>
      <div className="sections-container">
        {/* Valuation Section */}
        <section className="details-section">
          <h2 className="section-title">Valuation</h2>
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Market Cap</span>
              <span className="detail-value">{formatMarketCap(stockDetails.valuation?.marketCap)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">P/E | Forward P/E</span>
              <span className="detail-value pe-combined">
                <span className="pe-now">{formatNumber(stockDetails.valuation?.peRatio)} | {formatNumber(stockDetails.valuation?.forwardPeRatio)}</span>
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Enterprise to EBITDA</span>
              <span className="detail-value">{formatNumber(stockDetails.valuation?.enterpriseToEbitda)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Price to Book</span>
              <span className="detail-value">{formatNumber(stockDetails.valuation?.priceToBook)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">50-Day Moving Average</span>
              <span className="detail-value detail-value-with-change">
                <span className="avg-value">{formatCurrency(stockDetails.valuation?.fiftyDayAverage?.movingAverage)}</span>
                {stockDetails.valuation?.fiftyDayAverage?.percentChangeFromPreviousClose !== undefined && (
                  <span className="avg-change">{formatPercentWithArrow(stockDetails.valuation.fiftyDayAverage.percentChangeFromPreviousClose)}</span>
                )}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">200-Day Moving Average</span>
              <span className="detail-value detail-value-with-change">
                <span className="avg-value">{formatCurrency(stockDetails.valuation?.twoHundredDayAverage?.movingAverage)}</span>
                {stockDetails.valuation?.twoHundredDayAverage?.percentChangeFromPreviousClose !== undefined && (
                  <span className="avg-change">{formatPercentWithArrow(stockDetails.valuation.twoHundredDayAverage.percentChangeFromPreviousClose)}</span>
                )}
              </span>
            </div>
          </div>
        </section>

        {/* Growth Section */}
        <section className="details-section">
          <h2 className="section-title">Growth</h2>
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Revenue Growth (trailing 1 year)</span>
              <span className="detail-value">{formatPercentWithArrow(stockDetails.growth?.revenueGrowth)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Earnings Growth (trailing 1 year)</span>
              <span className="detail-value">{formatPercentWithArrow(stockDetails.growth?.earningsGrowth)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Trailing EPS</span>
              <span className="detail-value">{formatNumber(stockDetails.growth?.trailingEps)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Forward EPS</span>
              <span className="detail-value">{formatNumber(stockDetails.growth?.forwardEps)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Forward Earnings Growth Estimate (1 year)</span>
              <span className="detail-value">{formatPercentWithArrow(stockDetails.growth?.forwardEarningsGrowth)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">PEG Ratio</span>
              <span className="detail-value">{formatNumber(stockDetails.growth?.peg)}</span>
            </div>
          </div>
        </section>

        {/* Margin Section */}
        <section className="details-section">
          <h2 className="section-title">Margins</h2>
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Gross Margin</span>
              <span className="detail-value">{formatPercent(stockDetails.margin?.grossMargin)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Operating Margin</span>
              <span className="detail-value">{formatPercent(stockDetails.margin?.operatingMargin)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Profit Margin</span>
              <span className="detail-value">{formatPercent(stockDetails.margin?.profitMargin)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">EBITDA Margin</span>
              <span className="detail-value">{formatPercent(stockDetails.margin?.ebitdaMargin)}</span>
            </div>
          </div>
        </section>

        {/* Dividend Section */}
        <section className="details-section">
          <h2 className="section-title">Dividend</h2>
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Dividend Yield</span>
              <span className="detail-value">{formatPercent(stockDetails.dividend?.dividendYield)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Payout Ratio</span>
              <span className="detail-value">{formatPercent(stockDetails.dividend?.payoutRatio)}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default StockDetailsSummaryComponent;
