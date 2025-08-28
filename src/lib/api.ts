import { StockData, ApiResponse } from '@/types/portfolio';

// Mock market data for demonstration purposes
// In a real application, you would use actual API calls to Yahoo Finance and Google Finance
const mockStockData: Record<string, StockData> = {
  'RELIANCE': {
    symbol: 'RELIANCE',
    currentPrice: 2450.75,
    peRatio: 18.5,
    latestEarnings: 125.50
  },
  'TATA': {
    symbol: 'TATA',
    currentPrice: 3850.25,
    peRatio: 25.2,
    latestEarnings: 145.75
  },
  'HDFCBANK': {
    symbol: 'HDFCBANK',
    currentPrice: 1650.50,
    peRatio: 15.8,
    latestEarnings: 95.25
  },
  'INFY': {
    symbol: 'INFY',
    currentPrice: 1450.80,
    peRatio: 22.1,
    latestEarnings: 85.30
  },
  'ICICIBANK': {
    symbol: 'ICICIBANK',
    currentPrice: 950.25,
    peRatio: 16.2,
    latestEarnings: 65.40
  },
  'HINDUNILVR': {
    symbol: 'HINDUNILVR',
    currentPrice: 2850.90,
    peRatio: 28.5,
    latestEarnings: 110.20
  },
  'ITC': {
    symbol: 'ITC',
    currentPrice: 420.75,
    peRatio: 20.1,
    latestEarnings: 25.80
  },
  'SBIN': {
    symbol: 'SBIN',
    currentPrice: 650.40,
    peRatio: 12.5,
    latestEarnings: 45.60
  },
  'BHARTIARTL': {
    symbol: 'BHARTIARTL',
    currentPrice: 1150.30,
    peRatio: 19.8,
    latestEarnings: 75.90
  },
  'AXISBANK': {
    symbol: 'AXISBANK',
    currentPrice: 1050.60,
    peRatio: 14.2,
    latestEarnings: 55.30
  }
};

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Fetch stock data from Yahoo Finance (mock implementation)
export const fetchYahooFinanceData = async (symbol: string): Promise<ApiResponse> => {
  try {
    await delay(500); // Simulate network delay
    
    // In a real implementation, you would make actual API calls
    // const response = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}.NS`);
    
    const stockData = mockStockData[symbol];
    if (!stockData) {
      return {
        success: false,
        error: `Stock data not found for ${symbol}`
      };
    }

    return {
      success: true,
      data: {
        currentPrice: stockData.currentPrice + (Math.random() - 0.5) * 10, // Add some variation
        symbol: stockData.symbol
      }
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to fetch Yahoo Finance data for ${symbol}`
    };
  }
};

// Fetch stock data from Google Finance (mock implementation)
export const fetchGoogleFinanceData = async (symbol: string): Promise<ApiResponse> => {
  try {
    await delay(300); // Simulate network delay
    
    // In a real implementation, you would make actual API calls
    // const response = await axios.get(`https://www.google.com/finance/quote/${symbol}:NSE`);
    
    const stockData = mockStockData[symbol];
    if (!stockData) {
      return {
        success: false,
        error: `Stock data not found for ${symbol}`
      };
    }

    return {
      success: true,
      data: {
        peRatio: stockData.peRatio + (Math.random() - 0.5) * 2, // Add some variation
        latestEarnings: stockData.latestEarnings + (Math.random() - 0.5) * 5, // Add some variation
        symbol: stockData.symbol
      }
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to fetch Google Finance data for ${symbol}`
    };
  }
};

// Fetch comprehensive stock data
export const fetchStockData = async (symbol: string): Promise<StockData | null> => {
  try {
    const [yahooResponse, googleResponse] = await Promise.all([
      fetchYahooFinanceData(symbol),
      fetchGoogleFinanceData(symbol)
    ]);

    if (!yahooResponse.success || !googleResponse.success) {
      // Don't log errors for missing stock data, just return null
      return null;
    }

    return {
      symbol,
      currentPrice: yahooResponse.data.currentPrice,
      peRatio: googleResponse.data.peRatio,
      latestEarnings: googleResponse.data.latestEarnings
    };
  } catch (error) {
    // Don't log errors for missing stock data
    return null;
  }
};
