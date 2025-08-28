export interface Stock {
  id: string;
  name: string;
  symbol: string;
  exchange: 'NSE' | 'BSE';
  sector: string;
  purchasePrice: number;
  quantity: number;
  investment: number;
  portfolioPercentage: number;
  currentPrice: number;
  presentValue: number;
  gainLoss: number;
  gainLossPercentage: number;
  peRatio: number;
  latestEarnings: number;
  lastUpdated: Date;
}

export interface Sector {
  name: string;
  stocks: Stock[];
  totalInvestment: number;
  totalPresentValue: number;
  totalGainLoss: number;
  totalGainLossPercentage: number;
}

export interface Portfolio {
  stocks: Stock[];
  sectors: Sector[];
  totalInvestment: number;
  totalPresentValue: number;
  totalGainLoss: number;
  totalGainLossPercentage: number;
  lastUpdated: Date;
}

export interface StockData {
  symbol: string;
  currentPrice: number;
  peRatio: number;
  latestEarnings: number;
}

export interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}
