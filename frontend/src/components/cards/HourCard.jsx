export default function HourCard({ time, icon, temperature, isActive = false, iconStyle }) {
  return (
    <div
      className={`flex-shrink-0 w-24 flex flex-col items-center p-4 rounded-2xl transition-all
        ${isActive
          ? 'bg-primary/5 border-2 border-primary/20'
          : 'bg-white/40 border border-white/50'
        }`}
    >
      <p className={`text-label-caps mb-3 ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}>
        {time}
      </p>
      <span
        className={`material-symbols-outlined mb-3 ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}
        style={iconStyle}
      >
        {icon}
      </span>
      <p className={`text-h3-card-title ${isActive ? 'text-primary' : 'text-on-surface'}`}>
        {temperature}
      </p>
    </div>
  );
}
