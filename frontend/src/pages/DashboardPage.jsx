import { useEffect, useState } from 'react';
import {
  Users,
  CreditCard,
  TrendingUp,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Activity as ActivityIcon,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import api from '../utils/api';
import { Card, CardHeader, CardBody } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { Loading } from '../components/Loading';
import { Avatar } from '../components/Avatar';
import { formatCurrency, formatNumber, formatRelative } from '../utils/format';

const PLAN_COLORS = {
  free: '#5a6473',
  starter: '#7fb069',
  pro: '#e8a53b',
  enterprise: '#9b6b9e',
};

export const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [revenue, setRevenue] = useState([]);
  const [growth, setGrowth] = useState([]);
  const [plans, setPlans] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/analytics/overview'),
      api.get('/analytics/revenue'),
      api.get('/analytics/user-growth'),
      api.get('/analytics/plan-distribution'),
      api.get('/analytics/activity?limit=8'),
    ])
      .then(([o, r, g, p, a]) => {
        setData(o.data);
        setRevenue(r.data);
        setGrowth(g.data);
        setPlans(p.data);
        setActivity(a.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) return <Loading label="Loading overview" />;

  const stats = [
    {
      label: 'Monthly Recurring Revenue',
      value: formatCurrency(data.mrr),
      icon: TrendingUp,
      change: data.revenueGrowth,
      tone: 'amber',
    },
    {
      label: 'Total Users',
      value: formatNumber(data.totalUsers),
      icon: Users,
      change: data.userGrowth,
      sub: `${data.newUsersThisMonth} new this month`,
      tone: 'sage',
    },
    {
      label: 'Active Subscriptions',
      value: formatNumber(data.activeSubscriptions),
      icon: CreditCard,
      sub: 'Currently billing',
      tone: 'plum',
    },
    {
      label: 'Total Revenue',
      value: formatCurrency(data.totalRevenue),
      icon: Wallet,
      sub: `${data.pendingTransactions} pending`,
      tone: 'rust',
    },
  ];

  const toneClasses = {
    amber: 'text-amber from-amber/20 to-amber/0',
    sage: 'text-sage from-sage/20 to-sage/0',
    plum: 'text-plum from-plum/20 to-plum/0',
    rust: 'text-rust from-rust/20 to-rust/0',
  };

  return (
    <div>
      <PageHeader
        eyebrow="§01 · Overview"
        title="Good day."
        description="A consolidated view of your operations across customers, recurring revenue, and ledger activity."
      />

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <Card
            key={s.label}
            className="relative overflow-hidden hover:border-ink-400 transition-colors animate-fade-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div
              className={`absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br ${toneClasses[s.tone]} blur-2xl opacity-60`}
            />
            <CardBody className="relative">
              <div className="flex items-start justify-between mb-6">
                <div className={`p-2 rounded-lg bg-ink-800/60 ${toneClasses[s.tone].split(' ')[0]}`}>
                  <s.icon size={16} />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-ink-300">
                  №0{i + 1}
                </span>
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-ink-300 mb-1.5">
                {s.label}
              </div>
              <div className="font-display text-3xl tracking-tight tabular text-ink-50 mb-2">
                {s.value}
              </div>
              <div className="flex items-center gap-2 text-xs">
                {s.change !== undefined && (
                  <span
                    className={`inline-flex items-center gap-0.5 font-mono tabular ${
                      s.change >= 0 ? 'text-sage' : 'text-rust'
                    }`}
                  >
                    {s.change >= 0 ? (
                      <ArrowUpRight size={12} />
                    ) : (
                      <ArrowDownRight size={12} />
                    )}
                    {Math.abs(s.change).toFixed(1)}%
                  </span>
                )}
                {s.sub && <span className="text-ink-300">{s.sub}</span>}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        {/* Revenue */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-ink-300 mb-1">
                  Figure №01
                </div>
                <h3 className="font-display text-xl text-ink-50">Revenue trend</h3>
              </div>
              <span className="text-xs text-ink-200 font-mono">Last 12 months</span>
            </div>
          </CardHeader>
          <CardBody>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenue}>
                  <defs>
                    <linearGradient id="revenueG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#e8a53b" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#e8a53b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="label"
                    tick={{ fill: '#5a6473', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                    tickLine={false}
                    axisLine={{ stroke: '#252e3a' }}
                  />
                  <YAxis
                    tick={{ fill: '#5a6473', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `$${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#161b22',
                      border: '1px solid #252e3a',
                      borderRadius: 8,
                      fontSize: 12,
                      fontFamily: 'Inter',
                    }}
                    labelStyle={{ color: '#8b95a5', fontSize: 11 }}
                    itemStyle={{ color: '#e8a53b' }}
                    formatter={(v) => [formatCurrency(v), 'Revenue']}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#e8a53b"
                    strokeWidth={2}
                    fill="url(#revenueG)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        {/* Plan distribution */}
        <Card>
          <CardHeader>
            <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-ink-300 mb-1">
              Figure №02
            </div>
            <h3 className="font-display text-xl text-ink-50">Plans</h3>
          </CardHeader>
          <CardBody>
            <div className="h-48 -my-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={plans}
                    dataKey="count"
                    nameKey="plan"
                    innerRadius={50}
                    outerRadius={75}
                    strokeWidth={2}
                    stroke="#0f1419"
                  >
                    {plans.map((p) => (
                      <Cell key={p.plan} fill={PLAN_COLORS[p.plan] || '#5a6473'} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: '#161b22',
                      border: '1px solid #252e3a',
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="space-y-2 mt-2">
              {plans.map((p) => (
                <li
                  key={p.plan}
                  className="flex items-center justify-between text-xs py-1"
                >
                  <span className="flex items-center gap-2 text-ink-100">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ background: PLAN_COLORS[p.plan] }}
                    />
                    <span className="capitalize">{p.plan}</span>
                  </span>
                  <span className="font-mono tabular text-ink-200">{p.count}</span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>

      {/* User growth + activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-ink-300 mb-1">
                  Figure №03
                </div>
                <h3 className="font-display text-xl text-ink-50">User acquisition</h3>
              </div>
              <span className="text-xs text-ink-200 font-mono">Last 12 months</span>
            </div>
          </CardHeader>
          <CardBody>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={growth}>
                  <XAxis
                    dataKey="label"
                    tick={{ fill: '#5a6473', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                    tickLine={false}
                    axisLine={{ stroke: '#252e3a' }}
                  />
                  <YAxis
                    tick={{ fill: '#5a6473', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(232, 165, 59, 0.06)' }}
                    contentStyle={{
                      background: '#161b22',
                      border: '1px solid #252e3a',
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    labelStyle={{ color: '#8b95a5', fontSize: 11 }}
                  />
                  <Bar dataKey="users" fill="#7fb069" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ActivityIcon size={14} className="text-amber" />
              <h3 className="font-display text-lg text-ink-50">Recent activity</h3>
            </div>
          </CardHeader>
          <CardBody className="px-0 py-0">
            <ul>
              {activity.length === 0 && (
                <li className="text-center py-12 text-sm text-ink-300">No activity</li>
              )}
              {activity.map((a, i) => (
                <li
                  key={a._id}
                  className="flex items-start gap-3 px-6 py-3 border-b border-ink-600 last:border-0 hover:bg-ink-600/20 transition-colors"
                >
                  <span className="text-[10px] font-mono text-ink-300 w-5 mt-1 flex-shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <Avatar name={a.user?.name || 'System'} size="xs" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-ink-50 truncate">
                      <span className="text-ink-200">{a.user?.name || 'System'}</span>{' '}
                      <span className="font-mono text-amber">{a.action.replace(/_/g, ' ')}</span>
                    </div>
                    <div className="text-[10px] text-ink-300 font-mono mt-0.5">
                      {formatRelative(a.createdAt)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
