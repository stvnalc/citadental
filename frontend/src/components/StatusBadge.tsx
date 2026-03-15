import { cn } from "@/lib/utils";
import type { AppointmentStatus } from "@/data/mockData";

const statusConfig: Record<AppointmentStatus, { label: string; className: string }> = {
  confirmed: { label: "Confirmada", className: "bg-accent text-accent-foreground" },
  pending: { label: "Pendiente", className: "bg-warning/15 text-warning" },
  completed: { label: "Completada", className: "bg-success/15 text-success" },
  cancelled: { label: "Cancelada", className: "bg-destructive/15 text-destructive" },
};

export function StatusBadge({ status }: { status: AppointmentStatus }) {
  const config = statusConfig[status];
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", config.className)}>
      {config.label}
    </span>
  );
}
