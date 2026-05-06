import { useEffect, useState } from 'react';
import { Bell, Search, Menu, X, Check, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { formatRelative } from '../utils/format';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export const Header = ({ onToggleMobileNav, mobileNavOpen }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);

  const load = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.notifications);
      setUnread(res.data.unread);
    } catch {
      // silent
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, []);

  const markAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      load();
      toast.success('All marked as read');
    } catch {
      toast.error('Failed to update');
    }
  };

  const markRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      load();
    } catch {}
  };

  const remove = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      load();
    } catch {}
  };

  const typeColor = {
    info: 'bg-plum',
    success: 'bg-sage',
    warning: 'bg-amber',
    error: 'bg-rust',
    system: 'bg-ink-200',
    billing: 'bg-amber',
  };

  return (
    <header className="sticky top-0 z-30 bg-ink-900/70 backdrop-blur-md border-b border-ink-500/60">
      <div className="flex items-center gap-3 px-4 lg:px-8 h-16">
        <button
          onClick={onToggleMobileNav}
          className="lg:hidden p-2 -ml-2 rounded-lg text-ink-100 hover:bg-ink-600"
          aria-label="Toggle menu"
        >
          {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Search */}
        <div className="flex-1 max-w-md relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300 pointer-events-none"
          />
          <input
            type="search"
            placeholder="Search…"
            className="w-full bg-ink-700/40 border border-ink-500/60 rounded-lg pl-9 pr-12 py-2 text-sm placeholder:text-ink-300 focus-ring text-ink-50"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-ink-300 border border-ink-500 rounded px-1.5 py-0.5 hidden sm:block">
            ⌘ K
          </kbd>
        </div>

        {/* Notifications */}
        <div className="relative ml-auto">
          <button
            onClick={() => setOpen(!open)}
            className="relative p-2 rounded-lg text-ink-100 hover:bg-ink-600 transition-colors"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unread > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-amber rounded-full ring-2 ring-ink-900 animate-pulse-soft" />
            )}
          </button>

          {open && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setOpen(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-ink-700 border border-ink-500 rounded-xl shadow-2xl z-50 animate-fade-up overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-ink-500">
                  <div>
                    <div className="font-display text-sm text-ink-50">Notifications</div>
                    <div className="text-[10px] uppercase tracking-widest font-mono text-ink-300 mt-0.5">
                      {unread} unread
                    </div>
                  </div>
                  {unread > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-xs text-amber hover:text-amber-glow font-mono"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="text-center py-12 text-sm text-ink-300">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n._id}
                        className={`group flex gap-3 px-4 py-3 border-b border-ink-600 last:border-0 hover:bg-ink-600/40 transition-colors ${
                          !n.read ? 'bg-ink-600/20' : ''
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${
                            typeColor[n.type] || 'bg-ink-200'
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-ink-50 font-medium">{n.title}</div>
                          <div className="text-xs text-ink-200 mt-0.5 line-clamp-2">
                            {n.message}
                          </div>
                          <div className="text-[10px] text-ink-300 font-mono uppercase tracking-wider mt-1">
                            {formatRelative(n.createdAt)}
                          </div>
                        </div>
                        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!n.read && (
                            <button
                              onClick={() => markRead(n._id)}
                              className="p-1 text-ink-200 hover:text-sage rounded"
                              title="Mark read"
                            >
                              <Check size={12} />
                            </button>
                          )}
                          <button
                            onClick={() => remove(n._id)}
                            className="p-1 text-ink-200 hover:text-rust rounded"
                            title="Delete"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <Link to="/profile" className="hidden sm:block">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-ink-500 to-ink-700 ring-1 ring-ink-400 hover:ring-amber/40 flex items-center justify-center text-xs font-mono font-semibold text-amber transition-all">
            {user?.name?.split(' ').slice(0, 2).map((s) => s[0]).join('').toUpperCase()}
          </div>
        </Link>
      </div>
    </header>
  );
};
