import Card from "../../../components/ui/Card";

function AdminStats({ stats }) {
  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers ?? 0,
      color: "bg-brand/10 text-brand border border-brand/20",
    },
    {
      title: "Admins",
      value: stats?.adminCount ?? 0,
      color: "bg-rose-500/10 text-rose-500 border border-rose-500/20",
    },
    {
      title: "Standard Users",
      value: stats?.userCount ?? 0,
      color: "bg-amber-500/10 text-amber-500 border border-amber-500/20",
    },
    {
      title: "Active Users",
      value: stats?.activeUserCount ?? 0,
      color: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <Card key={index} className="hover:-translate-y-1 hover:shadow-gold-btn transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-xs font-semibold uppercase tracking-wider mb-1">
                {stat.title}
              </p>
              <h2 className="text-3xl font-bold font-heading text-surface-900 dark:text-text-main tracking-tight mt-2">
                {stat.value}
              </h2>
            </div>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.color}`}>
              {/* Optional: Add icon here if desired in future */}
              <div className="w-6 h-6 bg-current rounded opacity-50" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default AdminStats;
