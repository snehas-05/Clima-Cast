import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import UnitToggle from '../ui/UnitToggle';
import ThemeToggle from '../ui/ThemeToggle';
import SearchOverlay from '../ui/SearchOverlay';
import CitySearch from './CitySearch';
import api from '../../services/api';
import { useEffect, useRef } from 'react';

import { useWeatherContext } from '../../context/WeatherContext';
import { useAtmosphericText } from '../../hooks/useAtmosphericText';

const IconButton = ({ icon, onClick, ariaLabel }) => (
  <button 
    onClick={onClick}
    aria-label={ariaLabel || icon}
    className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-primary-container/10 transition-colors"
  >
    <span className="material-symbols-outlined">{icon}</span>
  </button>
);

export default function TopBar({ title, subtitle, children }) {
  const { activeCity, resetToGPS, isGPSMode } = useWeatherContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { getStatusOutlook } = useAtmosphericText();
  const searchRef = useRef(null);

  const handleSearch = async (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      executeSearch(searchQuery);
    }
  };

  const executeSearch = async (query) => {
    setSearchLoading(true);
    setSearchResults(null);
    
    try {
      const response = await api.get('/search', {
        params: { q: query, city: activeCity }
      });
      setSearchResults(response.data);
    } catch (err) {
      console.error("Search error:", err);
      setSearchResults({
        answer: "Sorry, I encountered an error while searching. Please try again.",
        related_questions: ["What is the temperature?", "Show forecast"]
      });
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    { id: 1, text: "High temperature warning in your area", time: "2h ago", icon: "warning" },
    { id: 2, text: "Rain expected tomorrow morning", time: "5h ago", icon: "rainy" },
    { id: 3, text: "Air quality is now Moderate", time: "1d ago", icon: "air" },
  ];

  return (
    <header className="sticky top-0 z-40 glass-topbar">
      <div className="flex justify-between items-center h-[var(--spacing-topbar-height)] px-[var(--spacing-container-px)] max-w-[1440px] mx-auto w-full">
        {/* Left: Title + optional subtitle */}
        <div className="flex items-center gap-6">
          <div>
            <h2 className="text-h2-dashboard text-primary truncate max-w-[200px] sm:max-w-none">{title}</h2>
            <p className="text-label-caps text-on-surface-variant/60 text-[10px] sm:text-xs">
              {subtitle || getStatusOutlook}
            </p>
          </div>
        </div>

        {/* Right: Search + actions */}
        <div className="flex items-center gap-4">
          {/* Unit Toggle */}
          <div className="hidden lg:block">
            <UnitToggle />
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Location Button (visible alongside theme) */}
          <button
            onClick={() => resetToGPS()}
            aria-label="Use my location"
            title="Use My Location"
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${isGPSMode ? 'text-primary bg-primary/10' : 'text-on-surface-variant hover:bg-primary/5'}`}
          >
            <span className="material-symbols-outlined">my_location</span>
          </button>

          {/* City Selector */}
          <div className="hidden md:block flex-1 max-w-xs md:mx-4">
            <CitySearch />
          </div>

          {/* AI Question Search */}
          <div className="relative group hidden xl:block" ref={searchRef}>
            <span className="absolute inset-y-0 left-3 flex items-center text-on-surface-variant group-focus-within:text-primary touch-target" aria-hidden="true">
              <span className="material-symbols-outlined">psychology</span>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="bg-white/90 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 rounded-full py-2.5 pl-10 pr-6 w-48 lg:w-64 focus:ring-2 focus:ring-primary/20 text-body-main text-on-surface placeholder:text-on-surface-variant/70 dark:placeholder:text-on-surface-variant/60 transition-all focus:w-80 backdrop-blur-md"
              placeholder="Ask AI about weather..."
              aria-label="Ask AI weather question"
            />
            
            <SearchOverlay 
              results={searchResults} 
              loading={searchLoading} 
              onClose={() => setSearchResults(null)}
              onQueryChange={(q) => {
                setSearchQuery(q);
                executeSearch(q);
              }}
            />
          </div>

          {/* Notification */}
          <div className="relative">
            <IconButton 
              icon="notifications" 
              ariaLabel="View notifications" 
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowDropdown(false);
              }}
            />
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-surface border border-outline-variant/30 rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-outline-variant/30 bg-surface-container-low flex justify-between items-center">
                  <h3 className="text-body-main font-bold text-on-surface">Notifications</h3>
                  <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">3 NEW</span>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} className="px-4 py-3 hover:bg-surface-container transition-colors cursor-pointer border-b border-outline-variant/10 last:border-0 flex gap-3">
                      <span className="material-symbols-outlined text-primary text-xl shrink-0">{n.icon}</span>
                      <div>
                        <p className="text-body-sm text-on-surface line-clamp-2">{n.text}</p>
                        <p className="text-[10px] text-on-surface-variant mt-1">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full py-2 text-center text-label-caps text-primary hover:bg-primary/5 transition-colors border-t border-outline-variant/30">
                  View All Alerts
                </button>
              </div>
            )}
          </div>

          <div className="h-8 w-px bg-outline-variant/30 mx-3 hidden sm:block" />

          {/* User avatar area */}
          <div className="relative">
            <button 
              className="flex items-center gap-3 cursor-pointer group focus:outline-none touch-target"
              onClick={() => {
                setShowDropdown(!showDropdown);
                setShowNotifications(false);
              }}
              aria-label="User profile menu"
              aria-expanded={showDropdown}
              aria-haspopup="true"
            >
              <div className="hidden sm:block text-right">
                <p className="text-body-main font-semibold text-on-surface">{user?.name || 'User'}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary-fixed overflow-hidden border-2 border-primary/20 group-hover:border-primary group-focus:border-primary transition-all shrink-0">
                <div className="w-full h-full bg-primary-container flex items-center justify-center text-on-primary-container">
                  <span className="material-symbols-outlined" aria-hidden="true">person</span>
                </div>
              </div>
            </button>

            {showDropdown && (
              <div 
                className="absolute right-0 mt-3 w-48 bg-surface border border-outline-variant/30 rounded-xl shadow-lg overflow-hidden py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                role="menu"
                aria-orientation="vertical"
              >
                <div className="px-4 py-3 border-b border-outline-variant/30 sm:hidden" role="none">
                  <p className="text-body-main font-semibold text-on-surface" role="none">{user?.name}</p>
                  <p className="text-label-caps text-on-surface-variant truncate" role="none">{user?.email}</p>
                </div>
                <button 
                  className="w-full text-left px-4 py-3 text-on-surface hover:bg-surface-container flex items-center gap-2 transition-colors touch-target"
                  onClick={() => {
                    alert("Navigating to Profile...");
                    setShowDropdown(false);
                  }}
                >
                  <span className="material-symbols-outlined text-[18px]">account_circle</span>
                  Profile
                </button>
                <button 
                  className="w-full text-left px-4 py-3 text-on-surface hover:bg-surface-container flex items-center gap-2 transition-colors touch-target"
                  onClick={() => {
                    alert("Opening Security Settings...");
                    setShowDropdown(false);
                  }}
                >
                  <span className="material-symbols-outlined text-[18px]">security</span>
                  Security
                </button>
                <div className="h-px bg-outline-variant/30 my-2" />
                <button 
                  onClick={logout}
                  role="menuitem"
                  className="w-full text-left px-4 py-3 text-red-500 hover:bg-red-50 flex items-center gap-2 transition-colors touch-target"
                >
                  <span className="material-symbols-outlined text-[18px]" aria-hidden="true">logout</span>
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Extra actions from parent */}
          {children}
        </div>
      </div>
    </header>
  );
}
