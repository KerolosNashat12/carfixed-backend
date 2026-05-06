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

export const MobileNav = ({ open, onClose }) => {
  const { user, logout } = useAuth();
  const visible = navItems.filter(
    (item) => !item.roles || item.roles.includes(user?.role)
  );

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-ink-900/80 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
        onClick={onClose}
      />
      <div className="fixed left-0 top-0 bottom-0 w-72 bg-ink-800 border-r border-ink-500 z-50 lg:hidden animate-slide-in flex flex-col">
        <div className="px-6 py-6 border-b border-ink-500/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber to-amber-deep flex items-center justify-center">
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
            <span className="font-display text-xl text-ink-50">Meridian</span>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {visible.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                      isActive
                        ? 'bg-ink-600/60 text-ink-50'
                        : 'text-ink-200 hover:bg-ink-600/40'
                    }`
                  }
                >
                  <item.icon size={16} />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="border-t border-ink-500/60 p-3">
          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-ink-200 hover:bg-rust/10 hover:text-rust"
          >
            <LogOut size={14} />
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </>
  );
};
