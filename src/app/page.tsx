'use client';

import React, { useState, useEffect } from 'react';
import { Portfolio } from '@/types/portfolio';
import { portfolioService } from '@/lib/portfolioService';
import PortfolioSummary from '@/components/PortfolioSummary';
import PortfolioTable from '@/components/PortfolioTable';
import SectorSummary from '@/components/SectorSummary';
import PortfolioCharts from '@/components/PortfolioCharts';
import { RefreshCw, BarChart3, Table, PieChart } from 'lucide-react';

export default function Dashboard() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'table' | 'sectors' | 'charts'>('overview');
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    initializePortfolio();
    
    // Start auto-refresh
    if (autoRefresh) {
      portfolioService.startAutoRefresh(15000); // 15 seconds
    }

    return () => {
      portfolioService.stopAutoRefresh();
    };
  }, [autoRefresh]);

  const initializePortfolio = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Initialize the portfolio service
      await portfolioService.initializePortfolio();
      
      const portfolioData = portfolioService.getPortfolio();
      setPortfolio(portfolioData);
    } catch (err) {
      setError('Failed to load portfolio data');
      console.error('Error initializing portfolio:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      await portfolioService.refreshData();
      const portfolioData = portfolioService.getPortfolio();
      setPortfolio(portfolioData);
    } catch (err) {
      setError('Failed to refresh portfolio data');
      console.error('Error refreshing portfolio:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleAutoRefresh = () => {
    if (autoRefresh) {
      portfolioService.stopAutoRefresh();
    } else {
      portfolioService.startAutoRefresh(15000);
    }
    setAutoRefresh(!autoRefresh);
  };

  if (loading && !portfolio) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading portfolio data from Excel...</p>
        </div>
      </div>
    );
  }

  if (error && !portfolio) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 p-4 rounded-lg">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={initializePortfolio}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!portfolio) {
    return null;
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'table', name: 'Portfolio Table', icon: Table },
    { id: 'sectors', name: 'Sector Breakdown', icon: PieChart },
    { id: 'charts', name: 'Charts & Analytics', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Portfolio Dashboard</h1>
              <span className="ml-3 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                Excel Data
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Auto-refresh toggle */}
              <button
                onClick={toggleAutoRefresh}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  autoRefresh 
                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
                Auto-refresh {autoRefresh ? 'ON' : 'OFF'}
              </button>
              
              {/* Manual refresh */}
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
              <span className="text-blue-600">Updating portfolio data...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <PortfolioSummary portfolio={portfolio} />
          )}
          
          {activeTab === 'table' && (
            <PortfolioTable 
              stocks={portfolio.stocks} 
              onRefresh={handleRefresh}
            />
          )}
          
          {activeTab === 'sectors' && (
            <SectorSummary sectors={portfolio.sectors} />
          )}
          
          {activeTab === 'charts' && (
            <PortfolioCharts sectors={portfolio.sectors} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div>
              <p>Portfolio Dashboard - Real-time stock tracking with Excel data</p>
              <p className="text-xs mt-1">
                Data updates every 15 seconds • Last updated: {portfolio.lastUpdated.toLocaleString()}
              </p>
            </div>
            <div className="text-xs">
              <p>Powered by Next.js, TypeScript & Tailwind CSS</p>
              <p className="mt-1">Data source: portfolio.xlsx</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
