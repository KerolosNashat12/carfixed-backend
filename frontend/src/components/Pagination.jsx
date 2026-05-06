import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({ pagination, onChange }) => {
  if (!pagination || pagination.pages <= 1) return null;
  const { page, pages, total } = pagination;

  const start = (page - 1) * pagination.limit + 1;
  const end = Math.min(page * pagination.limit, total);

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-ink-500/60">
      <span className="text-xs font-mono text-ink-200">
        {start}–{end} <span className="text-ink-300">of</span> {total}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page <= 1}
          className="p-1.5 rounded-md text-ink-100 hover:bg-ink-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="px-3 text-xs font-mono text-ink-100">
          {page} / {pages}
        </span>
        <button
          onClick={() => onChange(page + 1)}
          disabled={page >= pages}
          className="p-1.5 rounded-md text-ink-100 hover:bg-ink-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};
