export default function WeatherCard({
  city,
  country,
  temperature,
  condition,
  weatherIcon,
  iconStyle,
  iconColor = 'text-on-surface-variant',
  gradientClass = '',
  trendPath,
  onRemove,
}) {
  return (
    <div className={`glass-card ${gradientClass} rounded-3xl p-6 relative group`}>
      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-error/10 hover:text-error"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      )}

      <div className="flex justify-between items-start mb-8">
        <div>
          <h3 className="text-h3-card-title text-on-surface">{city}</h3>
          <p className="text-label-caps text-on-surface-variant">{country}</p>
        </div>
        <span
          className={`material-symbols-outlined text-4xl ${iconColor}`}
          style={iconStyle || { fontVariationSettings: "'FILL' 1" }}
        >
          {weatherIcon}
        </span>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <span className="text-6xl font-bold text-on-surface tracking-tighter">
            {temperature}
          </span>
          <p className="text-body-main text-on-surface-variant">{condition}</p>
        </div>
        {trendPath && (
          <div className="w-24 h-12">
            <svg className="w-full h-full" viewBox="0 0 100 40">
              <path
                d={trendPath}
                fill="none"
                stroke="#4f378a"
                strokeLinecap="round"
                strokeWidth="3"
              />
              <circle cx="100" cy={trendPath.split(' ').pop()} fill="#4f378a" r="3" />
            </svg>
            <p className="text-center text-label-caps text-[10px] mt-1 text-on-surface-variant">
              3-DAY TREND
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
