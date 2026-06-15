import { useState, useEffect } from "react";
import StatsCard from "../features/dashboard/components/StatsCard";
import ActivityFeed from "../features/dashboard/components/ActivityFeed";
import QuickSearch from "../features/dashboard/components/QuickSearch";
import LogsPreview from "../features/dashboard/components/LogsPreview";
import StatisticsChart from "../features/dashboard/components/StatisticsChart";
import { Settings, Folder, SlidersHorizontal, Activity } from "lucide-react";
import axiosInstance from "../services/api/axios";

function DashboardPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await axiosInstance.get("/dashboard/stats");
        setStats({
          totalSettings: response.data.totalSettings,
          totalCategories: response.data.totalCategories,
          totalPreferences: response.data.totalPreferences,
          totalAuditLogs: response.data.totalAuditLogs
        });
      } catch (error) {
        console.error("Error fetching dashboard statistics:", error);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      
      {/* Heading */}
      <div>
        <h1 className="text-3xl font-bold font-heading text-surface-900 dark:text-text-main tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-text-secondary mt-1.5 text-base font-medium">
          Monitor your settings and infrastructure activities.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatsCard
          title="Total Settings"
          value={stats?.totalSettings?.toString() ?? ""}
          icon={Settings}
          color="bg-gold-gradient text-[#0B0B0B]"
        />
        <StatsCard
          title="Categories"
          value={stats?.totalCategories?.toString() ?? ""}
          icon={Folder}
          color="bg-white/10 dark:bg-white/5 text-surface-900 dark:text-text-main border border-border-goldLight"
        />
        <StatsCard
          title="Preferences"
          value={stats?.totalPreferences?.toString() ?? ""}
          icon={SlidersHorizontal}
          color="bg-white/10 dark:bg-white/5 text-surface-900 dark:text-text-main border border-border-goldLight"
        />
        <StatsCard
          title="Recent Changes"
          value={stats?.totalAuditLogs?.toString() ?? ""}
          icon={Activity}
          color="bg-white/10 dark:bg-white/5 text-surface-900 dark:text-text-main border border-border-goldLight"
        />
      </div>

      {/* Main Widgets */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Side */}
        <div className="xl:col-span-2 space-y-6 min-w-0">
          <div className="w-full overflow-hidden">
            <StatisticsChart />
          </div>
          <LogsPreview />
        </div>

        {/* Right Side */}
        <div className="space-y-6">
          <QuickSearch />
          <ActivityFeed />
        </div>

      </div>
    </div>
  );
}

export default DashboardPage;
