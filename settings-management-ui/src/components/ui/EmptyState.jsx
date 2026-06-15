function EmptyState({
  title,
  description,
}) {
  return (
    <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-10 text-center">

      <h2 className="text-2xl font-bold text-slate-700">
        {title}
      </h2>

      <p className="text-slate-500 mt-3">
        {description}
      </p>

    </div>
  );
}

export default EmptyState;