import { Stock } from '@/types/portfolio';

// Sample data structure based on typical portfolio Excel format
// This will be replaced with actual Excel reading logic
export interface ExcelStockData {
  'Particulars': string;
  'Purchase Price': number;
  'Quantity': number;
  'Investment': number;
  'Portfolio (%)': number;
  'NSE/BSE': string;
  'Sector': string;
}

// Mock Excel data - in a real implementation, this would be read from the Excel file
const excelData: ExcelStockData[] = [
  {
    'Particulars': 'Reliance Industries',
    'Purchase Price': 2400,
    'Quantity': 100,
    'Investment': 240000,
    'Portfolio (%)': 15.5,
    'NSE/BSE': 'NSE',
    'Sector': 'Oil & Gas'
  },
  {
    'Particulars': 'Tata Consultancy Services',
    'Purchase Price': 3800,
    'Quantity': 50,
    'Investment': 190000,
    'Portfolio (%)': 12.3,
    'NSE/BSE': 'NSE',
    'Sector': 'Technology'
  },
  {
    'Particulars': 'HDFC Bank',
    'Purchase Price': 1600,
    'Quantity': 100,
    'Investment': 160000,
    'Portfolio (%)': 10.3,
    'NSE/BSE': 'NSE',
    'Sector': 'Financial Services'
  },
  {
    'Particulars': 'Infosys',
    'Purchase Price': 1400,
    'Quantity': 100,
    'Investment': 140000,
    'Portfolio (%)': 9.0,
    'NSE/BSE': 'NSE',
    'Sector': 'Technology'
  },
  {
    'Particulars': 'ICICI Bank',
    'Purchase Price': 900,
    'Quantity': 150,
    'Investment': 135000,
    'Portfolio (%)': 8.7,
    'NSE/BSE': 'NSE',
    'Sector': 'Financial Services'
  },
  {
    'Particulars': 'Hindustan Unilever',
    'Purchase Price': 2800,
    'Quantity': 50,
    'Investment': 140000,
    'Portfolio (%)': 9.0,
    'NSE/BSE': 'NSE',
    'Sector': 'Consumer Goods'
  },
  {
    'Particulars': 'ITC',
    'Purchase Price': 400,
    'Quantity': 300,
    'Investment': 120000,
    'Portfolio (%)': 7.7,
    'NSE/BSE': 'NSE',
    'Sector': 'Consumer Goods'
  },
  {
    'Particulars': 'State Bank of India',
    'Purchase Price': 600,
    'Quantity': 200,
    'Investment': 120000,
    'Portfolio (%)': 7.7,
    'NSE/BSE': 'NSE',
    'Sector': 'Financial Services'
  },
  {
    'Particulars': 'Bharti Airtel',
    'Purchase Price': 1100,
    'Quantity': 100,
    'Investment': 110000,
    'Portfolio (%)': 7.1,
    'NSE/BSE': 'NSE',
    'Sector': 'Telecommunications'
  },
  {
    'Particulars': 'Axis Bank',
    'Purchase Price': 1000,
    'Quantity': 100,
    'Investment': 100000,
    'Portfolio (%)': 6.5,
    'NSE/BSE': 'NSE',
    'Sector': 'Financial Services'
  }
];

// Function to convert Excel data to Stock objects
export const convertExcelDataToStocks = (data: ExcelStockData[]): Omit<Stock, 'currentPrice' | 'presentValue' | 'gainLoss' | 'gainLossPercentage' | 'peRatio' | 'latestEarnings' | 'lastUpdated'>[] => {
  return data.map((row, index) => {
    // Map stock names to proper symbols
    const symbolMap: Record<string, string> = {
      'Reliance Industries': 'RELIANCE',
      'Tata Consultancy Services': 'TATA',
      'HDFC Bank': 'HDFCBANK',
      'Infosys': 'INFY',
      'ICICI Bank': 'ICICIBANK',
      'Hindustan Unilever': 'HINDUNILVR',
      'ITC': 'ITC',
      'State Bank of India': 'SBIN',
      'Bharti Airtel': 'BHARTIARTL',
      'Axis Bank': 'AXISBANK'
    };
    
    const symbol = symbolMap[row['Particulars']] || row['Particulars'].split(' ')[0].toUpperCase();
    
    return {
      id: (index + 1).toString(),
      name: row['Particulars'],
      symbol: symbol,
      exchange: row['NSE/BSE'] as 'NSE' | 'BSE',
      sector: row['Sector'],
      purchasePrice: row['Purchase Price'],
      quantity: row['Quantity'],
      investment: row['Investment'],
      portfolioPercentage: row['Portfolio (%)']
    };
  });
};

// Function to read Excel file (mock implementation)
export const readPortfolioExcel = async (): Promise<ExcelStockData[]> => {
  // In a real implementation, this would use a library like 'xlsx' to read the actual Excel file
  // For now, we'll return the mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(excelData);
    }, 500); // Simulate file reading delay
  });
};

// Function to get initial stocks from Excel
export const getInitialStocksFromExcel = async (): Promise<Omit<Stock, 'currentPrice' | 'presentValue' | 'gainLoss' | 'gainLossPercentage' | 'peRatio' | 'latestEarnings' | 'lastUpdated'>[]> => {
  const excelData = await readPortfolioExcel();
  return convertExcelDataToStocks(excelData);
};
