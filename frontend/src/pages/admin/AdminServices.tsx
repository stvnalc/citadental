import { useState } from "react";
import { Plus, Edit2, X, Check } from "lucide-react";
import { services as mockServices, type Service } from "@/data/mockData";

export default function AdminServices() {
  const [servicesList, setServicesList] = useState(mockServices);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const toggleActive = (id: string) => {
    setServicesList(servicesList.map((s) => s.id === id ? { ...s, active: !s.active } : s));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-foreground">Gestión de Servicios</h1>
        <button onClick={() => { setShowForm(true); setEditId(null); }} className="gradient-dental inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white hover:opacity-90">
          <Plus className="h-4 w-4" /> Nuevo servicio
        </button>
      </div>

      {showForm && (
        <div className="rounded-xl border bg-card p-6 shadow-card">
          <h3 className="font-semibold text-foreground mb-4">{editId ? "Editar" : "Crear"} servicio</h3>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setShowForm(false); }}>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Nombre</label>
                <input className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Ej: Limpieza Dental" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Categoría</label>
                <input className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Ej: Preventivo" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Descripción</label>
              <textarea rows={2} className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" placeholder="Descripción del servicio..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Duración (min)</label>
                <input type="number" className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="45" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Precio ($)</label>
                <input type="number" className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="35" />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-lg border font-medium text-foreground hover:bg-secondary text-sm">Cancelar</button>
              <button type="submit" className="flex-1 gradient-dental py-2.5 rounded-lg font-medium text-white text-sm hover:opacity-90">Guardar</button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {servicesList.map((s) => (
          <div key={s.id} className={`rounded-xl border bg-card p-4 shadow-card transition-opacity ${!s.active ? "opacity-60" : ""}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground">{s.name}</h3>
                  <span className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full">{s.category}</span>
                </div>
                <p className="text-sm text-muted-foreground">{s.description}</p>
                <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                  <span>⏱ {s.duration} min</span>
                  <span className="font-medium text-primary">${s.price}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => { setEditId(s.id); setShowForm(true); }} className="p-2 rounded-lg hover:bg-secondary transition-colors">
                  <Edit2 className="h-4 w-4 text-muted-foreground" />
                </button>
                <button
                  onClick={() => toggleActive(s.id)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${s.active ? "bg-primary" : "bg-muted"}`}
                >
                  <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${s.active ? "left-5" : "left-0.5"}`} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
