import { useEffect, useState } from 'react';
import { CreditCard, Ban, Trash2 } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Card, CardBody } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { Button } from '../components/Button';
import { Badge, statusBadge } from '../components/Badge';
import { Avatar } from '../components/Avatar';
import { Select } from '../components/Form';
import { Pagination } from '../components/Pagination';
import { Loading, EmptyState } from '../components/Loading';
import { formatCurrency, formatDate } from '../utils/format';
import toast from 'react-hot-toast';

export const SubscriptionsPage = () => {
  const { user: me } = useAuth();
  const isAdmin = me?.role === 'admin';
  const [subs, setSubs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', plan: '' });
  const [page, setPage] = useState(1);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/subscriptions', {
        params: { ...filters, page, limit: 10 },
      });
      setSubs(res.data.subscriptions);
      setPagination(res.data.pagination);
    } catch {
      toast.error('Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, page]);

  const cancel = async (id) => {
    if (!confirm('Cancel this subscription?')) return;
    try {
      await api.post(`/subscriptions/${id}/cancel`);
      toast.success('Subscription cancelled');
      load();
    } catch {
      toast.error('Failed to cancel');
    }
  };

  const remove = async (id) => {
    if (!confirm('Permanently delete this subscription?')) return;
    try {
      await api.delete(`/subscriptions/${id}`);
      toast.success('Deleted');
      load();
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="§03 · Recurring Revenue"
        title="Subscriptions"
        description="Active and past subscription contracts."
      />

      <Card className="mb-4">
        <CardBody className="flex flex-col lg:flex-row gap-3">
          <Select
            label="Status"
            value={filters.status}
            onChange={(e) => {
              setFilters({ ...filters, status: e.target.value });
              setPage(1);
            }}
            className="lg:w-48"
          >
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="cancelled">Cancelled</option>
            <option value="past_due">Past due</option>
            <option value="trialing">Trialing</option>
          </Select>
          <Select
            label="Plan"
            value={filters.plan}
            onChange={(e) => {
              setFilters({ ...filters, plan: e.target.value });
              setPage(1);
            }}
            className="lg:w-48"
          >
            <option value="">All plans</option>
            <option value="starter">Starter</option>
            <option value="pro">Pro</option>
            <option value="enterprise">Enterprise</option>
          </Select>
        </CardBody>
      </Card>

      <Card>
        {loading ? (
          <Loading label="Loading subscriptions" />
        ) : subs.length === 0 ? (
          <EmptyState
            icon={CreditCard}
            title="No subscriptions found"
            description="Subscriptions will appear here as customers upgrade."
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-ink-500/60 text-[10px] uppercase tracking-widest font-mono text-ink-300">
                    <th className="text-left px-4 py-3 font-medium">Customer</th>
                    <th className="text-left px-4 py-3 font-medium">Plan</th>
                    <th className="text-left px-4 py-3 font-medium">Amount</th>
                    <th className="text-left px-4 py-3 font-medium">Interval</th>
                    <th className="text-left px-4 py-3 font-medium">Status</th>
                    <th className="text-left px-4 py-3 font-medium">Started</th>
                    <th className="px-4 py-3 w-24" />
                  </tr>
                </thead>
                <tbody>
                  {subs.map((s) => (
                    <tr
                      key={s._id}
                      className="border-b border-ink-600/60 last:border-0 hover:bg-ink-600/20 transition-colors group"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={s.user?.name} size="sm" />
                          <div className="min-w-0">
                            <div className="text-sm text-ink-50 font-medium truncate">
                              {s.user?.name}
                            </div>
                            <div className="text-xs text-ink-300 truncate">{s.user?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-mono uppercase text-amber">{s.plan}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-display tabular text-ink-50">
                          {formatCurrency(s.amount, s.currency)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-ink-200 font-mono">{s.interval}</span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={statusBadge(s.status)}>{s.status.replace('_', ' ')}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-ink-200 font-mono">
                          {formatDate(s.startDate)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {isAdmin && (
                          <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                            {s.status === 'active' && (
                              <button
                                onClick={() => cancel(s._id)}
                                className="p-1.5 rounded-md text-ink-200 hover:text-amber hover:bg-ink-600"
                                title="Cancel"
                              >
                                <Ban size={14} />
                              </button>
                            )}
                            <button
                              onClick={() => remove(s._id)}
                              className="p-1.5 rounded-md text-ink-200 hover:text-rust hover:bg-ink-600"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination pagination={pagination} onChange={setPage} />
          </>
        )}
      </Card>
    </div>
  );
};
