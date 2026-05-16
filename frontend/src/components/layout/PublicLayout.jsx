import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import Footer from './Footer';
import Modal from '../ui/Modal';

export default function PublicLayout() {
  const navigate = useNavigate();
  const [modalConfig, setModalConfig] = useState({ isOpen: false, title: '', content: null });

  const openModal = (title, content) => {
    setModalConfig({ isOpen: true, title, content });
  };

  const closeModal = () => {
    setModalConfig({ ...modalConfig, isOpen: false });
  };

  const handleContactSales = () => {
    openModal('Contact Sales', (
      <div className="space-y-6">
        <p className="text-body-lg text-on-surface-variant">Our enterprise solutions provide dedicated atmospheric intelligence for high-stakes decision making.</p>
        <div className="p-6 bg-primary/5 rounded-3xl border border-primary/20">
          <h4 className="font-bold text-primary mb-2">Connect with our team</h4>
          <p className="text-on-surface mb-4">Please email <span className="font-bold">enterprise@clima-cast.ai</span> or call our 24/7 support line.</p>
          <button onClick={closeModal} className="w-full py-3 bg-primary text-on-primary rounded-xl font-bold hover:opacity-90 transition-all">
            Back to Home
          </button>
        </div>
      </div>
    ));
  };

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
            <button 
              onClick={() => navigate('/login')}
              className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors"
              title="Notifications (Login required)"
            >
              notifications
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors"
              title="Profile (Login required)"
            >
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
        <Outlet context={{ openModal, handleContactSales }} />
      </main>

      <Footer onLinkClick={(label) => openModal(label, <p className="text-body-lg text-on-surface-variant py-8">Information regarding <span className="text-primary font-bold">{label}</span> is currently being finalized for the 2026 deployment phase. Please contact our support team for immediate inquiries.</p>)} />

      <Modal 
        isOpen={modalConfig.isOpen} 
        onClose={closeModal} 
        title={modalConfig.title}
      >
        {modalConfig.content}
      </Modal>
    </div>
  );
}
