import { useState } from "react";
import { weeklySchedule } from "@/data/mockData";
import { CalendarX } from "lucide-react";

export default function AdminSchedule() {
  const [schedule, setSchedule] = useState(weeklySchedule);
  const [blockedDates, setBlockedDates] = useState<string[]>(["2026-03-25"]);
  const [newBlockDate, setNewBlockDate] = useState("");

  const updateDay = (idx: number, field: "open" | "close", value: string) => {
    setSchedule(schedule.map((d, i) => i === idx ? { ...d, [field]: value } : d));
  };
  const toggleDay = (idx: number) => {
    setSchedule(schedule.map((d, i) => i === idx ? { ...d, active: !d.active } : d));
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-foreground">Gestión de Horarios</h1>

      <div className="rounded-xl border bg-card p-6 shadow-card">
        <h3 className="font-semibold text-foreground mb-4">Horario Semanal</h3>
        <div className="space-y-3">
          {schedule.map((d, i) => (
            <div key={d.day} className="flex items-center gap-4">
              <div className="w-24 flex items-center gap-2">
                <button
                  onClick={() => toggleDay(i)}
                  className={`relative w-9 h-5 rounded-full transition-colors ${d.active ? "bg-primary" : "bg-muted"}`}
                >
                  <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${d.active ? "left-4" : "left-0.5"}`} />
                </button>
                <span className={`text-sm font-medium ${d.active ? "text-foreground" : "text-muted-foreground"}`}>{d.day.slice(0, 3)}</span>
              </div>
              {d.active ? (
                <div className="flex items-center gap-2 flex-1">
                  <input type="time" value={d.open} onChange={(e) => updateDay(i, "open", e.target.value)} className="rounded-lg border bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  <span className="text-sm text-muted-foreground">a</span>
                  <input type="time" value={d.close} onChange={(e) => updateDay(i, "close", e.target.value)} className="rounded-lg border bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              ) : (
                <span className="text-sm text-destructive font-medium">Cerrado</span>
              )}
            </div>
          ))}
        </div>
        <button className="mt-4 gradient-dental px-5 py-2.5 rounded-lg text-sm font-semibold text-white hover:opacity-90">
          Guardar horario
        </button>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-card">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <CalendarX className="h-5 w-5 text-destructive" /> Fechas Bloqueadas
        </h3>
        <p className="text-sm text-muted-foreground mb-4">Bloquea días completos donde no se aceptan citas.</p>
        <div className="flex gap-2 mb-4">
          <input
            type="date"
            value={newBlockDate}
            onChange={(e) => setNewBlockDate(e.target.value)}
            className="rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            onClick={() => { if (newBlockDate && !blockedDates.includes(newBlockDate)) { setBlockedDates([...blockedDates, newBlockDate]); setNewBlockDate(""); } }}
            className="gradient-dental px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90"
          >
            Bloquear
          </button>
        </div>
        {blockedDates.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay fechas bloqueadas.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {blockedDates.map((d) => (
              <span key={d} className="inline-flex items-center gap-1.5 bg-destructive/10 text-destructive text-sm font-medium px-3 py-1 rounded-full">
                {d}
                <button onClick={() => setBlockedDates(blockedDates.filter((x) => x !== d))} className="hover:text-destructive/70">×</button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
