export const Card = ({ children, className = '', ...props }) => (
  <div
    className={`bg-ink-700/40 border border-ink-500/60 rounded-xl backdrop-blur-sm ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const CardHeader = ({ children, className = '' }) => (
  <div className={`px-6 py-5 border-b border-ink-500/60 ${className}`}>{children}</div>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={`px-6 py-5 ${className}`}>{children}</div>
);
