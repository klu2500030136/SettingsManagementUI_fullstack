import { Search } from "lucide-react";

function AISearchBar({ query, setQuery }) {
  return (
    <div className="relative">
      <Search
        className="absolute left-5 top-1/2 -translate-y-1/2 text-surface-400 dark:text-surface-500"
        size={22}
      />
      <input
        type="text"
        placeholder="Search settings using AI..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full bg-white/70 dark:bg-[#141414]/70 backdrop-blur-xl border border-surface-200 dark:border-white/10 rounded-2xl pl-14 pr-4 py-5 shadow-gold-btn text-surface-900 dark:text-text-main font-semibold outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all placeholder-surface-400 dark:placeholder-surface-500 text-lg"
      />
    </div>
  );
}

export default AISearchBar;