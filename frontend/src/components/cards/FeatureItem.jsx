export default function FeatureItem({ icon, iconBg, iconColor, title, description }) {
  return (
    <div className="flex gap-4">
      <div className={`w-12 h-12 rounded-full ${iconBg || 'bg-primary-container/20'} flex items-center justify-center ${iconColor || 'text-primary'} shrink-0`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div>
        <h4 className="text-h3-card-title text-on-surface">{title}</h4>
        <p className="text-body-main text-on-surface-variant">{description}</p>
      </div>
    </div>
  );
}
