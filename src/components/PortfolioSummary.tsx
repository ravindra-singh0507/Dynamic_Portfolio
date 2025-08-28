'use client';

import React from 'react';
import { Portfolio } from '@/types/portfolio';
import { TrendingUp, TrendingDown, DollarSign, PieChart, Target, Activity } from 'lucide-react';

interface PortfolioSummaryProps {
  portfolio: Portfolio;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const formatPercentage = (value: number) => {
  return `${value.toFixed(2)}%`;
};

const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({ portfolio }) => {
  const isPositive = portfolio.totalGainLoss >= 0;
  const totalStocks = portfolio.stocks.length;
  const totalSectors = portfolio.sectors.length;

  const summaryCards = [
    {
      title: 'Total Investment',
      value: formatCurrency(portfolio.totalInvestment),
      icon: DollarSign,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Present Value',
      value: formatCurrency(portfolio.totalPresentValue),
      icon: PieChart,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total Gain/Loss',
      value: formatCurrency(Math.abs(portfolio.totalGainLoss)),
      icon: isPositive ? TrendingUp : TrendingDown,
      color: isPositive ? 'bg-green-500' : 'bg-red-500',
      textColor: isPositive ? 'text-green-600' : 'text-red-600',
      bgColor: isPositive ? 'bg-green-50' : 'bg-red-50'
    },
    {
      title: 'Portfolio Performance',
      value: `${isPositive ? '+' : ''}${formatPercentage(portfolio.totalGainLossPercentage)}`,
      icon: Target,
      color: isPositive ? 'bg-green-500' : 'bg-red-500',
      textColor: isPositive ? 'text-green-600' : 'text-red-600',
      bgColor: isPositive ? 'bg-green-50' : 'bg-red-50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <div key={index} className={`${card.bgColor} rounded-lg p-6 border border-gray-200`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className={`text-2xl font-bold ${card.textColor} mt-2`}>
                    {card.value}
                  </p>
                </div>
                <div className={`${card.color} p-3 rounded-full`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Portfolio Stats */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-500 p-2 rounded-full">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Portfolio Stats</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Stocks</span>
              <span className="font-medium text-gray-900">{totalStocks}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Sectors</span>
              <span className="font-medium text-gray-900">{totalSectors}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Updated</span>
              <span className="font-medium text-gray-900">
                {portfolio.lastUpdated.toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-500 p-2 rounded-full">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Top Performers</h3>
          </div>
          <div className="space-y-3">
            {portfolio.stocks
              .sort((a, b) => b.gainLossPercentage - a.gainLossPercentage)
              .slice(0, 3)
              .map((stock) => (
                <div key={stock.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{stock.name}</p>
                    <p className="text-gray-500 text-xs">{stock.symbol}</p>
                  </div>
                  <span className="text-green-600 font-medium text-sm">
                    +{formatPercentage(stock.gainLossPercentage)}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Worst Performers */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-red-500 p-2 rounded-full">
              <TrendingDown className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Worst Performers</h3>
          </div>
          <div className="space-y-3">
            {portfolio.stocks
              .sort((a, b) => a.gainLossPercentage - b.gainLossPercentage)
              .slice(0, 3)
              .map((stock) => (
                <div key={stock.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{stock.name}</p>
                    <p className="text-gray-500 text-xs">{stock.symbol}</p>
                  </div>
                  <span className="text-red-600 font-medium text-sm">
                    {formatPercentage(stock.gainLossPercentage)}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Performance Indicator */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Performance</h3>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Investment: {formatCurrency(portfolio.totalInvestment)}</span>
              <span>Present Value: {formatCurrency(portfolio.totalPresentValue)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ${
                  isPositive ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{ 
                  width: `${Math.min(100, Math.max(0, (portfolio.totalPresentValue / portfolio.totalInvestment) * 100))}%` 
                }}
              ></div>
            </div>
          </div>
          <div className={`text-right ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            <p className="text-2xl font-bold">
              {isPositive ? '+' : ''}{formatPercentage(portfolio.totalGainLossPercentage)}
            </p>
            <p className="text-sm">
              {isPositive ? '+' : ''}{formatCurrency(portfolio.totalGainLoss)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioSummary;
