function SkeletonLoader({
  height = "h-24",
}) {
  return (
    <div
      className={`
        w-full ${height}
        bg-slate-200
        animate-pulse
        rounded-2xl
      `}
    />
  );
}

export default SkeletonLoader;