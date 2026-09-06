import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import * as notificationsService from '../../services/notificationsService';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';

export default function Notifications() {
  const { profile } = useAuth();
  const [notifications, setNotifications] = useState(null);

  useEffect(() => {
    if (!profile?.id) return;
    notificationsService.getByUser(profile.id).then(setNotifications).catch(() => setNotifications([]));
  }, [profile?.id]);

  async function handleRead(n) {
    if (n.read) return;
    await notificationsService.markAsRead(n.id);
    setNotifications((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
  }

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-ink">Notifications</h1>
      {notifications === null ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : notifications.length === 0 ? (
        <EmptyState icon={Bell} title="Aucune notification" />
      ) : (
        <div className="flex flex-col gap-2">
          {notifications.map((n) => (
            <button
              key={n.id}
              onClick={() => handleRead(n)}
              className={`rounded-xl border p-4 text-left text-sm shadow-sm ${n.read ? 'border-black/5 bg-white' : 'border-brand/30 bg-blue-50/50'}`}
            >
              <p className="font-bold text-ink">{n.title}</p>
              <p className="mt-1 text-gray-500">{n.message}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
