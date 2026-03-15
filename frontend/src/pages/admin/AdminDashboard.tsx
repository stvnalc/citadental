import { Link } from "react-router-dom";
import { CalendarDays, Users, Stethoscope, Clock, TrendingUp, CheckCircle2, AlertCircle } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { appointments, adminStats } from "@/data/mockData";

export default function AdminDashboard() {
  const todayAppts = appointments.filter((a) => a.date === "2026-03-16");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Resumen general de la clínica — Hoy, 16 de marzo 2026</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Citas hoy" value={adminStats.todayAppointments} icon={CalendarDays} description="3 confirmadas, 1 pendiente" />
        <StatCard title="Esta semana" value={adminStats.weekAppointments} icon={TrendingUp} trend="+15% vs semana anterior" />
        <StatCard title="Pacientes" value={adminStats.totalPatients} icon={Users} description="Total registrados" />
        <StatCard title="Completadas hoy" value={adminStats.completedToday} icon={CheckCircle2} description={`${adminStats.pendingToday} pendientes`} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's appointments */}
        <div className="lg:col-span-2 rounded-xl border bg-card shadow-card">
          <div className="p-5 border-b flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Citas de hoy</h3>
            <Link to="/admin/citas" className="text-sm text-primary font-medium hover:underline">Ver agenda</Link>
          </div>
          <div className="divide-y">
            {todayAppts.length === 0 ? (
              <p className="p-6 text-center text-muted-foreground text-sm">No hay citas para hoy.</p>
            ) : (
              todayAppts.map((a) => (
                <div key={a.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-full bg-accent flex items-center justify-center text-xs font-bold text-accent-foreground flex-shrink-0">
                      {a.patientName.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">{a.patientName}</p>
                      <p className="text-xs text-muted-foreground">{a.serviceName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-sm font-medium text-foreground">{a.time}</span>
                    <StatusBadge status={a.status} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="space-y-4">
          <div className="rounded-xl border bg-card p-5 shadow-card">
            <h3 className="font-semibold text-foreground mb-4">Accesos rápidos</h3>
            <div className="space-y-2">
              {[
                { to: "/admin/citas/nueva", label: "Crear cita manual", icon: CalendarDays },
                { to: "/admin/servicios", label: "Gestionar servicios", icon: Stethoscope },
                { to: "/admin/horarios", label: "Configurar horarios", icon: Clock },
                { to: "/admin/pacientes", label: "Ver pacientes", icon: Users },
              ].map((a) => (
                <Link key={a.to} to={a.to} className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors">
                  <div className="rounded-lg bg-accent p-2"><a.icon className="h-4 w-4 text-primary" /></div>
                  <span className="text-sm font-medium text-foreground">{a.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-xl border bg-card p-5 shadow-card">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-warning" /> Atención
            </h3>
            <p className="text-sm text-muted-foreground">Hay {adminStats.pendingToday} citas pendientes de confirmación para hoy.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
