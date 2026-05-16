import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TIMING, EASING } from '../../utils/motion';

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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8">
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
            initial={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
            transition={{ duration: TIMING.MEDIUM, ease: EASING.CINEMATIC }}
            className="relative w-full max-w-2xl glass-card rounded-[2.5rem] p-8 md:p-10 shadow-2xl overflow-hidden"
          >
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] -mr-32 -mt-32 rounded-full pointer-events-none" />
            
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
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
