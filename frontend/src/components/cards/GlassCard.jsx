export default function GlassCard({
  children,
  className = '',
  rounded = '2xl',
  padding = '8',
  hover = false,
  ...props
}) {
  return (
    <div
      className={`glass-card rounded-${rounded} p-${padding}
        ${hover ? 'hover:-translate-y-1 transition-transform duration-300' : ''}
        ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
