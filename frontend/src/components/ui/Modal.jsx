import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TIMING, EASING } from '../../utils/motion';

export default function Modal({ isOpen, onClose, title, children, anchorRect }) {
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

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          className="modal-root"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            minHeight: '100vh',
            padding: '1rem',
            overflowX: 'hidden',
            overflowY: 'auto',
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(8px)'
          }}
        >
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: TIMING.MEDIUM, ease: EASING.SOFT }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal Content */}
          <motion.div 
            initial={{ opacity: 0, y: 14, scale: 0.985, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 10, scale: 0.985, filter: 'blur(4px)' }}
            transition={{ duration: TIMING.MEDIUM, ease: EASING.CINEMATIC }}
            className="relative rounded-2xl overflow-hidden modal-panel"
            style={{
              width: '100%',
              minWidth: '20rem',
              maxWidth: 'min(90vw, 640px)',
              maxHeight: '90vh',
              minHeight: 0
            }}
          >
            {/* Premium padding structure */}
            <div className="p-var(--spacing-lg) sm:p-var(--spacing-xl)">
              {/* Decorative background element */}
              <div className="modal-decor" />
              
              <div className="relative z-10">
                {/* Header section with refined spacing */}
                <div className="modal-header">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-var(--spacing-xl)">
                    <h2 className="text-2xl font-bold leading-tight text-on-surface max-w-[480px] break-words w-full">{title}</h2>
                    <button 
                      onClick={onClose}
                      className="mt-4 sm:mt-0 p-2 hover:bg-on-surface/10 rounded-full transition-colors flex items-center justify-center shrink-0 touch-target"
                      aria-label="Close modal"
                    >
                      <span className="material-symbols-outlined text-on-surface text-2xl">close</span>
                    </button>
                  </div>
                  <div className="modal-separator" />
                </div>
                
                {/* Content with optimized scrolling and spacing */}
                <div className="modal-scrollbar max-h-[64vh] overflow-y-auto modal-content-stack min-w-0 modal-body">
                  {children}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
