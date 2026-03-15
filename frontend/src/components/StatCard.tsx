import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: string;
}

export function StatCard({ title, value, icon: Icon, description, trend }: StatCardProps) {
  return (
    <div className="rounded-lg border bg-card p-5 shadow-card transition-shadow hover:shadow-card-hover">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="rounded-lg bg-accent p-2">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </div>
      <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
      {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
      {trend && <p className="mt-1 text-xs font-medium text-success">{trend}</p>}
    </div>
  );
}
