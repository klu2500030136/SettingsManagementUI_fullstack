import { ShieldAlert, User, ShieldCheck } from "lucide-react";
import Card from "../../../components/ui/Card";

const logs = [
  {
    user: "Admin",
    action: "Updated email notifications",
    icon: ShieldCheck,
    color: "text-brand bg-brand/10",
    time: "2 mins ago"
  },
  {
    user: "User",
    action: "Changed theme preference",
    icon: User,
    color: "text-white bg-white/10",
    time: "1 hour ago"
  },
  {
    user: "Admin",
    action: "Created security category",
    icon: ShieldAlert,
    color: "text-rose-400 bg-rose-400/10",
    time: "3 hours ago"
  },
];

function LogsPreview() {
  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold font-heading text-surface-900 dark:text-text-main tracking-tight">
          System Logs
        </h2>
        <button className="text-sm font-semibold text-brand hover:text-brand-hover transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {logs.map((log, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-3 hover:bg-surface-50 dark:hover:bg-white/5 rounded-xl transition-colors duration-300"
          >
            <div className={`w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 ${log.color} shadow-inner`}>
              <log.icon size={18} />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-surface-900 dark:text-text-main text-sm truncate">
                {log.user}
              </p>
              <p className="text-sm text-text-secondary truncate">
                {log.action}
              </p>
            </div>

            <div className="text-xs font-medium text-surface-400 dark:text-surface-500 whitespace-nowrap">
              {log.time}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default LogsPreview;