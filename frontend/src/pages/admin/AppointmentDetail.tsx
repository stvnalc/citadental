import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, User, Stethoscope, FileText, Loader2 } from "lucide-react";
import { adminAPI } from "@/lib/api";
import { StatusBadge } from "@/components/StatusBadge";
import type { AppointmentStatus } from "@/data/mockData";
import { toast } from "sonner";

export default function AppointmentDetail() {
  const { id } = useParams();
  const [appt, setAppt] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadAppointment();
  }, [id]);

  const loadAppointment = async () => {
    try {
      // We fetch all appointments and find the one (backend doesn't have a single endpoint)
      const { data } = await adminAPI.getAppointments();
      const found = data.appointments?.find((a: any) => a.id === id);
      setAppt(found || null);
    } catch {
      toast.error("Error al cargar la cita");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!appt) return;
    setUpdating(true);
    try {
      await adminAPI.updateAppointmentStatus(appt.id, newStatus);
      setAppt({ ...appt, status: newStatus });
      toast.success(`Cita ${newStatus === 'confirmed' ? 'confirmada' : newStatus === 'completed' ? 'completada' : 'cancelada'}`);
    } catch {
      toast.error("Error al actualizar el estado");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!appt) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Cita no encontrada.</p>
        <Link to="/admin/citas" className="text-primary font-medium hover:underline mt-2 inline-block">Volver a citas</Link>
      </div>
    );
  }

  const patientName = appt.user ? `${appt.user.firstName} ${appt.user.lastName}` : 'Paciente';
  const initials = patientName.split(' ').map((n: string) => n[0]).join('').slice(0, 2);
  const dateStr = new Date(appt.date).toLocaleDateString('es-VE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link to="/admin/citas" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Volver a la agenda
      </Link>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Detalle de Cita</h1>
        <StatusBadge status={appt.status as AppointmentStatus} />
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-card space-y-5">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center text-lg font-bold text-accent-foreground">
            {initials}
          </div>
          <div>
            <p className="font-semibold text-foreground text-lg">{patientName}</p>
            <p className="text-sm text-muted-foreground">{appt.user?.email}</p>
          </div>
        </div>

        <hr />

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-accent p-2"><Stethoscope className="h-4 w-4 text-primary" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Servicio</p>
              <p className="text-sm font-medium text-foreground">{appt.service?.name}</p>
              {appt.service?.price && <p className="text-xs text-primary font-medium">${Number(appt.service.price).toFixed(2)}</p>}
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-accent p-2"><Calendar className="h-4 w-4 text-primary" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Fecha</p>
              <p className="text-sm font-medium text-foreground capitalize">{dateStr}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-accent p-2"><Clock className="h-4 w-4 text-primary" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Hora</p>
              <p className="text-sm font-medium text-foreground">{appt.startTime} - {appt.endTime}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-accent p-2"><User className="h-4 w-4 text-primary" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Teléfono</p>
              <p className="text-sm font-medium text-foreground">{appt.user?.phone || '—'}</p>
            </div>
          </div>
        </div>

        <hr />

        <div>
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-primary" />
            <p className="text-sm font-medium text-foreground">Notas</p>
          </div>
          <p className="text-sm text-muted-foreground bg-secondary/50 rounded-lg px-3 py-2.5">
            {appt.notes || 'Sin notas'}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {(appt.status === 'pending' || appt.status === 'confirmed') && (
          <>
            {appt.status === 'pending' && (
              <button
                disabled={updating}
                onClick={() => handleStatusChange('confirmed')}
                className="gradient-dental px-5 py-2.5 rounded-lg text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
              >
                {updating ? 'Actualizando...' : 'Confirmar cita'}
              </button>
            )}
            <button
              disabled={updating}
              onClick={() => handleStatusChange('completed')}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-success/10 text-success hover:bg-success/20 transition-colors disabled:opacity-50"
            >
              Marcar completada
            </button>
            <button
              disabled={updating}
              onClick={() => handleStatusChange('cancelled')}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors disabled:opacity-50"
            >
              Cancelar cita
            </button>
          </>
        )}
      </div>
    </div>
  );
}
