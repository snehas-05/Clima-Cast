import { useEffect } from 'react';

export default function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-md transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-2xl glass-card rounded-[2.5rem] p-8 md:p-10 shadow-2xl overflow-hidden animate-fade-in scale-up">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] -mr-32 -mt-32 rounded-full pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-h2-dashboard text-on-surface">{title}</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-on-surface/10 rounded-full transition-colors flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-on-surface text-2xl">close</span>
            </button>
          </div>
          
          <div className="custom-scrollbar max-h-[70vh] overflow-y-auto pr-2">
            {children}
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .scale-up {
          animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
    </div>
  );
}
