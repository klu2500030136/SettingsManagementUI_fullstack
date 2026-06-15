function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
}) {
  const baseClasses = "inline-flex items-center justify-center font-semibold rounded-[14px] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-gold-gradient text-[#0B0B0B] shadow-gold-btn hover:-translate-y-[2px] hover:shadow-gold-btn-hover",
    secondary: "bg-surface-200 dark:bg-surface-800 text-surface-900 dark:text-text-main border border-border-goldLight hover:bg-surface-300 dark:hover:bg-surface-700 shadow-glass-card hover:border-brand",
    outline: "border-2 border-brand text-brand hover:bg-brand hover:text-[#0B0B0B] hover:shadow-gold-btn",
    ghost: "text-text-secondary hover:text-brand hover:bg-surface-100 dark:hover:bg-surface-800",
    danger: "bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-[0_8px_24px_rgba(225,29,72,0.25)] hover:shadow-[0_12px_30px_rgba(225,29,72,0.35)] hover:-translate-y-[2px]",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-7 py-3.5 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;