export interface StockDetailsSummary {
  previousClose?: number;
  companyName?: string;
  valuation: {
    marketCap: number;
    peRatio: number;
    forwardPeRatio: number;
    enterpriseToEbitda: number;
    priceToBook: number;
    fiftyDayAverage: {
      movingAverage: number;
      percentChangeFromPreviousClose: number;
    };
    twoHundredDayAverage: {
      movingAverage: number;
      percentChangeFromPreviousClose: number;
    };
  };
  margin: {
    grossMargin: number;
    operatingMargin: number;
    profitMargin: number;
    ebitdaMargin?: number;
  };
  growth: {
    earningsGrowth: number;
    forwardEarningsGrowth: number;
    revenueGrowth: number;
    trailingEps: number;
    forwardEps: number;
    peg: number;
  };
  dividend: {
    dividendYield: number;
    payoutRatio: number;
  };
}
