import Card from "../../../components/ui/Card";

function StatsCard({
  title,
  value,
  color,
  icon: Icon
}) {
  return (
    <Card className="hover:-translate-y-1 hover:shadow-gold-btn transition-all duration-300 group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-text-secondary mb-1 tracking-wider uppercase">
            {title}
          </p>
          <h2 className="text-3xl font-bold font-heading text-surface-900 dark:text-text-main tracking-tight">
            {value}
          </h2>
        </div>
        <div
          className={`w-14 h-14 rounded-[14px] ${color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}
        >
          {Icon && <Icon size={24} />}
        </div>
      </div>
    </Card>
  );
}

export default StatsCard;