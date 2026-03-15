import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, User, Stethoscope, FileText } from "lucide-react";
import { appointments } from "@/data/mockData";
import { StatusBadge } from "@/components/StatusBadge";

export default function AppointmentDetail() {
  const { id } = useParams();
  const appt = appointments.find((a) => a.id === id);

  if (!appt) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Cita no encontrada.</p>
        <Link to="/admin/citas" className="text-primary font-medium hover:underline mt-2 inline-block">Volver a citas</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link to="/admin/citas" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Volver a la agenda
      </Link>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Detalle de Cita</h1>
        <StatusBadge status={appt.status} />
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-card space-y-5">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center text-lg font-bold text-accent-foreground">
            {appt.patientName.split(" ").map((n) => n[0]).join("")}
          </div>
          <div>
            <p className="font-semibold text-foreground text-lg">{appt.patientName}</p>
            <p className="text-sm text-muted-foreground">ID: {appt.patientId}</p>
          </div>
        </div>

        <hr />

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-accent p-2"><Stethoscope className="h-4 w-4 text-primary" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Servicio</p>
              <p className="text-sm font-medium text-foreground">{appt.serviceName}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-accent p-2"><Calendar className="h-4 w-4 text-primary" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Fecha</p>
              <p className="text-sm font-medium text-foreground">{appt.date}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-accent p-2"><Clock className="h-4 w-4 text-primary" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Hora</p>
              <p className="text-sm font-medium text-foreground">{appt.time}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-accent p-2"><User className="h-4 w-4 text-primary" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Paciente ID</p>
              <p className="text-sm font-medium text-foreground">{appt.patientId}</p>
            </div>
          </div>
        </div>

        <hr />

        <div>
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-primary" />
            <p className="text-sm font-medium text-foreground">Notas</p>
          </div>
          <textarea
            defaultValue={appt.notes || ""}
            placeholder="Agregar notas sobre la cita..."
            className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            rows={3}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {(appt.status === "pending" || appt.status === "confirmed") && (
          <>
            {appt.status === "pending" && (
              <button className="gradient-dental px-5 py-2.5 rounded-lg text-sm font-semibold text-white hover:opacity-90">
                Confirmar cita
              </button>
            )}
            <button className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-success/10 text-success hover:bg-success/20 transition-colors">
              Marcar completada
            </button>
            <button className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors">
              Cancelar cita
            </button>
          </>
        )}
      </div>
    </div>
  );
}
