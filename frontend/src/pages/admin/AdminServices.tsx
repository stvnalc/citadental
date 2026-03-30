import { useState, useEffect } from "react";
import { Plus, Edit2, Loader2 } from "lucide-react";
import { adminAPI } from "@/lib/api";
import { toast } from "sonner";

export default function AdminServices() {
  const [servicesList, setServicesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => { loadServices(); }, []);

  const loadServices = async () => {
    try {
      const { data } = await adminAPI.getAllServices();
      setServicesList(data.services || []);
    } catch {
      toast.error('Error al cargar servicios');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditId(null);
    setName(''); setDescription(''); setDuration(''); setPrice('');
    setShowForm(true);
  };

  const openEdit = (s: any) => {
    setEditId(s.id);
    setName(s.name || '');
    setDescription(s.description || '');
    setDuration(String(s.duration || s.durationMinutes || ''));
    setPrice(String(s.price || ''));
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !duration || !price) { toast.error('Completa los campos obligatorios'); return; }
    setSaving(true);
    try {
      if (editId) {
        await adminAPI.updateService(editId, { name, description, duration: Number(duration), price: Number(price) });
        toast.success('Servicio actualizado');
      } else {
        await adminAPI.createService({ name, description, duration: Number(duration), price: Number(price) });
        toast.success('Servicio creado');
      }
      setShowForm(false);
      loadServices();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (s: any) => {
    try {
      if (s.isActive) {
        await adminAPI.deleteService(s.id);
      } else {
        await adminAPI.updateService(s.id, { isActive: true });
      }
      loadServices();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Error al actualizar');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-foreground">Gestión de Servicios</h1>
        <button onClick={openCreate} className="gradient-dental inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white hover:opacity-90">
          <Plus className="h-4 w-4" /> Nuevo servicio
        </button>
      </div>

      {showForm && (
        <div className="rounded-xl border bg-card p-6 shadow-card">
          <h3 className="font-semibold text-foreground mb-4">{editId ? 'Editar' : 'Crear'} servicio</h3>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Nombre</label>
                <input value={name} onChange={e => setName(e.target.value)} className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Ej: Limpieza Dental" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Duración (min)</label>
                <input type="number" value={duration} onChange={e => setDuration(e.target.value)} className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="45" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Descripción</label>
              <textarea rows={2} value={description} onChange={e => setDescription(e.target.value)} className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" placeholder="Descripción del servicio..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Precio ($)</label>
              <input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="35" />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-lg border font-medium text-foreground hover:bg-secondary text-sm">Cancelar</button>
              <button type="submit" disabled={saving} className="flex-1 gradient-dental py-2.5 rounded-lg font-medium text-white text-sm hover:opacity-90 disabled:opacity-50">
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {servicesList.map((s) => (
          <div key={s.id} className={`rounded-xl border bg-card p-4 shadow-card transition-opacity ${!s.isActive ? 'opacity-60' : ''}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground">{s.name}</h3>
                  {!s.isActive && <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">Inactivo</span>}
                </div>
                <p className="text-sm text-muted-foreground">{s.description || 'Sin descripción'}</p>
                <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                  <span>⏱ {s.duration || s.durationMinutes} min</span>
                  <span className="font-medium text-primary">${Number(s.price).toFixed(2)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => openEdit(s)} className="p-2 rounded-lg hover:bg-secondary transition-colors">
                  <Edit2 className="h-4 w-4 text-muted-foreground" />
                </button>
                <button
                  onClick={() => toggleActive(s)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${s.isActive ? 'bg-primary' : 'bg-muted'}`}
                >
                  <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${s.isActive ? 'left-5' : 'left-0.5'}`} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {servicesList.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No hay servicios registrados.</p>
        )}
      </div>
    </div>
  );
}
