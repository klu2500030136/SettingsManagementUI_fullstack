function Pagination({ currentPage, totalPages, setCurrentPage }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center gap-2 mt-8">
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index}
          onClick={() => setCurrentPage(index + 1)}
          className={`
            w-10 h-10 rounded-[12px] font-bold text-sm flex items-center justify-center transition-all duration-300
            ${
              currentPage === index + 1
                ? "bg-gold-gradient text-[#0B0B0B] shadow-gold-btn scale-110"
                : "glass-card dark:glass-panel-dark text-surface-600 dark:text-text-secondary border border-surface-200 dark:border-white/10 hover:bg-surface-50 dark:hover:bg-white/5 hover:text-surface-900 dark:hover:text-text-main"
            }
          `}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );
}

export default Pagination;