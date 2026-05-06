export const Input = ({ label, error, className = '', ...props }) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="text-xs uppercase tracking-widest text-ink-200 font-medium">
        {label}
      </label>
    )}
    <input
      className={`bg-ink-800/60 border border-ink-500 rounded-lg px-3.5 py-2.5 text-sm text-ink-50 placeholder:text-ink-300 transition-colors focus-ring ${className}`}
      {...props}
    />
    {error && <span className="text-xs text-rust">{error}</span>}
  </div>
);

export const Select = ({ label, children, className = '', ...props }) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="text-xs uppercase tracking-widest text-ink-200 font-medium">
        {label}
      </label>
    )}
    <select
      className={`bg-ink-800/60 border border-ink-500 rounded-lg px-3.5 py-2.5 text-sm text-ink-50 transition-colors focus-ring appearance-none cursor-pointer ${className}`}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%238b95a5' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E\")",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 0.75rem center',
        backgroundSize: '1rem',
        paddingRight: '2.5rem',
      }}
      {...props}
    >
      {children}
    </select>
  </div>
);

export const Textarea = ({ label, error, className = '', ...props }) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="text-xs uppercase tracking-widest text-ink-200 font-medium">
        {label}
      </label>
    )}
    <textarea
      className={`bg-ink-800/60 border border-ink-500 rounded-lg px-3.5 py-2.5 text-sm text-ink-50 placeholder:text-ink-300 transition-colors focus-ring resize-none ${className}`}
      {...props}
    />
    {error && <span className="text-xs text-rust">{error}</span>}
  </div>
);
