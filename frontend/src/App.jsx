import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { AppLayout } from './layouts/AppLayout';
import { Loading } from './components/Loading';

import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { UsersPage } from './pages/UsersPage';
import { SubscriptionsPage } from './pages/SubscriptionsPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { ActivityLogPage } from './pages/ActivityLogPage';
import { SettingsPage } from './pages/SettingsPage';
import { ProfilePage } from './pages/ProfilePage';
import { NotFoundPage } from './pages/NotFoundPage';

const Protected = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-ink-900 flex items-center justify-center">
        <Loading label="Authenticating" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        element={
          <Protected>
            <AppLayout />
          </Protected>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route
          path="users"
          element={
            <Protected roles={['admin', 'manager']}>
              <UsersPage />
            </Protected>
          }
        />
        <Route
          path="subscriptions"
          element={
            <Protected roles={['admin', 'manager']}>
              <SubscriptionsPage />
            </Protected>
          }
        />
        <Route
          path="transactions"
          element={
            <Protected roles={['admin', 'manager']}>
              <TransactionsPage />
            </Protected>
          }
        />
        <Route
          path="activity"
          element={
            <Protected roles={['admin']}>
              <ActivityLogPage />
            </Protected>
          }
        />
        <Route
          path="settings"
          element={
            <Protected roles={['admin']}>
              <SettingsPage />
            </Protected>
          }
        />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
