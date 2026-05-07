export default function IconButton({
  icon,
  badge = false,
  className = '',
  ...props
}) {
  return (
    <button
      className={`p-2 text-on-surface-variant hover:text-primary transition-colors relative ${className}`}
      {...props}
    >
      <span className="material-symbols-outlined">{icon}</span>
      {badge && (
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full border-2 border-white" />
      )}
    </button>
  );
}
