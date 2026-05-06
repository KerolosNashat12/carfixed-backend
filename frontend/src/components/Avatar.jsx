import { initials } from '../utils/format';

export const Avatar = ({ name = '', src, size = 'md', className = '' }) => {
  const sizes = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-xl',
  };
  // Hue derived from name for consistent personal color
  const hue = (name || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full font-mono font-semibold uppercase ring-1 ring-ink-400/60 overflow-hidden flex-shrink-0 ${sizes[size]} ${className}`}
      style={{
        background: src
          ? undefined
          : `linear-gradient(135deg, hsl(${hue} 35% 25%) 0%, hsl(${hue} 30% 18%) 100%)`,
        color: src ? undefined : `hsl(${hue} 60% 75%)`,
      }}
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span>{initials(name)}</span>
      )}
    </div>
  );
};
