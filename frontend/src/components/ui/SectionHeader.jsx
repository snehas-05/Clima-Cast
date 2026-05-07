export default function SectionHeader({ title, subtitle, children }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
      <div>
        <h2 className="text-h2-dashboard text-on-surface">{title}</h2>
        {subtitle && (
          <p className="text-body-lg text-on-surface-variant mt-1">{subtitle}</p>
        )}
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </div>
  );
}
