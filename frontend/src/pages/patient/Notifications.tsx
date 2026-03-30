import { useState, useEffect } from "react";
import { Bell, CalendarDays, Info } from "lucide-react";
import { notificationsAPI } from "@/lib/api";
import { toast } from "sonner";

const typeIcons: Record<string, any> = { appointment: CalendarDays, reminder: Bell, info: Info };

export default function Notifications() {
  const [notifs, setNotifs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifs = () => {
    notificationsAPI.getAll()
      .then(res => setNotifs(res.data.notifications || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadNotifs(); }, []);

  const markRead = async (id: string) => {
    try {
      await notificationsAPI.markAsRead(id);
      setNotifs(notifs.map(n => n.id === id ? { ...n, isRead: true, read: true } : n));
    } catch {}
  };

  const markAllRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      setNotifs(notifs.map(n => ({ ...n, isRead: true, read: true })));
      toast.success("Todas las notificaciones marcadas como leídas");
    } catch {}
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Notificaciones</h1>
        <button onClick={markAllRead} className="text-sm text-primary font-medium hover:underline">
          Marcar todas como leídas
        </button>
      </div>

      {notifs.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Bell className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">Sin notificaciones</p>
          <p className="text-sm mt-1">No tienes notificaciones por el momento.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifs.map((n: any) => {
            const Icon = typeIcons[n.type] || Info;
            return (
              <button
                key={n.id}
                onClick={() => !n.read && markRead(n.id)}
                className={`w-full text-left rounded-xl border p-4 transition-all ${
                  !n.read ? "bg-accent/50 border-primary/20" : "bg-card"
                }`}
              >
                <div className="flex gap-3">
                  <div className={`rounded-lg p-2 h-fit ${!n.read ? "bg-primary/10" : "bg-secondary"}`}>
                    <Icon className={`h-4 w-4 ${!n.read ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm font-medium ${!n.read ? "text-foreground" : "text-muted-foreground"}`}>{n.title}</p>
                      {!n.read && <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{n.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(n.createdAt).toLocaleDateString('es-ES')}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
