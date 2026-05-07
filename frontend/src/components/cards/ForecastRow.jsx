export default function ForecastRow({ day, icon, iconColor, high, low, barWidth }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-outline-variant/10 last:border-b-0">
      <p className="w-16 text-body-main text-on-surface">{day}</p>
      <span className={`material-symbols-outlined ${iconColor || 'text-primary/70'}`}>
        {icon}
      </span>
      <div className="flex items-center gap-4">
        <span className="text-on-surface font-semibold">{high}</span>
        <div className="w-24 h-1.5 bg-outline-variant/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-tertiary rounded-full"
            style={{ width: barWidth }}
          />
        </div>
        <span className="text-on-surface-variant">{low}</span>
      </div>
    </div>
  );
}
