import { useState } from 'react';
import IconButton from '../ui/IconButton';

export default function TopBar({ title, subtitle, children }) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="sticky top-0 z-40 glass-topbar">
      <div className="flex justify-between items-center h-20 px-6 lg:px-[var(--spacing-container-padding)] max-w-[1440px] mx-auto w-full">
        {/* Left: Title + optional subtitle */}
        <div className="flex items-center gap-8">
          <div>
            <h2 className="text-h2-dashboard text-primary">{title}</h2>
            {subtitle && (
              <p className="text-label-caps text-on-surface-variant/60">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Right: Search + actions */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative group hidden md:block">
            <span className="absolute inset-y-0 left-3 flex items-center text-on-surface-variant group-focus-within:text-primary">
              <span className="material-symbols-outlined">search</span>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-surface-container-low border-none rounded-full py-2.5 pl-10 pr-6 w-64 lg:w-80 focus:ring-2 focus:ring-primary/20 text-body-main placeholder:text-on-surface-variant/60"
              placeholder="Search atmospheric data..."
            />
          </div>

          {/* Notification */}
          <IconButton icon="notifications" />

          <div className="h-8 w-px bg-outline-variant/30 mx-1 hidden sm:block" />

          {/* User avatar area */}
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="w-10 h-10 rounded-full bg-primary-fixed overflow-hidden border-2 border-primary/20 group-hover:border-primary transition-all">
              <div className="w-full h-full bg-primary-container flex items-center justify-center text-on-primary-container">
                <span className="material-symbols-outlined">person</span>
              </div>
            </div>
          </div>

          {/* Extra actions from parent */}
          {children}
        </div>
      </div>
    </header>
  );
}
