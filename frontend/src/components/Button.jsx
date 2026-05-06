export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  disabled,
  ...props
}) => {
  const variants = {
    primary:
      'bg-amber text-ink-900 hover:bg-amber-glow active:bg-amber-deep font-semibold shadow-lg shadow-amber/10',
    secondary:
      'bg-ink-600/80 text-ink-50 border border-ink-400 hover:bg-ink-500 hover:border-ink-300',
    ghost: 'text-ink-100 hover:bg-ink-600/60 hover:text-white',
    danger:
      'bg-rust/90 text-white hover:bg-rust border border-rust/40',
    outline:
      'border border-ink-400 text-ink-100 hover:border-amber hover:text-amber',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed font-medium tracking-tight ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      )}
      {children}
    </button>
  );
};
