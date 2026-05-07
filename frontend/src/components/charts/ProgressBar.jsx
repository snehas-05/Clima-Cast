export default function ProgressBar({ label, value, barColor = 'bg-primary', maxLabel }) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-body-main text-on-surface">{label}</span>
        <span className={`font-bold ${barColor === 'bg-primary' ? 'text-primary' : 'text-on-surface-variant'}`}>
          {maxLabel || value}
        </span>
      </div>
      <div className="h-2 w-full bg-surface-container-highest rounded-full">
        <div
          className={`h-full ${barColor} rounded-full transition-all duration-500`}
          style={{ width: typeof value === 'string' ? value : `${value}%` }}
        />
      </div>
    </div>
  );
}
