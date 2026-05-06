import { useState } from 'react';
import { Save, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Card, CardHeader, CardBody } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { Button } from '../components/Button';
import { Input } from '../components/Form';
import { Avatar } from '../components/Avatar';
import { Badge } from '../components/Badge';
import { formatDate } from '../utils/format';
import toast from 'react-hot-toast';

export const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user.name,
    phone: user.phone || '',
    company: user.company || '',
    country: user.country || '',
  });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' });
  const [saving, setSaving] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/auth/me', form);
      updateUser(res.data);
      toast.success('Profile updated');
    } catch {
      toast.error('Update failed');
    } finally {
      setSaving(false);
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    setPwSaving(true);
    try {
      await api.put('/auth/password', pwForm);
      setPwForm({ currentPassword: '', newPassword: '' });
      toast.success('Password updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setPwSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="§07 · Personal"
        title="Profile"
        description="Manage your personal information and credentials."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Identity card */}
        <Card>
          <CardBody className="text-center py-8">
            <Avatar name={user.name} size="xl" className="mx-auto mb-4" />
            <h2 className="font-display text-2xl text-ink-50">{user.name}</h2>
            <div className="text-sm text-ink-200 mb-4">{user.email}</div>
            <div className="flex justify-center gap-2 mb-6">
              <Badge variant={user.role === 'admin' ? 'warning' : 'info'}>{user.role}</Badge>
              <Badge variant="neutral">{user.plan}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-ink-500/40">
              <div>
                <div className="text-[10px] uppercase tracking-widest font-mono text-ink-300">
                  Joined
                </div>
                <div className="text-sm text-ink-50 mt-1">{formatDate(user.createdAt)}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest font-mono text-ink-300">
                  Logins
                </div>
                <div className="text-sm text-ink-50 mt-1 tabular">{user.loginCount || 0}</div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Profile form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <h3 className="font-display text-xl text-ink-50">Personal information</h3>
          </CardHeader>
          <CardBody>
            <form onSubmit={saveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
                <Input label="Email" value={user.email} disabled />
                <Input
                  label="Phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
                <Input
                  label="Country"
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                />
                <Input
                  label="Company"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className="sm:col-span-2"
                />
              </div>
              <div className="flex justify-end pt-4 border-t border-ink-500/40">
                <Button type="submit" loading={saving}>
                  <Save size={14} /> Save changes
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>

        {/* Password */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center gap-2">
              <KeyRound size={16} className="text-amber" />
              <h3 className="font-display text-xl text-ink-50">Security</h3>
            </div>
            <p className="text-xs text-ink-300 mt-1">
              Update your password regularly to keep your account secure.
            </p>
          </CardHeader>
          <CardBody>
            <form onSubmit={savePassword} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <Input
                label="Current password"
                type="password"
                value={pwForm.currentPassword}
                onChange={(e) =>
                  setPwForm({ ...pwForm, currentPassword: e.target.value })
                }
                required
              />
              <Input
                label="New password"
                type="password"
                value={pwForm.newPassword}
                onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
                required
                minLength={6}
              />
              <Button type="submit" loading={pwSaving}>
                Update password
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
