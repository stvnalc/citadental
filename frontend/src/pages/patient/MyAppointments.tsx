import { useState } from "react";
import { appointments } from "@/data/mockData";
import { StatusBadge } from "@/components/StatusBadge";
import type { AppointmentStatus } from "@/data/mockData";

export default function MyAppointments() {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const myAppts = appointments.filter((a) => a.patientId === "p1");
  const upcoming = myAppts.filter((a) => a.status === "confirmed" || a.status === "pending");
  const past = myAppts.filter((a) => a.status === "completed" || a.status === "cancelled");
  const list = tab === "upcoming" ? upcoming : past;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-6">Mis Citas</h1>

      <div className="flex gap-1 bg-secondary rounded-lg p-1 mb-6">
        <button onClick={() => setTab("upcoming")} className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${tab === "upcoming" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}>
          Próximas ({upcoming.length})
        </button>
        <button onClick={() => setTab("past")} className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${tab === "past" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}>
          Historial ({past.length})
        </button>
      </div>

      {list.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg font-medium">No hay citas</p>
          <p className="text-sm mt-1">No tienes citas {tab === "upcoming" ? "próximas" : "anteriores"}.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((a) => (
            <div key={a.id} className="rounded-xl border bg-card p-4 shadow-card">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-foreground">{a.serviceName}</h3>
                <StatusBadge status={a.status} />
              </div>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span>📅 {a.date}</span>
                <span>🕐 {a.time}</span>
              </div>
              {a.status === "pending" && (
                <div className="mt-3 flex gap-2">
                  <button className="text-xs px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive font-medium hover:bg-destructive/20 transition-colors">
                    Cancelar
                  </button>
                </div>
              )}
              {a.status === "confirmed" && (
                <div className="mt-3 flex gap-2">
                  <button className="text-xs px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive font-medium hover:bg-destructive/20 transition-colors">
                    Cancelar cita
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
