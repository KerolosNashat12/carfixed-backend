import { X } from 'lucide-react';
import { useEffect } from 'react';

export const Modal = ({ open, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    if (!open) return;
    const handler = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div
        className="absolute inset-0 bg-ink-900/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`relative bg-ink-700 border border-ink-500 rounded-2xl shadow-2xl w-full ${sizes[size]} animate-fade-up max-h-[90vh] overflow-hidden flex flex-col`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-ink-500">
          <h2 className="font-display text-lg font-medium text-ink-50">{title}</h2>
          <button
            onClick={onClose}
            className="text-ink-200 hover:text-ink-50 hover:bg-ink-600 p-1.5 rounded-md transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-5 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};
