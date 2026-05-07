import { Link, NavLink, Outlet } from 'react-router-dom';
import Footer from './Footer';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation */}
      <header className="glass-topbar sticky top-0 z-50">
        <div className="flex justify-between items-center h-20 px-6 lg:px-[var(--spacing-container-padding)] max-w-[1440px] mx-auto">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-h3-card-title font-bold text-primary tracking-tight">
              Clima-Cast
            </Link>
            <nav className="hidden md:flex gap-6">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `text-label-caps ${isActive
                    ? 'text-primary font-bold border-b-2 border-primary pb-1'
                    : 'text-on-surface-variant font-medium hover:text-primary transition-colors duration-200'
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `text-label-caps ${isActive
                    ? 'text-primary font-bold border-b-2 border-primary pb-1'
                    : 'text-on-surface-variant font-medium hover:text-primary transition-colors duration-200'
                  }`
                }
              >
                About
              </NavLink>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">
              notifications
            </button>
            <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">
              account_circle
            </button>
            <Link
              to="/login"
              className="hidden md:block bg-primary text-on-primary px-6 py-2 rounded-full text-label-caps hover:opacity-90 active:scale-95 transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
