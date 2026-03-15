import { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { patients, services, timeSlots } from "@/data/mockData";

export default function CreateAppointment() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <div className="w-16 h-16 rounded-full bg-success/15 flex items-center justify-center mx-auto mb-4">
          <Check className="h-8 w-8 text-success" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Cita creada</h2>
        <p className="text-muted-foreground">La cita ha sido registrada exitosamente.</p>
        <div className="flex justify-center gap-3 mt-6">
          <Link to="/admin/citas" className="px-5 py-2.5 rounded-lg border font-medium text-foreground hover:bg-secondary text-sm">Ver agenda</Link>
          <button onClick={() => setSubmitted(false)} className="gradient-dental px-5 py-2.5 rounded-lg font-medium text-white text-sm hover:opacity-90">Crear otra</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <Link to="/admin/citas" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Volver
      </Link>
      <h1 className="text-2xl font-bold text-foreground">Crear Cita Manual</h1>

      <div className="rounded-xl border bg-card p-6 shadow-card">
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Paciente</label>
            <select className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="">Seleccionar paciente</option>
              {patients.map((p) => <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Servicio</label>
            <select className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="">Seleccionar servicio</option>
              {services.filter((s) => s.active).map((s) => <option key={s.id} value={s.id}>{s.name} ({s.duration} min)</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Fecha</label>
              <input type="date" className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Hora</label>
              <select className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="">Hora</option>
                {timeSlots.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Observaciones</label>
            <textarea rows={3} className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" placeholder="Notas adicionales..." />
          </div>
          <button type="submit" className="w-full gradient-dental py-3 rounded-lg font-semibold text-white hover:opacity-90">
            Crear cita
          </button>
        </form>
      </div>
    </div>
  );
}
