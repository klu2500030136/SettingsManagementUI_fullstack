function PreferenceCard({
  title,
  description,
  children,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

      <div className="mb-4">

        <h2 className="text-2xl font-bold text-slate-800">
          {title}
        </h2>

        <p className="text-slate-500 mt-1">
          {description}
        </p>

      </div>

      {children}

    </div>
  );
}

export default PreferenceCard;