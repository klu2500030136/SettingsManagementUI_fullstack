import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";

function SystemSettingsPanel() {
  return (
    <Card>
      <h2 className="text-2xl font-bold font-heading text-surface-900 dark:text-text-main mb-6 tracking-tight">
        System Settings
      </h2>

      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 rounded-xl glass-card dark:glass-panel-dark border border-surface-200 dark:border-white/10 transition-colors">
          <div>
            <h3 className="font-bold text-surface-900 dark:text-text-main">
              Maintenance Mode
            </h3>
            <p className="text-sm font-medium text-text-secondary mt-1">
              Enable system maintenance mode
            </p>
          </div>
          <button className="px-4 py-2 rounded-[12px] text-sm font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors">
            Enabled
          </button>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl glass-card dark:glass-panel-dark border border-surface-200 dark:border-white/10 transition-colors">
          <div>
            <h3 className="font-bold text-surface-900 dark:text-text-main">
              Public Registration
            </h3>
            <p className="text-sm font-medium text-text-secondary mt-1">
              Allow public user signups
            </p>
          </div>
          <button className="px-4 py-2 rounded-[12px] text-sm font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/20 transition-colors">
            Disabled
          </button>
        </div>
      </div>
    </Card>
  );
}

export default SystemSettingsPanel;