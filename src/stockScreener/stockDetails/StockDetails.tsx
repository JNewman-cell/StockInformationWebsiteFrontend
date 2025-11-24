import { type FC, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { stockAPI } from '../../services/api';
import Loading from '../../components/Loading';
import StockDetailsSummaryComponent from '../pages/stockDetailsPage/components/stockDetailsSummary/StockDetailsSummary.tsx';
import { formatCurrency } from '../pages/stockDetailsPage/utils.tsx';
import '../pages/stockDetailsPage/StockDetails.css';

const StockDetails: FC = () => {
  const { ticker } = useParams<{ ticker: string }>();
  const navigate = useNavigate();

  // Fetch stock details
  const { data: stockDetails, isLoading, error } = useQuery({
    queryKey: ['stockDetails', ticker],
    queryFn: () => stockAPI.getStockDetails(ticker!),
    enabled: !!ticker,
  });

  // Fetch basic stock info for company name and price
  const { data: stockBasicInfo } = useQuery({
    queryKey: ['stockBasicInfo', ticker],
    queryFn: async () => {
      const response = await stockAPI.searchStocks(ticker!, {});
      return response.content.find(s => s.ticker === ticker);
    },
    enabled: !!ticker,
  });

  useEffect(() => {
    if (!ticker) {
      navigate('/screener');
    }
  }, [ticker, navigate]);

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return <Loading message="Loading stock details..." />;
  }

  if (error || !stockDetails) {
    return (
      <div className="stock-details-error">
        <h2>Error Loading Stock Details</h2>
        <p>Unable to load details for {ticker}. Please try again later.</p>
        <button onClick={handleBack} className="back-button">
          <i className="bi bi-arrow-left" aria-hidden="true" /> Back to Screener
        </button>
      </div>
    );
  }

  // formatCurrency now imported from utils


  const companyName = stockDetails?.companyName || stockBasicInfo?.companyName || 'Company Name';
  const previousClose = stockDetails?.previousClose || stockBasicInfo?.previousClose;

  return (
    <div className="stock-details-container">
      <button onClick={handleBack} className="back-button" aria-label="Go back">
        <i className="bi bi-arrow-left" aria-hidden="true" /> Back to Screener
      </button>

      {/* Header with Ticker, Company Name, and Price */}
      <div className="stock-header-card">
        <div className="stock-header-content">
          <h1 className="stock-ticker">{ticker}</h1>
          <p className="stock-company-name">{companyName}</p>
        </div>
        {previousClose !== undefined && (
          <div className="stock-price">
            <span className="price-label">Previous Close</span>
            <span className="price-value">{formatCurrency(previousClose)}</span>
          </div>
        )}
      </div>

      <StockDetailsSummaryComponent stockDetails={stockDetails} />
    </div>
  );
};

export default StockDetails;
