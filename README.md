# Market Ease

A modern, full-featured React TypeScript web application for searching and viewing stock information with authentication, advanced filters, pagination, sorting, and real-time autocomplete.

## 🚀 Features

- **Smart Search Bar**: Real-time autocomplete with debouncing for efficient API calls
- **Advanced Filters**: Comprehensive filtering by:
  - Previous Close Price range
  - P/E Ratio (min/max)
  - Forward P/E Ratio (min/max)
  - Dividend Yield percentage (min/max)
  - Market Cap range (min/max)
  - Payout Ratio percentage (min/max)
- **Pagination & Sorting**: Full support for paginated results with customizable page size and multi-column sorting
- **Secure Authentication**: NeonDB-backed authentication with protected routes
- **Responsive Design**: Mobile-friendly UI with modern styling
- **Type-Safe**: Built with TypeScript for better developer experience
- **Protected Routes**: Route guards for authenticated and public pages
- **Data Table Display**: Professional table view with all stock metrics

## 📁 Project Structure

```
StockInformationWebsiteFrontend/
├── public/
│   └── index.html
├── src/
│   ├── auth/                    # Authentication pages
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── Auth.css
│   ├── contexts/                # React Context providers
│   │   └── AuthContext.tsx
│   ├── hooks/                   # Custom React hooks
│   │   └── useDebounce.ts
│   ├── landingPage/             # Landing page components
│   │   ├── Landing.tsx
│   │   ├── Landing.css
│   │   └── components/
│   │       ├── searchBar/
│   │       │   ├── SearchBar.tsx
│   │       │   └── SearchBar.css
│   │       └── filters/
│   │           ├── Filters.tsx
│   │           └── Filters.css
│   ├── navigation/              # Navigation components
│   │   └── components/
│   │       ├── Navbar.tsx
│   │       └── Navbar.css
│   ├── dashboard/               # Dashboard page
│   │   ├── Dashboard.tsx
│   │   └── Dashboard.css
│   ├── services/                # API service layer
│   │   └── api.ts
│   ├── types/                   # TypeScript type definitions
│   │   └── index.ts
│   ├── config/                  # Configuration files
│   │   └── api.ts
│   ├── App.tsx
│   ├── App.css
│   ├── index.tsx
│   └── index.css
├── .env.example
├── package.json
├── tsconfig.json
├── server.ts
└── README.md
```

## 🔧 Prerequisites

- [Bun](https://bun.sh/) (v1.0 or higher)
- Backend API server running (for authentication and stock data)

## 📦 Installation

```bash
bun install
```

## Configuration

1. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
2. **Update `.env.local` with your backend API URL:**
   ```env
   VITE_API_BASE_URL=http://localhost:3001/api
   ```

## Development

Start the development server:

```bash
bun run dev
```

The application will be available at `http://localhost:3000`

## Build

Create a production build:

```bash
bun run build
```

The built files will be in the `dist` directory.

## 📡 Backend API Requirements

Your backend should implement the following endpoints matching these specifications:

### Authentication Endpoints
- `POST /api/auth/register` - User registration
  - Body: `{ name: string, email: string, password: string }`
  - Returns: `{ success: boolean, token?: string, user?: User, message?: string }`
- `POST /api/auth/login` - User login
  - Body: `{ email: string, password: string }`
  - Returns: `{ success: boolean, token?: string, user?: User, message?: string }`
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Verify JWT token
  - Headers: `Authorization: Bearer {token}`
  - Returns: `{ success: boolean, user?: User }`

### Stock Endpoints

#### Autocomplete Search
- `GET /api/stocks/autocomplete?query={query}` - Get stock suggestions by company name and ticker
  - Query params: `query` (string)
  - Returns: `{ suggestions: [{ symbol: string, name: string }] }`

#### Stock Search with Filters
- `GET /api/stocks/search` - Search stocks with comprehensive filtering, sorting, and pagination
  - Query params:
    - `query` (string, optional) - Search by symbol or company name
    - `page` (number, default: 1) - Page number
    - `page_size` (number, default: 20) - Results per page
    - `sort_by` (string, default: 'symbol') - Sort field (symbol, name, previous_close, pe, forward_pe, dividend_yield, market_cap, payout_ratio)
    - `sort_order` ('asc' | 'desc', default: 'asc') - Sort direction
    - `min_previous_close` (number, optional) - Minimum previous close price
    - `max_previous_close` (number, optional) - Maximum previous close price
    - `min_pe` (number, optional) - Minimum P/E ratio
    - `max_pe` (number, optional) - Maximum P/E ratio
    - `min_forward_pe` (number, optional) - Minimum forward P/E ratio
    - `max_forward_pe` (number, optional) - Maximum forward P/E ratio
    - `min_dividend_yield` (number, optional) - Minimum dividend yield percentage
    - `max_dividend_yield` (number, optional) - Maximum dividend yield percentage
    - `min_market_cap` (number, optional) - Minimum market capitalization
    - `max_market_cap` (number, optional) - Maximum market capitalization
    - `min_payout_ratio` (number, optional) - Minimum payout ratio percentage
    - `max_payout_ratio` (number, optional) - Maximum payout ratio percentage
  - Returns:
    ```json
    {
      "stocks": [
        {
          "symbol": "AAPL",
          "name": "Apple Inc.",
          "previous_close": 150.25,
          "pe": 28.5,
          "forward_pe": 25.3,
          "dividend_yield": 0.52,
          "market_cap": 2450000000000,
          "payout_ratio": 15.2
        }
      ],
      "total": 500,
      "page": 1,
      "page_size": 20,
      "total_pages": 25
    }
    ```

#### Get Stock Details
- `GET /api/stocks/{symbol}` - Get specific stock details
  - Returns: Stock object with all fields

## 🎯 Usage

### Search for Stocks
1. Type in the search bar to see autocomplete suggestions (debounced after 300ms)
2. Click a suggestion or press Enter to search
3. Results display in a paginated table with all stock metrics

### Apply Filters
1. Use the sidebar filters to narrow results:
   - Set min/max ranges for price, P/E ratios, dividend yield, market cap, and payout ratio
   - Choose sort field and order (ascending/descending)
   - Select results per page (10, 20, 50, or 100)
2. Filters apply automatically when changed
3. Click "Reset Filters" to clear all filters and return to defaults

### Navigate Results
1. Use the pagination controls at the bottom of the results table
2. Click "Previous" or "Next" to navigate pages
3. Current page and total pages are displayed

### User Authentication
1. Click "Sign Up" in the navbar to create an account
2. Fill in name, email, and password
3. Or click "Login" if you have an account
4. Access protected Dashboard after login
5. Click "Logout" to sign out

## 🔑 Key Implementation Details

### Debouncing
The search bar uses a custom `useDebounce` hook with a 300ms delay to prevent excessive API calls during typing.

### Type Safety
All API responses and component props are fully typed using TypeScript interfaces defined in `src/types/index.ts`:
- `FilterOptions` - All available filter parameters
- `StockSearchResponse` - Paginated search response structure
- `Stock` - Individual stock data with all metrics
- `StockSuggestion` - Autocomplete suggestion format
- `AuthResponse` - Authentication response structure

### State Management
- React Context API (`AuthContext`) for global authentication state
- Local component state for search, filters, and pagination
- Protected routes using custom `ProtectedRoute` and `PublicRoute` wrappers

### API Service Layer
Centralized API calls in `src/services/api.ts` with:
- Automatic JWT token management
- Type-safe request/response handling
- Proper error handling with fallbacks

## 🛠️ Technologies Used

- **React 19** - UI framework
- **TypeScript 5** - Type safety
- **React Router DOM 7** - Client-side routing
- **Bun** - Fast JavaScript runtime and package manager
- **NeonDB Serverless** - PostgreSQL database (backend)
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication

