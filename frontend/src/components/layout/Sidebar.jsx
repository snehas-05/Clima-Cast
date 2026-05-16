import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { TIMING, EASING } from '../../utils/motion';

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
      <AnimatePresence>
        {/* Mobile overlay */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: TIMING.MEDIUM }}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
            role="button"
            aria-label="Close sidebar menu"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ 
          x: isOpen ? 0 : (window.innerWidth < 1024 ? -280 : 0)
        }}
        drag={window.innerWidth < 1024 ? "x" : false}
        dragConstraints={{ left: -280, right: 0 }}
        dragElastic={0.05}
        onDragEnd={(e, { offset, velocity }) => {
          if (offset.x < -100 || velocity.x < -500) {
            onClose();
          }
        }}
        transition={{ duration: TIMING.MEDIUM, ease: EASING.CINEMATIC }}
        className={`fixed left-0 top-0 h-full w-[280px] glass-sidebar flex flex-col py-8 px-6 gap-y-4 z-50
          lg:translate-x-0 dark:bg-[#030712]/95 dark:border-r dark:border-white/5 shadow-2xl transition-colors duration-1000`}
        style={{
          '--accent-glow': 'var(--atmospheric-glow, rgba(var(--primary-rgb), 0.05))',
          background: 'linear-gradient(to bottom, var(--accent-glow) 0%, transparent 100%)'
        }}
        aria-label="Main Navigation Sidebar"
      >
        {/* Brand */}
        <div className="mb-8 px-2 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <span className="material-symbols-outlined text-primary text-2xl">cloud</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-on-surface tracking-tight">
              Clima-Cast
            </h1>
            <p className="text-[10px] font-bold text-primary/70 tracking-[0.2em] uppercase">
              Intelligence Hub
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto no-scrollbar" aria-label="Primary Navigation">
          {navItems.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              aria-label={`Navigate to ${label}`}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group
                ${isActive
                   ? 'bg-primary/10 text-primary font-bold border border-primary/20 shadow-inner shadow-primary/10'
                   : 'text-on-surface-variant hover:bg-white/5 hover:text-on-surface'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`material-symbols-outlined transition-all duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:text-primary'}`}
                    aria-hidden="true"
                    style={
                      isActive
                         ? { fontVariationSettings: "'FILL' 1, 'wght' 600" }
                         : undefined
                    }
                  >
                    {icon}
                  </span>
                  <span className="text-sm tracking-wide">{label}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="sidebar-active-indicator"
                      className="ml-auto w-1 h-4 rounded-full bg-primary shadow-[0_0_12px_rgba(192,132,252,0.8)]" 
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="mt-auto border-t border-white/5 pt-6 space-y-1">
          {bottomItems.map(({ icon, label, action }) => (
            <button
              key={action}
              onClick={() => handleAction(action)}
              aria-label={label}
              className={`w-full text-left flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all group
                ${action === 'logout'
                   ? 'text-on-surface-variant hover:bg-error/10 hover:text-error'
                   : 'text-on-surface-variant hover:bg-white/5 hover:text-primary'
                }`}
            >
              <span className="material-symbols-outlined transition-transform group-hover:scale-110" aria-hidden="true">{icon}</span>
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </div>
      </motion.aside>
    </>
  );
}
