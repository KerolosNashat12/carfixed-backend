import { useEffect, useState } from 'react';
import { Receipt, RotateCcw } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Card, CardBody } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { Badge, statusBadge } from '../components/Badge';
import { Avatar } from '../components/Avatar';
import { Select } from '../components/Form';
import { Pagination } from '../components/Pagination';
import { Loading, EmptyState } from '../components/Loading';
import { formatCurrency, formatDateTime } from '../utils/format';
import toast from 'react-hot-toast';

export const TransactionsPage = () => {
  const { user: me } = useAuth();
  const isAdmin = me?.role === 'admin';
  const [txs, setTxs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', type: '' });
  const [page, setPage] = useState(1);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/transactions', {
        params: { ...filters, page, limit: 10 },
      });
      setTxs(res.data.transactions);
      setPagination(res.data.pagination);
    } catch {
      toast.error('Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, page]);

  const refund = async (id) => {
    if (!confirm('Mark this transaction as refunded?')) return;
    try {
      await api.post(`/transactions/${id}/refund`);
      toast.success('Refunded');
      load();
    } catch {
      toast.error('Refund failed');
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="§04 · Ledger"
        title="Transactions"
        description="Complete record of all payments, refunds, and credits."
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
            <option value="succeeded">Succeeded</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </Select>
          <Select
            label="Type"
            value={filters.type}
            onChange={(e) => {
              setFilters({ ...filters, type: e.target.value });
              setPage(1);
            }}
            className="lg:w-48"
          >
            <option value="">All types</option>
            <option value="subscription">Subscription</option>
            <option value="one_time">One time</option>
            <option value="refund">Refund</option>
            <option value="credit">Credit</option>
          </Select>
        </CardBody>
      </Card>

      <Card>
        {loading ? (
          <Loading label="Loading ledger" />
        ) : txs.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title="No transactions"
            description="The ledger is empty."
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-ink-500/60 text-[10px] uppercase tracking-widest font-mono text-ink-300">
                    <th className="text-left px-4 py-3 font-medium">Invoice</th>
                    <th className="text-left px-4 py-3 font-medium">Customer</th>
                    <th className="text-left px-4 py-3 font-medium">Amount</th>
                    <th className="text-left px-4 py-3 font-medium">Type</th>
                    <th className="text-left px-4 py-3 font-medium">Status</th>
                    <th className="text-left px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 w-20" />
                  </tr>
                </thead>
                <tbody>
                  {txs.map((tx) => (
                    <tr
                      key={tx._id}
                      className="border-b border-ink-600/60 last:border-0 hover:bg-ink-600/20 transition-colors group"
                    >
                      <td className="px-4 py-3">
                        <span className="text-xs font-mono text-ink-100">
                          {tx.invoiceNumber}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={tx.user?.name} size="sm" />
                          <div className="min-w-0">
                            <div className="text-sm text-ink-50 font-medium truncate">
                              {tx.user?.name}
                            </div>
                            <div className="text-xs text-ink-300 truncate">
                              {tx.user?.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-display tabular text-ink-50">
                          {tx.type === 'refund' ? '−' : ''}
                          {formatCurrency(tx.amount, tx.currency)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-mono uppercase text-ink-200">
                          {tx.type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={statusBadge(tx.status)}>{tx.status}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-ink-200 font-mono">
                          {formatDateTime(tx.createdAt)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {isAdmin && tx.status === 'succeeded' && (
                          <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => refund(tx._id)}
                              className="p-1.5 rounded-md text-ink-200 hover:text-amber hover:bg-ink-600"
                              title="Refund"
                            >
                              <RotateCcw size={14} />
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
