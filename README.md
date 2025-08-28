# Dynamic Portfolio Dashboard with Excel Data Integration

A comprehensive real-time portfolio tracking dashboard built with Next.js, TypeScript, and Tailwind CSS. This application reads portfolio data from an Excel file and provides live insights into portfolio performance with sector analysis and detailed stock information.

## 🚀 Features

### Core Functionality
- **Excel Data Integration**: Reads portfolio data from `portfolio.xlsx` file
- **Real-time Stock Data**: Fetches current market prices from Yahoo Finance and financial metrics from Google Finance
- **Portfolio Tracking**: Complete portfolio overview with investment, present value, and gain/loss calculations
- **Sector Analysis**: Group stocks by sector with sector-wise performance summaries
- **Dynamic Updates**: Auto-refresh every 15 seconds to keep data current
- **Interactive Tables**: Sortable and searchable portfolio table with all required columns

### Data Display
- **Portfolio Table**: Complete stock information including:
  - Stock particulars and exchange codes
  - Purchase price, quantity, and investment amount
  - Portfolio percentage allocation
  - Current market price (CMP)
  - Present value and gain/loss calculations
  - P/E ratio and latest earnings data
  - Color-coded gain/loss indicators

### Visual Components
- **Summary Cards**: Key portfolio metrics at a glance
- **Sector Breakdown**: Expandable sector summaries with detailed stock lists
- **Charts & Analytics**: 
  - Pie chart for sector allocation
  - Bar charts for sector performance
  - Performance indicators and trends
- **Top/Worst Performers**: Quick view of best and worst performing stocks

### Technical Features
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices
- **TypeScript**: Full type safety throughout the application
- **Modern UI**: Built with Tailwind CSS for a clean, professional appearance
- **Error Handling**: Graceful error handling with user-friendly messages
- **Loading States**: Smooth loading indicators and transitions

## 🛠️ Technology Stack

- **Frontend**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Lucide React icons
- **Charts**: Recharts for data visualization
- **Tables**: TanStack React Table
- **HTTP Client**: Axios for API calls
- **Data Source**: Excel file (portfolio.xlsx)

## 📊 Data Sources

### Excel File Integration
- **File**: `portfolio.xlsx` in the project root
- **Purpose**: Provides initial portfolio data (stock names, purchase prices, quantities, sectors)
- **Format**: Structured Excel format with columns for stock details

### Yahoo Finance Integration
- **Purpose**: Fetch real-time stock prices (CMP)
- **Implementation**: Mock API with realistic data simulation
- **Note**: In production, would integrate with Yahoo Finance unofficial APIs or web scraping

### Google Finance Integration
- **Purpose**: Fetch P/E ratios and latest earnings data
- **Implementation**: Mock API with realistic data simulation
- **Note**: In production, would integrate with Google Finance unofficial APIs or web scraping

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager
- Excel file: `portfolio.xlsx` (included in project)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd portfolio-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 📁 Project Structure

```
portfolio-dashboard/
├── portfolio.xlsx              # Excel data source
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Main dashboard page
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── PortfolioTable.tsx # Main portfolio table
│   │   ├── PortfolioSummary.tsx # Summary cards
│   │   ├── SectorSummary.tsx  # Sector breakdown
│   │   └── PortfolioCharts.tsx # Charts and analytics
│   ├── lib/                   # Utility functions
│   │   ├── api.ts            # Mock API service functions
│   │   ├── excelService.ts   # Excel data reading service
│   │   └── portfolioService.ts # Portfolio data management
│   └── types/                # TypeScript type definitions
│       └── portfolio.ts      # Portfolio interfaces
├── package.json               # Dependencies and scripts
└── README.md                  # This documentation
```

## 🔧 Configuration

### Excel File Format
The `portfolio.xlsx` file should contain the following columns:
- **Particulars**: Stock name
- **Purchase Price**: Purchase price per share
- **Quantity**: Number of shares
- **Investment**: Total investment amount
- **Portfolio (%)**: Portfolio allocation percentage
- **NSE/BSE**: Stock exchange code
- **Sector**: Stock sector classification

### Environment Variables
Create a `.env.local` file for environment-specific configuration:

```env
# API Configuration (for future real API integration)
NEXT_PUBLIC_YAHOO_FINANCE_API_URL=
NEXT_PUBLIC_GOOGLE_FINANCE_API_URL=
NEXT_PUBLIC_API_KEY=

# App Configuration
NEXT_PUBLIC_AUTO_REFRESH_INTERVAL=15000
NEXT_PUBLIC_MAX_RETRIES=3
```

### Customization
- **Portfolio Data**: Modify `portfolio.xlsx` to add/remove stocks
- **Styling**: Customize Tailwind classes in components
- **Charts**: Adjust chart configurations in `PortfolioCharts.tsx`
- **API Integration**: Replace mock APIs in `src/lib/api.ts` with real implementations

## 🎯 Key Features Explained

### Excel Data Integration
The dashboard reads initial portfolio data from the Excel file and combines it with real-time market data to provide comprehensive portfolio insights.

### Real-time Updates
The dashboard automatically refreshes stock data every 15 seconds to provide current market information. Users can also manually refresh or toggle auto-refresh on/off.

### Sector Grouping
Stocks are automatically grouped by sector (Financial Services, Technology, Consumer Goods, etc.) with calculated totals for:
- Total investment per sector
- Total present value per sector
- Sector-wise gain/loss and percentages

### Visual Indicators
- **Green**: Positive gains and upward trends
- **Red**: Losses and downward trends
- **Icons**: Trending up/down arrows for quick visual assessment

### Responsive Design
The dashboard adapts to different screen sizes:
- **Desktop**: Full layout with all features
- **Tablet**: Optimized layout with collapsible sections
- **Mobile**: Stacked layout with touch-friendly interactions

## 🔮 Future Enhancements

### Planned Features
- **Real Excel Reading**: Implement actual Excel file parsing using libraries like `xlsx`
- **Real API Integration**: Connect to actual Yahoo Finance and Google Finance APIs
- **User Authentication**: Multi-user support with personal portfolios
- **Historical Data**: Price history charts and performance tracking
- **Alerts & Notifications**: Price alerts and portfolio milestone notifications
- **Export Functionality**: PDF reports and Excel exports
- **Watchlists**: Custom stock watchlists
- **News Integration**: Latest financial news and company updates

### Technical Improvements
- **Caching**: Implement Redis or similar for API response caching
- **WebSocket**: Real-time price updates via WebSocket connections
- **PWA**: Progressive Web App capabilities
- **Testing**: Comprehensive unit and integration tests
- **CI/CD**: Automated deployment pipeline

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This application uses mock data for demonstration purposes. In a production environment, you would need to:
- Implement proper Excel file reading using libraries like `xlsx`
- Implement proper API integrations with Yahoo Finance and Google Finance
- Handle rate limiting and API quotas
- Implement proper error handling for API failures
- Add data validation and sanitization
- Consider legal and compliance requirements for financial data usage

## 📞 Support

For questions or support, please open an issue in the repository or contact the development team.

---

**Built with ❤️ using Next.js, TypeScript, Tailwind CSS & Excel Data Integration**
