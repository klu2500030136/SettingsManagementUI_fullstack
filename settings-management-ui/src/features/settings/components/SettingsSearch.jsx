import Input from "../../../components/ui/Input";
import { Search } from "lucide-react";

function SettingsSearch({ search, setSearch }) {
  return (
    <div className="w-full md:w-96 relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search size={18} className="text-surface-400 dark:text-surface-500" />
      </div>
      <input
        type="text"
        placeholder="Search settings..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full bg-white/50 dark:bg-[#141414]/50 backdrop-blur-md border border-surface-200 dark:border-white/10 rounded-[14px] py-3 pl-10 pr-4 text-sm text-surface-900 dark:text-text-main outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all shadow-sm placeholder-surface-400 dark:placeholder-surface-500 font-semibold"
      />
    </div>
  );
}

export default SettingsSearch;