'use client';

import React from 'react';
import { Sector } from '@/types/portfolio';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PortfolioChartsProps {
  sectors: Sector[];
}

const COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
];

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

const PortfolioCharts: React.FC<PortfolioChartsProps> = ({ sectors }) => {
  // Prepare data for pie chart (sector allocation)
  const pieData = sectors.map((sector, index) => ({
    name: sector.name,
    value: sector.totalInvestment,
    color: COLORS[index % COLORS.length]
  }));

  // Prepare data for bar chart (sector performance)
  const barData = sectors.map((sector, index) => ({
    name: sector.name,
    investment: sector.totalInvestment,
    presentValue: sector.totalPresentValue,
    gainLoss: sector.totalGainLoss,
    gainLossPercentage: sector.totalGainLossPercentage,
    color: COLORS[index % COLORS.length]
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const BarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-sm text-gray-600">
            Investment: {formatCurrency(data.investment)}
          </p>
          <p className="text-sm text-gray-600">
            Present Value: {formatCurrency(data.presentValue)}
          </p>
          <p className={`text-sm font-medium ${
            data.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            Gain/Loss: {formatCurrency(data.gainLoss)} ({formatPercentage(data.gainLossPercentage)})
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Sector Allocation Chart */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sector Allocation</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Sector Breakdown</h4>
            {sectors.map((sector, index) => (
              <div key={sector.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <div>
                    <p className="font-medium text-gray-900">{sector.name}</p>
                    <p className="text-sm text-gray-500">{sector.stocks.length} stocks</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{formatCurrency(sector.totalInvestment)}</p>
                  <p className="text-sm text-gray-500">
                    {formatPercentage((sector.totalInvestment / sectors.reduce((sum, s) => sum + s.totalInvestment, 0)) * 100)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sector Performance Chart */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sector Performance</h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tickFormatter={(value) => formatCurrency(value)}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<BarTooltip />} />
              <Legend />
              <Bar 
                dataKey="investment" 
                fill="#3B82F6" 
                name="Investment"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="presentValue" 
                fill="#10B981" 
                name="Present Value"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Best Performing Sectors */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Best Performing Sectors</h3>
          <div className="space-y-3">
            {sectors
              .filter(sector => sector.totalGainLoss > 0)
              .sort((a, b) => b.totalGainLossPercentage - a.totalGainLossPercentage)
              .slice(0, 3)
              .map((sector, index) => (
                <div key={sector.name} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{sector.name}</p>
                    <p className="text-sm text-gray-500">{sector.stocks.length} stocks</p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-600 font-medium">
                      +{formatPercentage(sector.totalGainLossPercentage)}
                    </p>
                    <p className="text-sm text-green-600">
                      +{formatCurrency(sector.totalGainLoss)}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Worst Performing Sectors */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Worst Performing Sectors</h3>
          <div className="space-y-3">
            {sectors
              .filter(sector => sector.totalGainLoss < 0)
              .sort((a, b) => a.totalGainLossPercentage - b.totalGainLossPercentage)
              .slice(0, 3)
              .map((sector, index) => (
                <div key={sector.name} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{sector.name}</p>
                    <p className="text-sm text-gray-500">{sector.stocks.length} stocks</p>
                  </div>
                  <div className="text-right">
                    <p className="text-red-600 font-medium">
                      {formatPercentage(sector.totalGainLossPercentage)}
                    </p>
                    <p className="text-sm text-red-600">
                      {formatCurrency(sector.totalGainLoss)}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioCharts;
