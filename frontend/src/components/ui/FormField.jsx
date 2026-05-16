export default function FormField({
  label,
  icon,
  type = 'text',
  placeholder,
  id,
  name,
  value,
  onChange,
  rightElement,
  autoComplete,
  className = '',
}) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <div className="flex justify-between items-center px-1">
          <label htmlFor={id} className="text-label-caps text-on-surface-variant">
            {label}
          </label>
          {rightElement}
        </div>
      )}
      <div className="relative group">
        {icon && (
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 group-focus-within:text-primary transition-colors">
            {icon}
          </span>
        )}
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full ${icon ? 'pl-12' : 'pl-4'} pr-4 py-3 bg-white/50 border border-outline-variant/30
            rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none
            transition-all placeholder:text-on-surface-variant/30 text-body-main`}
        />
      </div>
    </div>
  );
}
