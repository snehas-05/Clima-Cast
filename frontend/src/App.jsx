import { Routes, Route, Navigate } from 'react-router-dom';

import PublicLayout from './components/layout/PublicLayout';
import AuthLayout from './components/layout/AuthLayout';
import DashboardLayout from './components/layout/DashboardLayout';

import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Forecast from './pages/Forecast';
import AIPredictions from './pages/AIPredictions';
import Analytics from './pages/Analytics';
import InteractiveMap from './pages/InteractiveMap';
import SavedCities from './pages/SavedCities';
import Alerts from './pages/Alerts';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';

function App() {
  return (
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

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
