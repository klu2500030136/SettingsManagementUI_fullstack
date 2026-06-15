import { Activity } from "lucide-react";
import Card from "../../../components/ui/Card";

const activities = [
  "Admin updated notification settings",
  "User changed dark mode preference",
  "Security configuration modified",
  "New category created",
];

function ActivityFeed() {
  return (
    <Card>
      <div className="flex items-center gap-2 mb-6">
        <Activity size={20} className="text-brand" />
        <h2 className="text-xl font-bold font-heading text-surface-900 dark:text-text-main tracking-tight">
          Recent Activity
        </h2>
      </div>

      <div className="relative border-l border-border-goldLight ml-3 space-y-6">
        {activities.map((activity, index) => (
          <div key={index} className="relative pl-6">
            {/* Timeline Dot */}
            <span className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-surface-900 dark:bg-[#1C1C1C] border-2 border-brand shadow-gold-btn" />
            
            <p className="text-sm font-medium text-surface-700 dark:text-text-main leading-relaxed">
              {activity}
            </p>
            <p className="text-xs font-medium text-text-secondary mt-1">
              {index === 0 ? 'Just now' : `${index * 2} hours ago`}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default ActivityFeed;