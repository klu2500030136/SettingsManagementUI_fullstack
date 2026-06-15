import { Search } from "lucide-react";

function QuickSearch() {
  return (
    <div className="bg-gold-gradient rounded-[20px] shadow-gold-btn p-6 text-[#0B0B0B] relative overflow-hidden">
      
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/30 rounded-full blur-2xl transform translate-x-10 -translate-y-10" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#0B0B0B]/10 rounded-full blur-xl transform -translate-x-5 translate-y-5" />

      <div className="relative z-10">
        <h2 className="text-xl font-bold font-heading mb-2 tracking-tight">
          Quick Search
        </h2>
        <p className="text-[#0B0B0B]/80 text-sm mb-5 font-semibold">
          Instantly find settings and configurations.
        </p>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-surface-500" />
          </div>
          <input
            type="text"
            placeholder="Search settings..."
            className="w-full bg-white/90 backdrop-blur-sm rounded-[14px] py-3 pl-10 pr-4 text-sm text-[#0B0B0B] outline-none focus:ring-4 focus:ring-[#0B0B0B]/20 transition-all shadow-inner placeholder-surface-500 font-semibold"
          />
        </div>
      </div>

    </div>
  );
}

export default QuickSearch;