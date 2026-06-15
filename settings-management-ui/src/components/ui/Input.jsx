import { forwardRef } from "react";

const Input = forwardRef(
  ({ label, type = "text", placeholder, error, className = "", ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-semibold text-surface-700 dark:text-text-main ml-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          className={`
            w-full bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 
            rounded-xl px-4 py-3 text-sm text-surface-900 dark:text-text-main 
            placeholder-surface-400 dark:placeholder-surface-500
            outline-none transition-all duration-300
            focus:bg-white dark:focus:bg-[#1C1C1C] focus:border-brand focus:ring-4 focus:ring-brand/20
            ${error ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20" : ""}
            ${className}
          `}
          {...props}
        />
        {error && <span className="text-xs text-rose-500 font-medium ml-1">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;