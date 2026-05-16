import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TRANSITIONS } from './utils/motion';

import PublicLayout from './components/layout/PublicLayout';
import AuthLayout from './components/layout/AuthLayout';
import DashboardLayout from './components/layout/DashboardLayout';

import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NotFound from './pages/NotFound';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSkeleton from './components/ui/LoadingSkeleton';

// Lazy load heavy dashboard pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Forecast = lazy(() => import('./pages/Forecast'));
const AIPredictions = lazy(() => import('./pages/AIPredictions'));
const Analytics = lazy(() => import('./pages/Analytics'));
const InteractiveMap = lazy(() => import('./pages/InteractiveMap'));
const SavedCities = lazy(() => import('./pages/SavedCities'));
const Alerts = lazy(() => import('./pages/Alerts'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));

import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';

import { PreferencesProvider } from './context/PreferencesContext';
import { useTheme } from './hooks/useTheme';

const PageLoader = () => (
  <div className="p-8 space-y-8 animate-fade-in">
    <div className="flex justify-between items-center">
      <LoadingSkeleton height="3rem" width="250px" />
      <LoadingSkeleton height="2.5rem" width="120px" borderRadius="1.25rem" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <LoadingSkeleton height="200px" borderRadius="1.5rem" />
      <LoadingSkeleton height="200px" borderRadius="1.5rem" />
      <LoadingSkeleton height="200px" borderRadius="1.5rem" />
    </div>
    <LoadingSkeleton height="400px" borderRadius="2rem" />
  </div>
);

const PageTransition = ({ children }) => (
  <motion.div {...TRANSITIONS.ROUTE} className="flex-1 flex flex-col min-h-0">
    {children}
  </motion.div>
);

function AppContent() {
  useTheme(); // Applies theme classes to body
  const location = useLocation();

  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<PageTransition><Home /></PageTransition>} />
              <Route path="/about" element={<PageTransition><About /></PageTransition>} />
            </Route>

          {/* Auth Routes */}
          <Route element={<PublicRoute />}>
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
              <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
            </Route>
          </Route>

          {/* Dashboard Routes */}
          <Route element={<PrivateRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
              <Route path="/forecast" element={<PageTransition><Forecast /></PageTransition>} />
              <Route path="/predictions" element={<PageTransition><AIPredictions /></PageTransition>} />
              <Route path="/analytics" element={<PageTransition><Analytics /></PageTransition>} />
              <Route path="/map" element={<PageTransition><InteractiveMap /></PageTransition>} />
              <Route path="/saved-cities" element={<PageTransition><SavedCities /></PageTransition>} />
              <Route path="/alerts" element={<PageTransition><Alerts /></PageTransition>} />
              <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
              <Route path="/settings" element={<PageTransition><Settings /></PageTransition>} />
            </Route>
          </Route>

          {/* 404 Route */}
          <Route path="/404" element={<PageTransition><NotFound /></PageTransition>} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  </ErrorBoundary>
);
}

function App() {
  return (
    <PreferencesProvider>
      <WeatherProvider>
        <AppContent />
      </WeatherProvider>
    </PreferencesProvider>
  );
}

export default App;
