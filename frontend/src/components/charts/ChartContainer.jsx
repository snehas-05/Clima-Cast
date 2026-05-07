export default function ChartContainer({ title, subtitle, actions, children, className = '' }) {
  return (
    <div className={`glass-card rounded-3xl p-8 ${className}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h4 className="text-h3-card-title text-on-surface">{title}</h4>
          {subtitle && (
            <p className="text-body-main text-on-surface-variant/60">{subtitle}</p>
          )}
        </div>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  );
}
