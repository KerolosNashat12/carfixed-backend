export const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-ink-600 text-ink-100 border-ink-400',
    success: 'bg-sage/15 text-sage border-sage/30',
    warning: 'bg-amber/15 text-amber border-amber/30',
    danger: 'bg-rust/15 text-rust border-rust/30',
    info: 'bg-plum/15 text-plum border-plum/30',
    neutral: 'bg-ink-500/40 text-ink-200 border-ink-400/60',
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-mono uppercase tracking-wider border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export const statusBadge = (status) => {
  const map = {
    active: 'success',
    succeeded: 'success',
    completed: 'success',
    pending: 'warning',
    trialing: 'warning',
    past_due: 'warning',
    suspended: 'danger',
    failed: 'danger',
    cancelled: 'danger',
    refunded: 'neutral',
  };
  return map[status] || 'default';
};
