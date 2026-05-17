import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';

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
      <header className="fixed top-0 w-full z-50 bg-slate-950/30 backdrop-blur-2xl border-b border-white/5 transition-colors duration-500 hover:bg-slate-950/50">
        <div className="flex justify-between items-center h-20 px-6 lg:px-[var(--spacing-container-padding)] max-w-[1440px] mx-auto">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-h3-card-title font-light text-white tracking-widest drop-shadow-md">
              Clima-Cast
            </Link>
            <nav className="hidden md:flex gap-8">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `text-label-caps tracking-wider transition-all duration-300 ${isActive
                    ? 'text-white font-medium drop-shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `text-label-caps tracking-wider transition-all duration-300 ${isActive
                    ? 'text-white font-medium drop-shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                  }`
                }
              >
                About
              </NavLink>
            </nav>
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate('/login')}
              className="material-symbols-outlined text-slate-500 hover:text-slate-300 transition-colors"
              title="Notifications (Login required)"
            >
              notifications
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="material-symbols-outlined text-slate-500 hover:text-slate-300 transition-colors"
              title="Profile (Login required)"
            >
              account_circle
            </button>
            <Link
              to="/login"
              className="hidden md:block bg-slate-800/80 border border-slate-700/50 text-slate-200 px-6 py-2 rounded-full text-label-caps tracking-wider hover:bg-slate-700 hover:text-white transition-all duration-300 shadow-lg shadow-black/20"
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
