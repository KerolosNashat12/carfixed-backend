import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Receipt,
  Activity,
  Settings,
  UserCircle,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/users', label: 'Users', icon: Users, roles: ['admin', 'manager'] },
  { to: '/subscriptions', label: 'Subscriptions', icon: CreditCard, roles: ['admin', 'manager'] },
  { to: '/transactions', label: 'Transactions', icon: Receipt, roles: ['admin', 'manager'] },
  { to: '/activity', label: 'Activity Log', icon: Activity, roles: ['admin'] },
  { to: '/settings', label: 'Settings', icon: Settings, roles: ['admin'] },
  { to: '/profile', label: 'Profile', icon: UserCircle },
];

export const Sidebar = () => {
  const { user, logout } = useAuth();

  const visible = navItems.filter(
    (item) => !item.roles || item.roles.includes(user?.role)
  );

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-ink-800/50 border-r border-ink-500/60 backdrop-blur-sm h-screen sticky top-0">
      {/* Brand */}
      <div className="px-6 py-6 border-b border-ink-500/60">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber to-amber-deep flex items-center justify-center shadow-lg shadow-amber/20">
            <svg viewBox="0 0 32 32" className="w-5 h-5">
              <path
                d="M8 22L12 10L16 18L20 10L24 22"
                stroke="#0a0e14"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-xl tracking-tight text-ink-50">
              Meridian
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-ink-300 font-mono mt-1">
              Admin · v1.0
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="text-[10px] uppercase tracking-[0.2em] text-ink-300 font-mono px-3 mb-2">
          Workspace
        </div>
        <ul className="space-y-0.5">
          {visible.map((item, i) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all relative ${
                    isActive
                      ? 'bg-ink-600/60 text-ink-50'
                      : 'text-ink-200 hover:bg-ink-600/40 hover:text-ink-50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-amber rounded-r" />
                    )}
                    <item.icon
                      size={16}
                      className={isActive ? 'text-amber' : 'text-ink-300 group-hover:text-ink-100'}
                    />
                    <span className="font-medium">{item.label}</span>
                    <span className="ml-auto text-[10px] font-mono text-ink-300/60">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User card */}
      <div className="border-t border-ink-500/60 p-3">
        <div className="flex items-center gap-3 px-2 py-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-ink-500 to-ink-700 ring-1 ring-ink-400 flex items-center justify-center text-xs font-mono font-semibold text-amber">
            {user?.name?.split(' ').slice(0, 2).map((s) => s[0]).join('').toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs text-ink-50 font-medium truncate">{user?.name}</div>
            <div className="text-[10px] text-ink-300 font-mono uppercase tracking-wider">
              {user?.role}
            </div>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-ink-200 hover:bg-rust/10 hover:text-rust transition-colors"
        >
          <LogOut size={14} />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
};
