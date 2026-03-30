import { Link } from "react-router-dom";
import { CalendarDays, Users, Stethoscope, Clock, TrendingUp, CheckCircle2, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { adminAPI } from "@/lib/api";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getDashboard()
      .then(res => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;
  }

  const todayAppts = stats?.recentAppointments || [];
  const s = stats?.stats || {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Resumen general de la clínica — Hoy, {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Citas hoy" value={s.todayAppointments || 0} icon={CalendarDays} description={`${s.pendingToday || 0} pendientes`} />
        <StatCard title="Esta semana" value={s.weekAppointments || 0} icon={TrendingUp} />
        <StatCard title="Pacientes" value={s.totalPatients || 0} icon={Users} description="Total registrados" />
        <StatCard title="Completadas hoy" value={s.completedToday || 0} icon={CheckCircle2} description={`${s.pendingToday || 0} pendientes`} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl border bg-card shadow-card">
          <div className="p-5 border-b flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Citas de hoy</h3>
            <Link to="/admin/citas" className="text-sm text-primary font-medium hover:underline">Ver agenda</Link>
          </div>
          <div className="divide-y">
            {todayAppts.length === 0 ? (
              <p className="p-6 text-center text-muted-foreground text-sm">No hay citas para hoy.</p>
            ) : (
              todayAppts.map((a: any) => (
                <div key={a.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-full bg-accent flex items-center justify-center text-xs font-bold text-accent-foreground flex-shrink-0">
                      {a.user?.firstName?.[0]}{a.user?.lastName?.[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">{a.user?.firstName} {a.user?.lastName}</p>
                      <p className="text-xs text-muted-foreground">{a.service?.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-sm font-medium text-foreground">{a.startTime}</span>
                    <StatusBadge status={a.status} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

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

          {(s.pendingToday || 0) > 0 && (
            <div className="rounded-xl border bg-card p-5 shadow-card">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-warning" /> Atención
              </h3>
              <p className="text-sm text-muted-foreground">Hay {s.pendingToday} citas pendientes de confirmación para hoy.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
