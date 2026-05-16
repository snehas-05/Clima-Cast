import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

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

import { WeatherProvider } from './context/WeatherContext';

function AppContent() {
  useTheme(); // Applies theme classes to body

  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Route>

          {/* Auth Routes */}
          <Route element={<PublicRoute />}>
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Route>
          </Route>

          {/* Dashboard Routes */}
          <Route element={<PrivateRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/forecast" element={<Forecast />} />
              <Route path="/predictions" element={<AIPredictions />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/map" element={<InteractiveMap />} />
              <Route path="/saved-cities" element={<SavedCities />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>

          {/* 404 Route */}
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
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
