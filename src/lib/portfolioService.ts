import { Stock, Sector, Portfolio } from '@/types/portfolio';
import { fetchStockData } from './api';
import { getInitialStocksFromExcel } from './excelService';

export class PortfolioService {
  private stocks: Stock[] = [];
  private updateInterval: NodeJS.Timeout | null = null;
  private isInitialized = false;

  constructor() {
    // Don't initialize in constructor, let the caller handle it
  }

  public async initializePortfolio() {
    if (this.isInitialized) return;
    
    try {
      // Get initial stocks from Excel file
      const initialStocks = await getInitialStocksFromExcel();
      
      // Initialize with current market data
      await this.updateStockData(initialStocks);
      
      // Calculate portfolio percentages
      this.calculatePortfolioPercentages();
      
      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing portfolio:', error);
      throw error;
    }
  }

  private async updateStockData(initialStocks: Omit<Stock, 'currentPrice' | 'presentValue' | 'gainLoss' | 'gainLossPercentage' | 'peRatio' | 'latestEarnings' | 'lastUpdated'>[]) {
    const updatedStocks: Stock[] = [];

    for (const stock of initialStocks) {
      const marketData = await fetchStockData(stock.symbol);
      
      if (marketData) {
        const presentValue = marketData.currentPrice * stock.quantity;
        const gainLoss = presentValue - stock.investment;
        const gainLossPercentage = (gainLoss / stock.investment) * 100;

        updatedStocks.push({
          ...stock,
          currentPrice: marketData.currentPrice,
          presentValue,
          gainLoss,
          gainLossPercentage,
          peRatio: marketData.peRatio,
          latestEarnings: marketData.latestEarnings,
          lastUpdated: new Date()
        });
      } else {
        // Fallback to purchase price if market data is unavailable
        updatedStocks.push({
          ...stock,
          currentPrice: stock.purchasePrice,
          presentValue: stock.investment,
          gainLoss: 0,
          gainLossPercentage: 0,
          peRatio: 0,
          latestEarnings: 0,
          lastUpdated: new Date()
        });
      }
    }

    this.stocks = updatedStocks;
  }

  private calculatePortfolioPercentages() {
    const totalInvestment = this.stocks.reduce((sum, stock) => sum + stock.investment, 0);
    
    this.stocks = this.stocks.map(stock => ({
      ...stock,
      portfolioPercentage: (stock.investment / totalInvestment) * 100
    }));
  }

  public getPortfolio(): Portfolio {
    if (!this.isInitialized) {
      throw new Error('Portfolio not initialized. Call initializePortfolio() first.');
    }

    const totalInvestment = this.stocks.reduce((sum, stock) => sum + stock.investment, 0);
    const totalPresentValue = this.stocks.reduce((sum, stock) => sum + stock.presentValue, 0);
    const totalGainLoss = totalPresentValue - totalInvestment;
    const totalGainLossPercentage = (totalGainLoss / totalInvestment) * 100;

    const sectors = this.getSectors();

    return {
      stocks: this.stocks,
      sectors,
      totalInvestment,
      totalPresentValue,
      totalGainLoss,
      totalGainLossPercentage,
      lastUpdated: new Date()
    };
  }

  private getSectors(): Sector[] {
    const sectorMap = new Map<string, Stock[]>();

    // Group stocks by sector
    this.stocks.forEach(stock => {
      if (!sectorMap.has(stock.sector)) {
        sectorMap.set(stock.sector, []);
      }
      sectorMap.get(stock.sector)!.push(stock);
    });

    // Calculate sector summaries
    const sectors: Sector[] = [];
    
    sectorMap.forEach((stocks, sectorName) => {
      const totalInvestment = stocks.reduce((sum, stock) => sum + stock.investment, 0);
      const totalPresentValue = stocks.reduce((sum, stock) => sum + stock.presentValue, 0);
      const totalGainLoss = totalPresentValue - totalInvestment;
      const totalGainLossPercentage = (totalGainLoss / totalInvestment) * 100;

      sectors.push({
        name: sectorName,
        stocks,
        totalInvestment,
        totalPresentValue,
        totalGainLoss,
        totalGainLossPercentage
      });
    });

    return sectors.sort((a, b) => b.totalInvestment - a.totalInvestment);
  }

  public async refreshData() {
    try {
      const initialStocks = await getInitialStocksFromExcel();
      await this.updateStockData(initialStocks);
      this.calculatePortfolioPercentages();
    } catch (error) {
      console.error('Error refreshing data:', error);
      throw error;
    }
  }

  public startAutoRefresh(intervalMs: number = 15000) {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    this.updateInterval = setInterval(async () => {
      try {
        await this.refreshData();
      } catch (error) {
        console.error('Auto-refresh failed:', error);
      }
    }, intervalMs);
  }

  public stopAutoRefresh() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  public getStocks(): Stock[] {
    return this.stocks;
  }

  public getSectorsList(): Sector[] {
    return this.getSectors();
  }

  public isReady(): boolean {
    return this.isInitialized;
  }
}

// Create a singleton instance
export const portfolioService = new PortfolioService();
