import { Link } from 'react-router-dom';

const footerLinks = [
  { label: 'Terms of Service', to: '#' },
  { label: 'Privacy Policy', to: '#' },
  { label: 'Climate Mission', to: '#' },
  { label: 'Contact Support', to: '#' },
];

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-outline-variant/30 w-full py-12 mt-auto">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-[var(--spacing-container-padding)] flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col items-center md:items-start gap-2">
          <span className="text-h3-card-title font-bold text-on-surface">
            Clima-Cast
          </span>
          <p className="text-body-main text-on-surface-variant text-center md:text-left">
            © 2024 Clima-Cast AI. Empowering climate-resilient decisions.
          </p>
        </div>
        <nav className="flex flex-wrap justify-center gap-6 lg:gap-8">
          {footerLinks.map(({ label, to }) => (
            <Link
              key={label}
              to={to}
              className="text-label-caps text-on-surface-variant hover:text-primary transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
