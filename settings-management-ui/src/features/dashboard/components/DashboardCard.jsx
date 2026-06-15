import React from "react";

function DashboardCard({
  title,
  value,
  color,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-slate-500 text-sm">
            {title}
          </p>

          <h2 className="text-4xl font-bold text-slate-800 mt-2">
            {value}
          </h2>

        </div>

        <div
          className={`w-16 h-16 rounded-2xl ${color}`}
        />

      </div>

    </div>
  );
}

export default React.memo(DashboardCard);