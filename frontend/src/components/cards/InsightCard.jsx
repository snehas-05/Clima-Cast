export default function InsightCard({ icon, iconBg, iconColor, title, titleColor, description }) {
  return (
    <div className="flex gap-4 items-start">
      <div className={`p-3 ${iconBg || 'bg-primary/10'} rounded-2xl ${iconColor || 'text-primary'}`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div>
        <p className={`font-semibold mb-1 ${titleColor || 'text-primary'}`}>{title}</p>
        <p className="text-body-main text-on-surface-variant leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
