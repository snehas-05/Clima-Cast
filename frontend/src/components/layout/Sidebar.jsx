import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
  { to: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { to: '/forecast', icon: 'sunny', label: 'Forecast' },
  { to: '/predictions', icon: 'psychology', label: 'AI Predictions' },
  { to: '/analytics', icon: 'insights', label: 'Analytics' },
  { to: '/map', icon: 'explore_nearby', label: 'Map' },
  { to: '/saved-cities', icon: 'location_city', label: 'Saved Cities' },
  { to: '/alerts', icon: 'warning', label: 'Alerts' },
  { to: '/profile', icon: 'person', label: 'Profile' },
  { to: '/settings', icon: 'settings', label: 'Settings' },
];

const bottomItems = [
  { icon: 'help_outline', label: 'Support', action: 'support' },
  { icon: 'logout', label: 'Log Out', action: 'logout' },
];

export default function Sidebar({ isOpen, onClose }) {
  const { logout } = useAuth();

  const handleAction = (action) => {
    if (action === 'logout') {
      logout();
    } else if (action === 'support') {
      alert("Opening Support Hub...");
    }
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={onClose}
          role="button"
          aria-label="Close sidebar menu"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onClose()}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full w-[280px] glass-sidebar flex flex-col py-8 px-6 gap-y-4 z-50
          transition-transform duration-300 lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        aria-label="Main Navigation Sidebar"
      >
        {/* Brand */}
        <div className="mb-8 px-2">
          <h1 className="text-h3-card-title font-bold text-primary tracking-tight">
            Clima-Cast
          </h1>
          <p className="text-label-caps text-on-surface-variant opacity-70">
            Intelligence Hub
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar" aria-label="Primary Navigation">
          {navItems.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              aria-label={`Navigate to ${label}`}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${isActive
                   ? 'bg-secondary-container/10 border-l-4 border-primary text-primary font-semibold'
                   : 'text-on-surface-variant hover:bg-secondary-container/5 hover:text-primary'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className="material-symbols-outlined"
                    aria-hidden="true"
                    style={
                      isActive
                        ? { fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }
                        : undefined
                    }
                  >
                    {icon}
                  </span>
                  <span className="text-body-main">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="mt-auto border-t border-outline-variant/30 pt-6 space-y-1">
          {bottomItems.map(({ icon, label, action }) => (
            <button
              key={action}
              onClick={() => handleAction(action)}
              aria-label={label}
              className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                ${action === 'logout'
                   ? 'text-on-surface-variant hover:text-error'
                   : 'text-on-surface-variant hover:text-primary'
                }`}
            >
              <span className="material-symbols-outlined" aria-hidden="true">{icon}</span>
              <span className="text-body-main">{label}</span>
            </button>
          ))}
        </div>
      </aside>
    </>
  );
}
