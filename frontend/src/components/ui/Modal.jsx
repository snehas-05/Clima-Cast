import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TIMING, EASING } from '../../utils/motion';

export default function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-var(--spacing-lg) sm:p-var(--spacing-xl)">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: TIMING.MEDIUM, ease: EASING.SOFT }}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            onClick={onClose}
          />
          
          {/* Modal Content */}
          <motion.div 
            initial={{ opacity: 0, y: 14, scale: 0.985, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 10, scale: 0.985, filter: 'blur(4px)' }}
            transition={{ duration: TIMING.MEDIUM, ease: EASING.CINEMATIC }}
            className="relative w-full max-w-[var(--spacing-modal-max-width)] glass-card rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Premium padding structure */}
            <div className="p-var(--spacing-lg) sm:p-var(--spacing-xl)">
              {/* Decorative background element */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] -mr-32 -mt-32 rounded-full pointer-events-none" />
              
              <div className="relative z-10">
                {/* Header section with refined spacing */}
                <div className="flex justify-between items-start gap-var(--spacing-xl) mb-var(--spacing-lg) pb-var(--spacing-lg) border-b border-white/5">
                  <h2 className="text-2xl font-bold leading-tight text-on-surface max-w-[480px] break-words">{title}</h2>
                  <button 
                    onClick={onClose}
                    className="p-2 hover:bg-on-surface/10 rounded-full transition-colors flex items-center justify-center shrink-0 touch-target"
                    aria-label="Close modal"
                  >
                    <span className="material-symbols-outlined text-on-surface text-2xl">close</span>
                  </button>
                </div>
                
                {/* Content with optimized scrolling and spacing */}
                <div className="modal-scrollbar max-h-[64vh] overflow-y-auto modal-content-stack">
                  {children}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
