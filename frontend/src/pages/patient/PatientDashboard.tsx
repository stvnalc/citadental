import { Link } from "react-router-dom";
import { CalendarPlus, CalendarDays, Clock, Bell } from "lucide-react";
import { appointments } from "@/data/mockData";
import { StatusBadge } from "@/components/StatusBadge";

export default function PatientDashboard() {
  const upcoming = appointments.filter((a) => a.patientId === "p1" && (a.status === "confirmed" || a.status === "pending"));
  const next = upcoming[0];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">¡Hola, María! 👋</h1>
        <p className="text-muted-foreground">Bienvenida a tu panel de CitaDental.</p>
      </div>

      {/* Next appointment */}
      {next && (
        <div className="rounded-xl gradient-dental p-6 text-white">
          <p className="text-sm font-medium text-white/70 mb-1">Próxima cita</p>
          <h2 className="text-xl font-bold">{next.serviceName}</h2>
          <div className="flex flex-wrap gap-4 mt-3 text-sm text-white/80">
            <span className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4" /> {next.date}</span>
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {next.time}</span>
          </div>
          <div className="mt-4 flex gap-3">
            <Link to="/paciente/citas" className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium backdrop-blur-sm transition-colors">
              Ver detalles
            </Link>
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { to: "/paciente/reservar", icon: CalendarPlus, label: "Reservar cita", desc: "Agenda una nueva" },
          { to: "/paciente/citas", icon: CalendarDays, label: "Mis citas", desc: `${upcoming.length} próximas` },
          { to: "/paciente/notificaciones", icon: Bell, label: "Notificaciones", desc: "2 nuevas" },
          { to: "/paciente/perfil", icon: Clock, label: "Mi perfil", desc: "Ver datos" },
        ].map((a) => (
          <Link key={a.to} to={a.to} className="rounded-xl border bg-card p-4 shadow-card hover:shadow-card-hover transition-shadow">
            <div className="rounded-lg bg-accent p-2 w-fit mb-3">
              <a.icon className="h-5 w-5 text-primary" />
            </div>
            <p className="font-semibold text-foreground text-sm">{a.label}</p>
            <p className="text-xs text-muted-foreground">{a.desc}</p>
          </Link>
        ))}
      </div>

      {/* Recent appointments */}
      <div className="rounded-xl border bg-card shadow-card">
        <div className="p-5 border-b flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Citas recientes</h3>
          <Link to="/paciente/citas" className="text-sm text-primary font-medium hover:underline">Ver todas</Link>
        </div>
        <div className="divide-y">
          {appointments.filter((a) => a.patientId === "p1").slice(0, 3).map((a) => (
            <div key={a.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground text-sm">{a.serviceName}</p>
                <p className="text-xs text-muted-foreground">{a.date} · {a.time}</p>
              </div>
              <StatusBadge status={a.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
