import { useEffect, useState } from 'react';
import { Plus, Search, Trash2, Edit2, MoreVertical, Users as UsersIcon } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Card, CardBody } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { Button } from '../components/Button';
import { Badge, statusBadge } from '../components/Badge';
import { Avatar } from '../components/Avatar';
import { Modal } from '../components/Modal';
import { Input, Select } from '../components/Form';
import { Pagination } from '../components/Pagination';
import { Loading, EmptyState } from '../components/Loading';
import { formatRelative } from '../utils/format';
import toast from 'react-hot-toast';

const emptyForm = {
  name: '',
  email: '',
  password: '',
  role: 'user',
  plan: 'free',
  status: 'active',
};

export const UsersPage = () => {
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', role: '', status: '', plan: '' });
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState([]);
  const [modal, setModal] = useState({ open: false, mode: 'create', user: null });
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const isAdmin = me?.role === 'admin';

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users', {
        params: { ...filters, page, limit: 10 },
      });
      setUsers(res.data.users);
      setPagination(res.data.pagination);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(load, 300);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, page]);

  const openCreate = () => {
    setForm(emptyForm);
    setModal({ open: true, mode: 'create', user: null });
  };

  const openEdit = (user) => {
    setForm({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      plan: user.plan,
      status: user.status,
    });
    setModal({ open: true, mode: 'edit', user });
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (modal.mode === 'create') {
        await api.post('/users', form);
        toast.success('User created');
      } else {
        const updates = { ...form };
        delete updates.password;
        await api.put(`/users/${modal.user._id}`, updates);
        toast.success('User updated');
      }
      setModal({ open: false, mode: 'create', user: null });
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (user) => {
    if (!confirm(`Delete ${user.name}? This cannot be undone.`)) return;
    try {
      await api.delete(`/users/${user._id}`);
      toast.success('Deleted');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const bulk = async (action) => {
    if (!selected.length) return;
    if (!confirm(`${action} ${selected.length} user(s)?`)) return;
    try {
      const res = await api.post('/users/bulk', { ids: selected, action });
      toast.success(`${res.data.affected} updated`);
      setSelected([]);
      load();
    } catch {
      toast.error('Bulk action failed');
    }
  };

  const toggleSelect = (id) => {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };

  const toggleAll = () => {
    if (selected.length === users.length) setSelected([]);
    else setSelected(users.map((u) => u._id));
  };

  return (
    <div>
      <PageHeader
        eyebrow="§02 · Customers"
        title="Users"
        description="Administrate accounts, roles, and access across your platform."
        actions={
          isAdmin && (
            <Button onClick={openCreate}>
              <Plus size={14} /> New user
            </Button>
          )
        }
      />

      {/* Filters */}
      <Card className="mb-4">
        <CardBody className="flex flex-col lg:flex-row gap-3 lg:items-end">
          <div className="flex-1 min-w-0 relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300 pointer-events-none mt-3"
            />
            <Input
              label="Search"
              placeholder="Name or email…"
              value={filters.search}
              onChange={(e) => {
                setFilters({ ...filters, search: e.target.value });
                setPage(1);
              }}
              className="pl-9"
            />
          </div>
          <Select
            label="Role"
            value={filters.role}
            onChange={(e) => {
              setFilters({ ...filters, role: e.target.value });
              setPage(1);
            }}
            className="lg:w-36"
          >
            <option value="">All roles</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="user">User</option>
          </Select>
          <Select
            label="Status"
            value={filters.status}
            onChange={(e) => {
              setFilters({ ...filters, status: e.target.value });
              setPage(1);
            }}
            className="lg:w-36"
          >
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="pending">Pending</option>
          </Select>
          <Select
            label="Plan"
            value={filters.plan}
            onChange={(e) => {
              setFilters({ ...filters, plan: e.target.value });
              setPage(1);
            }}
            className="lg:w-36"
          >
            <option value="">All plans</option>
            <option value="free">Free</option>
            <option value="starter">Starter</option>
            <option value="pro">Pro</option>
            <option value="enterprise">Enterprise</option>
          </Select>
        </CardBody>
      </Card>

      {/* Bulk bar */}
      {selected.length > 0 && isAdmin && (
        <div className="bg-amber/10 border border-amber/30 rounded-xl p-3 mb-4 flex items-center justify-between animate-fade-in">
          <span className="text-sm text-amber font-medium">
            {selected.length} selected
          </span>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={() => bulk('activate')}>
              Activate
            </Button>
            <Button size="sm" variant="secondary" onClick={() => bulk('suspend')}>
              Suspend
            </Button>
            <Button size="sm" variant="danger" onClick={() => bulk('delete')}>
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <Card>
        {loading ? (
          <Loading label="Loading users" />
        ) : users.length === 0 ? (
          <EmptyState
            icon={UsersIcon}
            title="No users found"
            description="Adjust filters or add a new user."
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-ink-500/60 text-[10px] uppercase tracking-widest font-mono text-ink-300">
                    {isAdmin && (
                      <th className="text-left px-4 py-3 w-10">
                        <input
                          type="checkbox"
                          checked={selected.length === users.length && users.length > 0}
                          onChange={toggleAll}
                          className="accent-amber w-4 h-4 cursor-pointer"
                        />
                      </th>
                    )}
                    <th className="text-left px-4 py-3 font-medium">Name</th>
                    <th className="text-left px-4 py-3 font-medium">Role</th>
                    <th className="text-left px-4 py-3 font-medium">Plan</th>
                    <th className="text-left px-4 py-3 font-medium">Status</th>
                    <th className="text-left px-4 py-3 font-medium">Last seen</th>
                    <th className="px-4 py-3 w-24" />
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr
                      key={u._id}
                      className="border-b border-ink-600/60 last:border-0 hover:bg-ink-600/20 transition-colors group"
                    >
                      {isAdmin && (
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selected.includes(u._id)}
                            onChange={() => toggleSelect(u._id)}
                            className="accent-amber w-4 h-4 cursor-pointer"
                          />
                        </td>
                      )}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={u.name} size="sm" />
                          <div className="min-w-0">
                            <div className="text-sm text-ink-50 font-medium truncate">
                              {u.name}
                            </div>
                            <div className="text-xs text-ink-300 truncate">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={u.role === 'admin' ? 'warning' : u.role === 'manager' ? 'info' : 'neutral'}>
                          {u.role}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-mono uppercase text-ink-100">{u.plan}</span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={statusBadge(u.status)}>{u.status}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-ink-200 font-mono">
                          {formatRelative(u.lastLogin)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {isAdmin && (
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                            <button
                              onClick={() => openEdit(u)}
                              className="p-1.5 rounded-md text-ink-200 hover:text-amber hover:bg-ink-600"
                              title="Edit"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => remove(u)}
                              disabled={u._id === me._id}
                              className="p-1.5 rounded-md text-ink-200 hover:text-rust hover:bg-ink-600 disabled:opacity-30 disabled:cursor-not-allowed"
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

      {/* Create/Edit modal */}
      <Modal
        open={modal.open}
        onClose={() => setModal({ open: false, mode: 'create', user: null })}
        title={modal.mode === 'create' ? 'Create user' : 'Edit user'}
      >
        <form onSubmit={submit} className="space-y-4">
          <Input
            label="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          {modal.mode === 'create' && (
            <Input
              label="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength={6}
            />
          )}
          <div className="grid grid-cols-3 gap-3">
            <Select
              label="Role"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="user">User</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </Select>
            <Select
              label="Plan"
              value={form.plan}
              onChange={(e) => setForm({ ...form, plan: e.target.value })}
            >
              <option value="free">Free</option>
              <option value="starter">Starter</option>
              <option value="pro">Pro</option>
              <option value="enterprise">Enterprise</option>
            </Select>
            <Select
              label="Status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
            </Select>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-ink-500/40">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setModal({ open: false, mode: 'create', user: null })}
            >
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {modal.mode === 'create' ? 'Create' : 'Save changes'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
