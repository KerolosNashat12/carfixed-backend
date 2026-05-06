export const PageHeader = ({ eyebrow, title, description, actions }) => (
  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 pb-6 border-b border-ink-500/40 animate-fade-up">
    <div>
      {eyebrow && (
        <div className="text-[10px] uppercase tracking-[0.25em] font-mono text-amber mb-2">
          {eyebrow}
        </div>
      )}
      <h1 className="font-display text-3xl lg:text-4xl tracking-tight text-ink-50 leading-none">
        {title}
      </h1>
      {description && (
        <p className="text-sm text-ink-200 mt-2 max-w-2xl">{description}</p>
      )}
    </div>
    {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
  </div>
);
