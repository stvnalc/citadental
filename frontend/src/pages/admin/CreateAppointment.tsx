import { useState, useEffect } from "react";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { adminAPI, publicAPI } from "@/lib/api";
import { toast } from "sonner";

export default function CreateAppointment() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [slots, setSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const [userId, setUserId] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    Promise.all([
      adminAPI.getPatients(),
      adminAPI.getAllServices(),
    ]).then(([pRes, sRes]) => {
      setPatients(pRes.data.patients || []);
      setServices((sRes.data.services || []).filter((s: any) => s.isActive !== false));
    }).catch(() => toast.error('Error al cargar datos'));
  }, []);

  // Load available slots when date and service change
  useEffect(() => {
    if (!date || !serviceId) { setSlots([]); return; }
    const svc = services.find(s => s.id === serviceId);
    if (!svc) return;
    setSlotsLoading(true);
    publicAPI.getAvailability(date, svc.duration || svc.durationMinutes || 30)
      .then(({ data }) => {
        const available = (data.slots || []).map((s: any) => s.startTime);
        setSlots(available);
        if (!available.includes(startTime)) setStartTime('');
      })
      .catch(() => setSlots([]))
      .finally(() => setSlotsLoading(false));
  }, [date, serviceId, services]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !serviceId || !date || !startTime) {
      toast.error('Completa todos los campos obligatorios');
      return;
    }
    setLoading(true);
    try {
      await adminAPI.createManualAppointment({ userId, serviceId, date, startTime, notes: notes || undefined });
      setSubmitted(true);
      toast.success('Cita creada exitosamente');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Error al crear la cita');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setUserId(''); setServiceId(''); setDate(''); setStartTime(''); setNotes('');
  };

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
          <button onClick={resetForm} className="gradient-dental px-5 py-2.5 rounded-lg font-medium text-white text-sm hover:opacity-90">Crear otra</button>
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
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Paciente</label>
            <select
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Seleccionar paciente</option>
              {patients.map((p) => <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Servicio</label>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Seleccionar servicio</option>
              {services.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.duration || s.durationMinutes} min)</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Fecha</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Hora</label>
              {slotsLoading ? (
                <div className="flex items-center gap-2 py-2.5 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Cargando...
                </div>
              ) : (
                <select
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">{slots.length === 0 && date ? 'Sin disponibilidad' : 'Hora'}</option>
                  {slots.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Observaciones</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              placeholder="Notas adicionales..."
            />
          </div>
          <button
            type="submit"
            disabled={loading || !userId || !serviceId || !date || !startTime}
            className="w-full gradient-dental py-3 rounded-lg font-semibold text-white hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Creando...' : 'Crear cita'}
          </button>
        </form>
      </div>
    </div>
  );
}
