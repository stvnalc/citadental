import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, FileText, ChevronDown, Loader2, Calendar, CalendarDays, CalendarRange, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { adminAPI } from "@/lib/api";
import { StatusBadge } from "@/components/StatusBadge";
import type { AppointmentStatus } from "@/data/mockData";
import { toast } from "sonner";

type ReportRange = "day" | "month" | "year";
type SortKey = "patient" | "service" | "dateTime" | null;
type SortDir = "asc" | "desc";

export default function AdminAppointments() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<AppointmentStatus | "all">("all");
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportLoading, setReportLoading] = useState<ReportRange | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (filter !== 'all') params.status = filter;
    adminAPI.getAppointments(params)
      .then(res => setAppointments(res.data?.appointments || res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filter]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setReportOpen(false);
      }
    }
    if (reportOpen) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [reportOpen]);

  const handleExport = async (range: ReportRange) => {
    setReportLoading(range);
    try {
      const res = await adminAPI.exportAppointmentsReport(range, filter);
      const blob = new Blob([res.data], {
        type: "application/pdf",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      const rangeNames: Record<ReportRange, string> = { day: "Hoy", month: "Mes", year: "Año" };
      const dateStr = new Date().toISOString().slice(0, 10);
      link.href = url;
      link.download = `Reporte_Citas_${rangeNames[range]}_${dateStr}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Reporte descargado exitosamente");
    } catch {
      toast.error("Error al generar el reporte");
    } finally {
      setReportLoading(null);
      setReportOpen(false);
    }
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const filtered = appointments.filter((a: any) => {
    const name = `${a.user?.firstName || ''} ${a.user?.lastName || ''}`;
    const svc = a.service?.name || '';
    return name.toLowerCase().includes(search.toLowerCase()) || svc.toLowerCase().includes(search.toLowerCase());
  });

  const sorted = [...filtered].sort((a: any, b: any) => {
    if (!sortKey) return 0;
    const dir = sortDir === "asc" ? 1 : -1;

    switch (sortKey) {
      case "patient": {
        const nameA = `${a.user?.firstName || ''} ${a.user?.lastName || ''}`.toLowerCase();
        const nameB = `${b.user?.firstName || ''} ${b.user?.lastName || ''}`.toLowerCase();
        return nameA.localeCompare(nameB) * dir;
      }
      case "service": {
        const svcA = (a.service?.name || '').toLowerCase();
        const svcB = (b.service?.name || '').toLowerCase();
        return svcA.localeCompare(svcB) * dir;
      }
      case "dateTime": {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        if (dateA !== dateB) return (dateA - dateB) * dir;
        // Same date — compare time
        const timeA = a.startTime || '00:00';
        const timeB = b.startTime || '00:00';
        return timeA.localeCompare(timeB) * dir;
      }
      default:
        return 0;
    }
  });

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return <ArrowUpDown className="h-3 w-3 opacity-40" />;
    return sortDir === "asc"
      ? <ArrowUp className="h-3 w-3 text-primary" />
      : <ArrowDown className="h-3 w-3 text-primary" />;
  };

  const reportOptions: { range: ReportRange; label: string; description: string; icon: typeof Calendar }[] = [
    { range: "day", label: "Hoy", description: "Citas del día actual", icon: Calendar },
    { range: "month", label: "Este mes", description: "Citas del mes en curso", icon: CalendarDays },
    { range: "year", label: "Este año", description: "Citas del año en curso", icon: CalendarRange },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-foreground">Agenda de Citas</h1>
        <div className="flex items-center gap-2">
          {/* Report dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setReportOpen(!reportOpen)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 transition-colors"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Reporte</span>
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${reportOpen ? "rotate-180" : ""}`} />
            </button>
            {reportOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl border bg-card shadow-lg z-50 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150">
                <div className="px-3 py-2.5 border-b bg-secondary/50">
                  <p className="text-xs font-medium text-muted-foreground">Generar reporte PDF</p>
                  {filter !== "all" && (
                    <p className="text-[10px] text-primary mt-0.5">
                      Filtro activo: {filter === "confirmed" ? "Confirmadas" : filter === "pending" ? "Pendientes" : filter === "completed" ? "Completadas" : "Canceladas"}
                    </p>
                  )}
                </div>
                {reportOptions.map(({ range, label, description, icon: Icon }) => (
                  <button
                    key={range}
                    onClick={() => handleExport(range)}
                    disabled={reportLoading !== null}
                    className="w-full flex items-center gap-3 px-3 py-3 text-left hover:bg-secondary/50 transition-colors disabled:opacity-50"
                  >
                    {reportLoading === range ? (
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    ) : (
                      <Icon className="h-4 w-4 text-primary" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-foreground">{label}</p>
                      <p className="text-[11px] text-muted-foreground">{description}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <Link to="/admin/citas/nueva" className="gradient-dental inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white hover:opacity-90">
            <Plus className="h-4 w-4" /> Nueva cita
          </Link>
        </div>
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
        <div className="flex items-center gap-1 bg-secondary rounded-lg p-1 overflow-x-auto">
          {(["all", "confirmed", "pending", "completed", "cancelled"] as const).map((f) => (
            <button
              key={f}
              onClick={() => { setFilter(f); setLoading(true); }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                filter === f ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
              }`}
            >
              {f === "all" ? "Todas" : f === "confirmed" ? "Confirmadas" : f === "pending" ? "Pendientes" : f === "completed" ? "Completadas" : "Canceladas"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block rounded-xl border bg-card shadow-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-secondary/50">
                  <th className="text-left px-4 py-3">
                    <button onClick={() => handleSort("patient")} className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                      Paciente <SortIcon column="patient" />
                    </button>
                  </th>
                  <th className="text-left px-4 py-3">
                    <button onClick={() => handleSort("service")} className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                      Servicio <SortIcon column="service" />
                    </button>
                  </th>
                  <th className="text-left px-4 py-3" colSpan={2}>
                    <button onClick={() => handleSort("dateTime")} className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                      Fecha y Hora <SortIcon column="dateTime" />
                    </button>
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Estado</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {sorted.map((a: any) => {
                  const name = `${a.user?.firstName || ''} ${a.user?.lastName || ''}`;
                  const initials = `${a.user?.firstName?.[0] || ''}${a.user?.lastName?.[0] || ''}`;
                  return (
                    <tr key={a.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-xs font-bold text-accent-foreground">{initials}</div>
                          <span className="text-sm font-medium text-foreground">{name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{a.service?.name}</td>
                      <td className="px-4 py-3 text-sm text-foreground">{new Date(a.date).toLocaleDateString('es-ES')}</td>
                      <td className="px-4 py-3 text-sm font-medium text-foreground">{a.startTime}</td>
                      <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                      <td className="px-4 py-3 text-right">
                        <Link to={`/admin/citas/${a.id}`} className="text-sm text-primary font-medium hover:underline">Ver</Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && <p className="p-8 text-center text-muted-foreground text-sm">No se encontraron citas.</p>}
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {sorted.map((a: any) => {
              const name = `${a.user?.firstName || ''} ${a.user?.lastName || ''}`;
              const initials = `${a.user?.firstName?.[0] || ''}${a.user?.lastName?.[0] || ''}`;
              return (
                <Link key={a.id} to={`/admin/citas/${a.id}`} className="block rounded-xl border bg-card p-4 shadow-card">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-xs font-bold text-accent-foreground">{initials}</div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{name}</p>
                        <p className="text-xs text-muted-foreground">{a.service?.name}</p>
                      </div>
                    </div>
                    <StatusBadge status={a.status} />
                  </div>
                  <div className="flex gap-4 text-xs text-muted-foreground mt-2">
                    <span>📅 {new Date(a.date).toLocaleDateString('es-ES')}</span>
                    <span>🕐 {a.startTime}</span>
                  </div>
                </Link>
              );
            })}
            {filtered.length === 0 && <p className="py-8 text-center text-muted-foreground text-sm">No se encontraron citas.</p>}
          </div>
        </>
      )}
    </div>
  );
}
