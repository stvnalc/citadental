import { useState } from "react";
import { Bell, CalendarDays, Info } from "lucide-react";
import { notifications } from "@/data/mockData";

const typeIcons = { appointment: CalendarDays, reminder: Bell, info: Info };

export default function Notifications() {
  const [notifs, setNotifs] = useState(notifications);

  const markRead = (id: string) => setNotifs(notifs.map((n) => n.id === id ? { ...n, read: true } : n));

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Notificaciones</h1>
        <button onClick={() => setNotifs(notifs.map((n) => ({ ...n, read: true })))} className="text-sm text-primary font-medium hover:underline">
          Marcar todas como leídas
        </button>
      </div>

      <div className="space-y-2">
        {notifs.map((n) => {
          const Icon = typeIcons[n.type];
          return (
            <button
              key={n.id}
              onClick={() => markRead(n.id)}
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
                  <p className="text-xs text-muted-foreground mt-1">{n.date}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
