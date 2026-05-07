import { Link, Outlet } from 'react-router-dom';
import Footer from './Footer';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col atmospheric-bg">
      {/* Minimal Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-20 px-6 lg:px-[var(--spacing-container-padding)] max-w-[1440px] mx-auto w-full">
        <Link to="/" className="text-h3-card-title font-bold text-primary tracking-tight">
          Clima-Cast
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-label-caps text-on-surface-variant hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/about" className="text-label-caps text-on-surface-variant hover:text-primary transition-colors">
            About
          </Link>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-grow flex items-center justify-center px-6 py-20 relative overflow-hidden">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
