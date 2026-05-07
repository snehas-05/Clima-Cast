export default function BarChart({ data = [], labels = [] }) {
  return (
    <div>
      <div className="h-48 flex items-end justify-between gap-2 px-4">
        {data.map((item, i) => (
          <div key={i} className="w-full relative group">
            <div
              className={`bg-primary/${item.opacity || 20} rounded-t-lg transition-all`}
              style={{ height: `${item.height}%` }}
            >
              {item.tooltip && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-on-surface text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {item.tooltip}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {labels.length > 0 && (
        <div className="flex justify-between mt-4 text-label-caps text-on-surface-variant px-4">
          {labels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      )}
    </div>
  );
}
