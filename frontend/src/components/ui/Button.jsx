const variants = {
  primary:
    'bg-gradient-to-r from-primary to-secondary text-on-primary shadow-lg hover:shadow-primary/20',
  solid:
    'bg-primary text-on-primary hover:opacity-90',
  ghost:
    'bg-transparent border border-outline-variant text-on-surface-variant hover:bg-primary/5',
  glass:
    'bg-white/40 backdrop-blur-md border border-outline-variant/30 text-on-surface hover:bg-white/60',
  danger:
    'bg-error text-on-error hover:opacity-90',
};

const sizes = {
  sm: 'px-4 py-2 text-label-caps',
  md: 'px-6 py-3 text-body-main font-semibold',
  lg: 'px-10 py-4 text-h3-card-title',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  rounded = 'full',
  className = '',
  ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2
        rounded-${rounded} active:scale-95 transition-all duration-200
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
