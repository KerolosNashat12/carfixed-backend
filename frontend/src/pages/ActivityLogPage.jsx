import { useEffect, useState } from 'react';
import { Activity as ActivityIcon } from 'lucide-react';
import api from '../utils/api';
import { Card, CardBody } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { Badge } from '../components/Badge';
import { Avatar } from '../components/Avatar';
import { Pagination } from '../components/Pagination';
import { Loading, EmptyState } from '../components/Loading';
import { formatDateTime, formatRelative } from '../utils/format';
import toast from 'react-hot-toast';

export const ActivityLogPage = () => {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/settings/activity', {
        params: { page, limit: 20 },
      });
      setItems(res.data.activities);
      setPagination(res.data.pagination);
    } catch {
      toast.error('Failed to load activity');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const actionBadge = (action) => {
    if (action.startsWith('delete') || action.startsWith('cancel')) return 'danger';
    if (action.startsWith('create') || action === 'register') return 'success';
    if (action.startsWith('update') || action.startsWith('bulk')) return 'warning';
    if (action === 'login' || action === 'logout') return 'info';
    return 'neutral';
  };

  return (
    <div>
      <PageHeader
        eyebrow="§05 · Audit"
        title="Activity log"
        description="Complete audit trail of administrative actions."
      />

      <Card>
        {loading ? (
          <Loading label="Loading log" />
        ) : items.length === 0 ? (
          <EmptyState
            icon={ActivityIcon}
            title="No activity"
            description="Actions will appear here as they happen."
          />
        ) : (
          <>
            <div className="divide-y divide-ink-600/60">
              {items.map((a, i) => (
                <div
                  key={a._id}
                  className="flex items-start gap-4 px-6 py-4 hover:bg-ink-600/20 transition-colors"
                >
                  <span className="text-[10px] font-mono text-ink-300 w-8 mt-1.5 flex-shrink-0">
                    {String((pagination.page - 1) * pagination.limit + i + 1).padStart(3, '0')}
                  </span>
                  <Avatar name={a.user?.name || 'System'} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm text-ink-50 font-medium">
                        {a.user?.name || 'System'}
                      </span>
                      <Badge variant={actionBadge(a.action)}>{a.action.replace(/_/g, ' ')}</Badge>
                      {a.entity && (
                        <span className="text-xs text-ink-300 font-mono">on {a.entity}</span>
                      )}
                    </div>
                    {a.description && (
                      <div className="text-xs text-ink-200 mt-1">{a.description}</div>
                    )}
                    <div className="flex items-center gap-3 mt-1 text-[10px] font-mono text-ink-300">
                      <span>{formatDateTime(a.createdAt)}</span>
                      <span>·</span>
                      <span>{formatRelative(a.createdAt)}</span>
                      {a.ipAddress && (
                        <>
                          <span>·</span>
                          <span>{a.ipAddress}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Pagination pagination={pagination} onChange={setPage} />
          </>
        )}
      </Card>
    </div>
  );
};
