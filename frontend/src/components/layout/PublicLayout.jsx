import { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

import Modal from '../ui/Modal';
import ThemeToggle from '../ui/ThemeToggle';

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
    <div className="min-h-screen w-full min-w-0 flex flex-col">
      {/* Top Navigation */}
      <header className="fixed top-0 w-full z-50 transition-colors duration-500 pt-6 pointer-events-none">
        <div className="flex justify-center items-center px-6 lg:px-[var(--spacing-container-padding)] max-w-[1440px] mx-auto">
          <div className="flex items-center gap-6 glass-card bg-slate-200/50 dark:bg-transparent !rounded-full px-6 py-3 pointer-events-auto shadow-md dark:shadow-2xl">
            <ThemeToggle />
            <button 
              onClick={() => navigate('/login')}
              className="w-10 h-10 flex items-center justify-center rounded-full text-slate-700 dark:text-slate-400 hover:text-primary-forced dark:hover:text-white hover:bg-slate-900/10 dark:hover:bg-white/5 transition-colors"
              title="Notifications (Login required)"
            >
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="w-10 h-10 flex items-center justify-center rounded-full text-slate-700 dark:text-slate-400 hover:text-primary-forced dark:hover:text-white hover:bg-slate-900/10 dark:hover:bg-white/5 transition-colors"
              title="Profile (Login required)"
            >
              <span className="material-symbols-outlined">account_circle</span>
            </button>
            <Link
              to="/login"
              className="bg-indigo-600/90 text-white px-6 py-2 rounded-full text-label-caps tracking-wider hover:bg-indigo-500 transition-all duration-300 shadow-lg shadow-black/20"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-1 w-full min-w-0">
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
