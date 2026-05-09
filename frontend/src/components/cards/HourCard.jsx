export default function HourCard({ time, icon, temperature, isActive = false, iconStyle }) {
  return (
    <div
      className={`flex-shrink-0 w-24 flex flex-col items-center p-4 rounded-2xl transition-all duration-300
        ${isActive
          ? 'bg-primary/10 border-2 border-primary/30 shadow-lg shadow-primary/10'
          : 'bg-white/5 border border-white/10 hover:bg-white/10'
        }`}
    >
      <p className={`text-label-caps mb-3 font-medium tracking-wider ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}>
        {time}
      </p>
      <span
        className={`material-symbols-outlined mb-3 text-2xl ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}
        style={{ ...iconStyle, fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
      >
        {icon}
      </span>
      <p className={`text-h3-card-title font-bold ${isActive ? 'text-primary' : 'text-on-surface'}`}>
        {temperature}
      </p>
    </div>
  );
}
