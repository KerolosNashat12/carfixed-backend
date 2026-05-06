import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import api from '../utils/api';
import { Card, CardHeader, CardBody } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { Button } from '../components/Button';
import { Input, Textarea } from '../components/Form';
import { Loading } from '../components/Loading';
import toast from 'react-hot-toast';

const Toggle = ({ label, description, checked, onChange }) => (
  <div className="flex items-start justify-between py-3 border-b border-ink-600/60 last:border-0">
    <div className="pr-6">
      <div className="text-sm text-ink-50 font-medium">{label}</div>
      {description && <div className="text-xs text-ink-300 mt-0.5">{description}</div>}
    </div>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
        checked ? 'bg-amber' : 'bg-ink-500'
      }`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 rounded-full bg-ink-900 transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  </div>
);

export const SettingsPage = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get('/settings')
      .then((res) => setSettings(res.data))
      .catch(() => toast.error('Failed to load settings'))
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const res = await api.put('/settings', settings);
      setSettings(res.data);
      toast.success('Settings saved');
    } catch {
      toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) return <Loading label="Loading settings" />;

  return (
    <div>
      <PageHeader
        eyebrow="§06 · Configuration"
        title="Settings"
        description="System-wide configuration and preferences."
        actions={
          <Button onClick={save} loading={saving}>
            <Save size={14} /> Save changes
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* General */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <h3 className="font-display text-xl text-ink-50">General</h3>
            <p className="text-xs text-ink-300 mt-1">Public-facing branding and identity.</p>
          </CardHeader>
          <CardBody className="space-y-4">
            <Input
              label="Site name"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
            />
            <Textarea
              label="Description"
              rows={3}
              value={settings.siteDescription}
              onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
            />
            <Input
              label="Support email"
              type="email"
              value={settings.supportEmail}
              onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
            />
          </CardBody>
        </Card>

        {/* Toggles */}
        <Card>
          <CardHeader>
            <h3 className="font-display text-xl text-ink-50">System</h3>
            <p className="text-xs text-ink-300 mt-1">Operational switches.</p>
          </CardHeader>
          <CardBody className="-my-1">
            <Toggle
              label="Maintenance mode"
              description="Block public access temporarily."
              checked={settings.maintenanceMode}
              onChange={(v) => setSettings({ ...settings, maintenanceMode: v })}
            />
            <Toggle
              label="Allow signups"
              description="New accounts can be created."
              checked={settings.allowSignup}
              onChange={(v) => setSettings({ ...settings, allowSignup: v })}
            />
            <Toggle
              label="Email notifications"
              description="Send transactional emails."
              checked={settings.emailNotifications}
              onChange={(v) => setSettings({ ...settings, emailNotifications: v })}
            />
            <Toggle
              label="Require 2FA"
              description="All admins must enable 2FA."
              checked={settings.twoFactorRequired}
              onChange={(v) => setSettings({ ...settings, twoFactorRequired: v })}
            />
          </CardBody>
        </Card>

        {/* Plans */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <h3 className="font-display text-xl text-ink-50">Pricing plans</h3>
            <p className="text-xs text-ink-300 mt-1">
              Configure the public pricing tiers.
            </p>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {settings.plans.map((p, i) => (
                <div
                  key={i}
                  className={`border rounded-xl p-5 ${
                    p.popular
                      ? 'border-amber/50 bg-amber/5'
                      : 'border-ink-500/60 bg-ink-800/40'
                  }`}
                >
                  {p.popular && (
                    <div className="text-[10px] uppercase tracking-widest font-mono text-amber mb-2">
                      Most popular
                    </div>
                  )}
                  <Input
                    label="Name"
                    value={p.name}
                    onChange={(e) => {
                      const plans = [...settings.plans];
                      plans[i] = { ...plans[i], name: e.target.value };
                      setSettings({ ...settings, plans });
                    }}
                    className="mb-3"
                  />
                  <Input
                    label="Price (USD)"
                    type="number"
                    value={p.price}
                    onChange={(e) => {
                      const plans = [...settings.plans];
                      plans[i] = { ...plans[i], price: parseFloat(e.target.value) || 0 };
                      setSettings({ ...settings, plans });
                    }}
                  />
                  <div className="mt-3">
                    <div className="text-[10px] uppercase tracking-widest text-ink-200 font-medium mb-2">
                      Features
                    </div>
                    <ul className="text-xs text-ink-100 space-y-1">
                      {p.features.map((f, j) => (
                        <li key={j} className="marker-dot">
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
