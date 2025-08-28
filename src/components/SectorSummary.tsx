'use client';

import React, { useState } from 'react';
import { Sector } from '@/types/portfolio';
import { ChevronDown, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';

interface SectorSummaryProps {
  sectors: Sector[];
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

const SectorSummary: React.FC<SectorSummaryProps> = ({ sectors }) => {
  const [expandedSectors, setExpandedSectors] = useState<Set<string>>(new Set());

  const toggleSector = (sectorName: string) => {
    const newExpanded = new Set(expandedSectors);
    if (newExpanded.has(sectorName)) {
      newExpanded.delete(sectorName);
    } else {
      newExpanded.add(sectorName);
    }
    setExpandedSectors(newExpanded);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-xl font-semibold text-gray-900">Sector Breakdown</h2>
      </div>
      
      <div className="divide-y divide-gray-200">
        {sectors.map((sector) => {
          const isExpanded = expandedSectors.has(sector.name);
          const isPositive = sector.totalGainLoss >= 0;
          
          return (
            <div key={sector.name} className="bg-white">
              {/* Sector Header */}
              <div 
                className="px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleSector(sector.name)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-500" />
                    )}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{sector.name}</h3>
                      <p className="text-sm text-gray-500">{sector.stocks.length} stocks</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    {/* Investment */}
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Investment</p>
                      <p className="font-medium text-gray-900">{formatCurrency(sector.totalInvestment)}</p>
                    </div>
                    
                    {/* Present Value */}
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Present Value</p>
                      <p className="font-medium text-gray-900">{formatCurrency(sector.totalPresentValue)}</p>
                    </div>
                    
                    {/* Gain/Loss */}
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Gain/Loss</p>
                      <div className={`flex items-center gap-1 font-medium ${
                        isPositive ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        <span>{formatCurrency(Math.abs(sector.totalGainLoss))}</span>
                      </div>
                      <p className={`text-sm ${
                        isPositive ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {isPositive ? '+' : ''}{formatPercentage(sector.totalGainLossPercentage)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Sector Details */}
              {isExpanded && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="text-xs text-gray-500 uppercase tracking-wider">
                          <th className="text-left py-2">Stock</th>
                          <th className="text-right py-2">Investment</th>
                          <th className="text-right py-2">Present Value</th>
                          <th className="text-right py-2">Gain/Loss</th>
                          <th className="text-right py-2">Gain/Loss %</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {sector.stocks.map((stock) => {
                          const stockIsPositive = stock.gainLoss >= 0;
                          return (
                            <tr key={stock.id} className="text-sm">
                              <td className="py-2">
                                <div>
                                  <p className="font-medium text-gray-900">{stock.name}</p>
                                  <p className="text-gray-500">{stock.symbol}</p>
                                </div>
                              </td>
                              <td className="text-right py-2 text-gray-900">
                                {formatCurrency(stock.investment)}
                              </td>
                              <td className="text-right py-2 text-gray-900">
                                {formatCurrency(stock.presentValue)}
                              </td>
                              <td className={`text-right py-2 font-medium ${
                                stockIsPositive ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {formatCurrency(Math.abs(stock.gainLoss))}
                              </td>
                              <td className={`text-right py-2 ${
                                stockIsPositive ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {stockIsPositive ? '+' : ''}{formatPercentage(stock.gainLossPercentage)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SectorSummary;
