import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Filter } from "lucide-react";
import { appointments } from "@/data/mockData";
import { StatusBadge } from "@/components/StatusBadge";
import type { AppointmentStatus } from "@/data/mockData";

export default function AdminAppointments() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<AppointmentStatus | "all">("all");

  const filtered = appointments.filter((a) => {
    const matchesSearch = a.patientName.toLowerCase().includes(search.toLowerCase()) || a.serviceName.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || a.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-foreground">Agenda de Citas</h1>
        <Link to="/admin/citas/nueva" className="gradient-dental inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white hover:opacity-90">
          <Plus className="h-4 w-4" /> Nueva cita
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar paciente o servicio..."
            className="w-full rounded-lg border bg-card pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
          {(["all", "confirmed", "pending", "completed", "cancelled"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                filter === f ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
              }`}
            >
              {f === "all" ? "Todas" : f === "confirmed" ? "Confirmadas" : f === "pending" ? "Pendientes" : f === "completed" ? "Completadas" : "Canceladas"}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block rounded-xl border bg-card shadow-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-secondary/50">
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Paciente</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Servicio</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Fecha</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Hora</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Estado</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((a) => (
              <tr key={a.id} className="hover:bg-secondary/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-xs font-bold text-accent-foreground">
                      {a.patientName.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <span className="text-sm font-medium text-foreground">{a.patientName}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{a.serviceName}</td>
                <td className="px-4 py-3 text-sm text-foreground">{a.date}</td>
                <td className="px-4 py-3 text-sm font-medium text-foreground">{a.time}</td>
                <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                <td className="px-4 py-3 text-right">
                  <Link to={`/admin/citas/${a.id}`} className="text-sm text-primary font-medium hover:underline">Ver</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="p-8 text-center text-muted-foreground text-sm">No se encontraron citas.</p>
        )}
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {filtered.map((a) => (
          <Link key={a.id} to={`/admin/citas/${a.id}`} className="block rounded-xl border bg-card p-4 shadow-card">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-xs font-bold text-accent-foreground">
                  {a.patientName.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{a.patientName}</p>
                  <p className="text-xs text-muted-foreground">{a.serviceName}</p>
                </div>
              </div>
              <StatusBadge status={a.status} />
            </div>
            <div className="flex gap-4 text-xs text-muted-foreground mt-2">
              <span>📅 {a.date}</span>
              <span>🕐 {a.time}</span>
            </div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <p className="py-8 text-center text-muted-foreground text-sm">No se encontraron citas.</p>
        )}
      </div>
    </div>
  );
}
