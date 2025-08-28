'use client';

import React, { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
  ColumnDef
} from '@tanstack/react-table';
import { Stock } from '@/types/portfolio';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface PortfolioTableProps {
  stocks: Stock[];
  onRefresh: () => void;
}

const columnHelper = createColumnHelper<Stock>();

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

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('en-IN').format(value);
};

const PortfolioTable: React.FC<PortfolioTableProps> = ({ stocks, onRefresh }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Particulars',
        cell: (info) => (
          <div className="font-medium text-gray-900">
            {info.getValue()}
          </div>
        ),
        enableSorting: true,
      }),
      columnHelper.accessor('purchasePrice', {
        header: 'Purchase Price',
        cell: (info) => (
          <div className="text-right">
            {formatCurrency(info.getValue())}
          </div>
        ),
        enableSorting: true,
      }),
      columnHelper.accessor('quantity', {
        header: 'Quantity',
        cell: (info) => (
          <div className="text-right">
            {formatNumber(info.getValue())}
          </div>
        ),
        enableSorting: true,
      }),
      columnHelper.accessor('investment', {
        header: 'Investment',
        cell: (info) => (
          <div className="text-right font-medium">
            {formatCurrency(info.getValue())}
          </div>
        ),
        enableSorting: true,
      }),
      columnHelper.accessor('portfolioPercentage', {
        header: 'Portfolio (%)',
        cell: (info) => (
          <div className="text-right">
            {formatPercentage(info.getValue())}
          </div>
        ),
        enableSorting: true,
      }),
      columnHelper.accessor('exchange', {
        header: 'NSE/BSE',
        cell: (info) => (
          <div className="text-center">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {info.getValue()}
            </span>
          </div>
        ),
        enableSorting: true,
      }),
      columnHelper.accessor('currentPrice', {
        header: 'CMP',
        cell: (info) => (
          <div className="text-right font-semibold text-gray-900">
            {formatCurrency(info.getValue())}
          </div>
        ),
        enableSorting: true,
      }),
      columnHelper.accessor('presentValue', {
        header: 'Present Value',
        cell: (info) => (
          <div className="text-right font-medium">
            {formatCurrency(info.getValue())}
          </div>
        ),
        enableSorting: true,
      }),
      columnHelper.accessor('gainLoss', {
        header: 'Gain/Loss',
        cell: (info) => {
          const value = info.getValue();
          const isPositive = value >= 0;
          return (
            <div className={`text-right font-medium flex items-center justify-end gap-1 ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {formatCurrency(Math.abs(value))}
            </div>
          );
        },
        enableSorting: true,
      }),
      columnHelper.accessor('gainLossPercentage', {
        header: 'Gain/Loss (%)',
        cell: (info) => {
          const value = info.getValue();
          const isPositive = value >= 0;
          return (
            <div className={`text-right font-medium ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              {isPositive ? '+' : ''}{formatPercentage(value)}
            </div>
          );
        },
        enableSorting: true,
      }),
      columnHelper.accessor('peRatio', {
        header: 'P/E Ratio',
        cell: (info) => (
          <div className="text-right">
            {info.getValue() > 0 ? info.getValue().toFixed(2) : '-'}
          </div>
        ),
        enableSorting: true,
      }),
      columnHelper.accessor('latestEarnings', {
        header: 'Latest Earnings',
        cell: (info) => (
          <div className="text-right">
            {info.getValue() > 0 ? formatCurrency(info.getValue()) : '-'}
          </div>
        ),
        enableSorting: true,
      }),
    ],
    []
  );

  const table = useReactTable({
    data: stocks,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Portfolio Holdings</h2>
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search stocks..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getCanSort() && (
                        <div className="flex flex-col">
                          <svg className={`w-3 h-3 ${header.column.getIsSorted() === 'asc' ? 'text-blue-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                          </svg>
                          <svg className={`w-3 h-3 ${header.column.getIsSorted() === 'desc' ? 'text-blue-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Total Records: {stocks.length}</span>
          <span>Last Updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
};

export default PortfolioTable;
