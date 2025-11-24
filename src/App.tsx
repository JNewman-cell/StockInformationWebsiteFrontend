import { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { StackHandler, StackProvider, StackTheme } from '@stackframe/react';
import { stackClientApp } from './stack';
import { QUERY_CONFIG } from './config/constants';
import Navbar from './navigation/Navbar';
import LandingPage from './landingPage/LandingPage';
import StockScreener from './stockScreener/StockScreener';
import StockDetails from './stockScreener/pages/stockDetailsPage/StockDetails';
import Dashboard from './dashboard/Dashboard';
import Loading from './components/Loading';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: QUERY_CONFIG.REFETCH_ON_WINDOW_FOCUS,
      retry: QUERY_CONFIG.RETRY_COUNT,
      staleTime: QUERY_CONFIG.STALE_TIME.SEARCH,
    },
  },
});

function HandlerRoutes() {
  const location = useLocation();

  return (
    <StackHandler app={stackClientApp} location={location.pathname} fullPage />
  );
}

function AppContent() {
  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/handler/*" element={<HandlerRoutes />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/screener" element={<StockScreener />} />
        <Route path="/screener/:ticker/details" element={<StockDetails />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  // Get base path from Vite's base config for GitHub Pages support
  // This ensures React Router knows about the /StockInformationWebsiteFrontend/ prefix
  const basename = import.meta.env.BASE_URL || '/';

  return (
    <Suspense fallback={<Loading message="Loading application..." fullPage />}>
      <QueryClientProvider client={queryClient}>
        <Router basename={basename}>
          <StackProvider app={stackClientApp}>
            <StackTheme>
              <AppContent />
            </StackTheme>
          </StackProvider>
        </Router>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Suspense>
  );
}

export default App;
