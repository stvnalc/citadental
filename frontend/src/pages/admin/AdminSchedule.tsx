import { useState, useEffect } from "react";
import { CalendarX, Loader2, Trash2 } from "lucide-react";
import { adminAPI } from "@/lib/api";
import { toast } from "sonner";

const DAY_NAMES = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export default function AdminSchedule() {
  const [hours, setHours] = useState<any[]>([]);
  const [blocks, setBlocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Block form
  const [newBlockDate, setNewBlockDate] = useState('');
  const [newBlockStart, setNewBlockStart] = useState('09:00');
  const [newBlockEnd, setNewBlockEnd] = useState('18:00');
  const [newBlockReason, setNewBlockReason] = useState('');

  useEffect(() => { loadSchedule(); }, []);

  const loadSchedule = async () => {
    try {
      const { data } = await adminAPI.getSchedule();
      // Ensure all 7 days exist
      const allDays = Array.from({ length: 7 }, (_, i) => {
        const existing = (data.hours || []).find((h: any) => h.dayOfWeek === i + 1);
        return existing || { dayOfWeek: i + 1, openTime: '09:00', closeTime: '18:00', isOpen: i < 5 };
      });
      setHours(allDays);
      setBlocks(data.blocks || []);
    } catch {
      toast.error('Error al cargar horarios');
    } finally {
      setLoading(false);
    }
  };

  const updateDay = (idx: number, field: string, value: string | boolean) => {
    setHours(hours.map((d, i) => i === idx ? { ...d, [field]: value } : d));
  };

  const handleSaveSchedule = async () => {
    setSaving(true);
    try {
      const payload = hours.map(h => ({
        dayOfWeek: h.dayOfWeek,
        openTime: h.openTime,
        closeTime: h.closeTime,
        isOpen: h.isOpen,
      }));
      await adminAPI.updateSchedule(payload);
      toast.success('Horario actualizado');
    } catch {
      toast.error('Error al guardar horario');
    } finally {
      setSaving(false);
    }
  };

  const handleAddBlock = async () => {
    if (!newBlockDate || !newBlockStart || !newBlockEnd) {
      toast.error('Completa fecha y horario');
      return;
    }
    try {
      await adminAPI.createBlock({ date: newBlockDate, startTime: newBlockStart, endTime: newBlockEnd, reason: newBlockReason || undefined });
      toast.success('Bloque creado');
      setNewBlockDate(''); setNewBlockReason('');
      loadSchedule();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Error al crear bloque');
    }
  };

  const handleDeleteBlock = async (id: string) => {
    try {
      await adminAPI.deleteBlock(id);
      setBlocks(blocks.filter(b => b.id !== id));
      toast.success('Bloque eliminado');
    } catch {
      toast.error('Error al eliminar bloque');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-foreground">Gestión de Horarios</h1>

      <div className="rounded-xl border bg-card p-6 shadow-card">
        <h3 className="font-semibold text-foreground mb-4">Horario Semanal</h3>
        <div className="space-y-3">
          {hours.map((d, i) => (
            <div key={d.dayOfWeek} className="flex items-center gap-4">
              <div className="w-24 flex items-center gap-2">
                <button
                  onClick={() => updateDay(i, 'isOpen', !d.isOpen)}
                  className={`relative w-9 h-5 rounded-full transition-colors ${d.isOpen ? 'bg-primary' : 'bg-muted'}`}
                >
                  <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${d.isOpen ? 'left-4' : 'left-0.5'}`} />
                </button>
                <span className={`text-sm font-medium ${d.isOpen ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {DAY_NAMES[d.dayOfWeek - 1]?.slice(0, 3)}
                </span>
              </div>
              {d.isOpen ? (
                <div className="flex items-center gap-2 flex-1">
                  <input type="time" value={d.openTime} onChange={e => updateDay(i, 'openTime', e.target.value)} className="rounded-lg border bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  <span className="text-sm text-muted-foreground">a</span>
                  <input type="time" value={d.closeTime} onChange={e => updateDay(i, 'closeTime', e.target.value)} className="rounded-lg border bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              ) : (
                <span className="text-sm text-destructive font-medium">Cerrado</span>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={handleSaveSchedule}
          disabled={saving}
          className="mt-4 gradient-dental px-5 py-2.5 rounded-lg text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
        >
          {saving ? 'Guardando...' : 'Guardar horario'}
        </button>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-card">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <CalendarX className="h-5 w-5 text-destructive" /> Bloqueos de Horario
        </h3>
        <p className="text-sm text-muted-foreground mb-4">Bloquea rangos horarios donde no se aceptan citas.</p>
        <div className="flex flex-wrap gap-2 mb-2">
          <input
            type="date"
            value={newBlockDate}
            onChange={(e) => setNewBlockDate(e.target.value)}
            className="rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <input type="time" value={newBlockStart} onChange={e => setNewBlockStart(e.target.value)} className="rounded-lg border bg-background px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          <input type="time" value={newBlockEnd} onChange={e => setNewBlockEnd(e.target.value)} className="rounded-lg border bg-background px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div className="flex gap-2 mb-4">
          <input
            value={newBlockReason}
            onChange={e => setNewBlockReason(e.target.value)}
            placeholder="Motivo (opcional)"
            className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            onClick={handleAddBlock}
            className="gradient-dental px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90"
          >
            Bloquear
          </button>
        </div>
        {blocks.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay bloqueos programados.</p>
        ) : (
          <div className="space-y-2">
            {blocks.map((b) => (
              <div key={b.id} className="flex items-center justify-between bg-destructive/5 rounded-lg px-3 py-2">
                <div>
                  <span className="text-sm font-medium text-foreground">
                    {new Date(b.date).toLocaleDateString('es-VE')} — {b.startTime} a {b.endTime}
                  </span>
                  {b.reason && <span className="text-xs text-muted-foreground ml-2">({b.reason})</span>}
                </div>
                <button onClick={() => handleDeleteBlock(b.id)} className="p-1 hover:text-destructive transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
