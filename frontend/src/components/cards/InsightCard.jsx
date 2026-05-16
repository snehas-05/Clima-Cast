export default function InsightCard({ icon, iconBg, iconColor, title, titleColor, description, onClick }) {
  return (
    <div 
      className={`flex gap-4 items-start p-4 -m-4 rounded-2xl transition-all duration-300 group ${onClick ? 'cursor-pointer hover:bg-white/10 active:scale-95' : ''}`}
      onClick={onClick}
    >
      <div className={`p-3 ${iconBg || 'bg-primary/10'} rounded-2xl ${iconColor || 'text-primary'} transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 shadow-lg shadow-black/5`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div>
        <p className={`font-semibold mb-1 ${titleColor || 'text-primary'} transition-colors group-hover:text-on-surface`}>{title}</p>
        <p className="text-body-main text-on-surface-variant leading-relaxed group-hover:text-on-surface/80 transition-colors">{description}</p>
      </div>
    </div>
  );
}
