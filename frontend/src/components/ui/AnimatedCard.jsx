import React from 'react';
import { motion } from 'framer-motion';
import { HOVER, TRANSITIONS } from '../../utils/motion';

/**
 * AnimatedCard
 * 
 * A premium wrapper for cards that implements depth-based hover effects
 * and soft-reveal entry animations.
 */
export default function AnimatedCard({ 
  children, 
  className = "", 
  onClick, 
  delay = 0,
  noHover = false,
  ...props 
}) {
  return (
    <motion.div
      initial={TRANSITIONS.SOFT_REVEAL.initial}
      animate={{
        ...TRANSITIONS.SOFT_REVEAL.animate,
        transition: { 
          ...TRANSITIONS.SOFT_REVEAL.transition, 
          delay 
        }
      }}
      {...(!noHover && onClick ? HOVER.DEPTH : {})}
      className={`glass-card rounded-[2rem] p-6 border border-white/5 relative overflow-hidden transition-colors ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
}
