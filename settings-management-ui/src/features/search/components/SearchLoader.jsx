function SearchLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <div className="w-12 h-12 border-[3px] border-surface-200 dark:border-white/10 border-t-brand rounded-full animate-spin shadow-glow" />
      <p className="text-sm font-semibold text-text-secondary animate-pulse">Searching settings...</p>
    </div>
  );
}

export default SearchLoader;