import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import UnitToggle from '../ui/UnitToggle';
import ThemeToggle from '../ui/ThemeToggle';

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
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-40 glass-topbar">
      <div className="flex justify-between items-center h-20 px-6 lg:px-[var(--spacing-container-padding)] max-w-[1440px] mx-auto w-full">
        {/* Left: Title + optional subtitle */}
        <div className="flex items-center gap-8">
          <div>
            <h2 className="text-h2-dashboard text-primary truncate max-w-[200px] sm:max-w-none">{title}</h2>
            {subtitle && (
              <p className="text-label-caps text-on-surface-variant/60 text-[10px] sm:text-xs">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Right: Search + actions */}
        <div className="flex items-center gap-4 relative">
          {/* Unit Toggle */}
          <div className="hidden lg:block">
            <UnitToggle />
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Search */}
          <div className="relative group hidden xl:block">
            <span className="absolute inset-y-0 left-3 flex items-center text-on-surface-variant group-focus-within:text-primary" aria-hidden="true">
              <span className="material-symbols-outlined">search</span>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-surface-container-low border-none rounded-full py-2.5 pl-10 pr-6 w-48 lg:w-64 focus:ring-2 focus:ring-primary/20 text-body-main placeholder:text-on-surface-variant/60"
              placeholder="Search data..."
              aria-label="Search weather data"
            />
          </div>

          {/* Notification */}
          <IconButton icon="notifications" ariaLabel="View notifications" />

          <div className="h-8 w-px bg-outline-variant/30 mx-1 hidden sm:block" />

          {/* User avatar area */}
          <div className="relative">
            <button 
              className="flex items-center gap-3 cursor-pointer group focus:outline-none"
              onClick={() => setShowDropdown(!showDropdown)}
              aria-label="User profile menu"
              aria-expanded={showDropdown}
              aria-haspopup="true"
            >
              <div className="hidden sm:block text-right">
                <p className="text-body-main font-semibold text-on-surface">{user?.name || 'User'}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary-fixed overflow-hidden border-2 border-primary/20 group-hover:border-primary group-focus:border-primary transition-all">
                <div className="w-full h-full bg-primary-container flex items-center justify-center text-on-primary-container">
                  <span className="material-symbols-outlined" aria-hidden="true">person</span>
                </div>
              </div>
            </button>

            {showDropdown && (
              <div 
                className="absolute right-0 mt-2 w-48 bg-surface border border-outline-variant/30 rounded-xl shadow-lg overflow-hidden py-1 z-50"
                role="menu"
                aria-orientation="vertical"
              >
                <div className="px-4 py-2 border-b border-outline-variant/30 sm:hidden" role="none">
                  <p className="text-body-main font-semibold text-on-surface" role="none">{user?.name}</p>
                  <p className="text-label-caps text-on-surface-variant truncate" role="none">{user?.email}</p>
                </div>
                <button 
                  onClick={logout}
                  role="menuitem"
                  className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 flex items-center gap-2 transition-colors"
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
