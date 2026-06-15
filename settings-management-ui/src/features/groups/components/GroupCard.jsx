function GroupCard({ group }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-bold text-slate-800">
            {group.name}
          </h2>

          <p className="text-slate-500 mt-2">
            {group.description}
          </p>

        </div>

        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">

          <span className="text-2xl font-bold text-blue-600">
            {group.settingsCount}
          </span>

        </div>

      </div>

    </div>
  );
}

export default GroupCard;