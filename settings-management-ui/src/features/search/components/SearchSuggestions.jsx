const suggestions = [
  "Dark mode settings",
  "Notification preferences",
  "Security authentication",
  "Language settings",
];

function SearchSuggestions({ setQuery }) {
  return (
    <div className="flex flex-wrap gap-3">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => setQuery(suggestion)}
          className="glass-card dark:glass-panel-dark text-surface-700 dark:text-text-secondary font-semibold text-sm px-4 py-2.5 rounded-[12px] border border-surface-200 dark:border-white/10 hover:bg-brand/10 hover:text-brand hover:border-brand/30 transition-all duration-300"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}

export default SearchSuggestions;