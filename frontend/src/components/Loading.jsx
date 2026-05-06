export const Spinner = ({ size = 'md' }) => {
  const sizes = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-10 w-10' };
  return (
    <svg
      className={`animate-spin ${sizes[size]} text-amber`}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.2" />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
};

export const Loading = ({ label = 'Loading' }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-16 text-ink-200">
    <Spinner size="lg" />
    <span className="text-xs uppercase tracking-widest font-mono">{label}</span>
  </div>
);

export const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
    {Icon && (
      <div className="w-14 h-14 rounded-full bg-ink-600/60 border border-ink-500 flex items-center justify-center mb-2">
        <Icon size={22} className="text-ink-200" />
      </div>
    )}
    <h3 className="font-display text-lg text-ink-50">{title}</h3>
    {description && (
      <p className="text-sm text-ink-200 max-w-md text-balance">{description}</p>
    )}
    {action && <div className="mt-2">{action}</div>}
  </div>
);
