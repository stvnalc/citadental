import { useState } from "react";
import clinicLogo from "@/assets/clinic-logo.jpg";
import { clinicInfo } from "@/data/mockData";

export default function AdminSettings() {
  const [saved, setSaved] = useState(false);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Configuración de la Clínica</h1>

      <div className="rounded-xl border bg-card p-6 shadow-card">
        <div className="flex items-center gap-4 mb-6">
          <img src={clinicLogo} alt="Logo" className="h-16 w-16 rounded-xl object-cover border" />
          <div>
            <button className="text-sm text-primary font-medium hover:underline">Cambiar logo</button>
            <p className="text-xs text-muted-foreground mt-1">JPG, PNG. Máx 2MB</p>
          </div>
        </div>

        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setSaved(true); setTimeout(() => setSaved(false), 2000); }}>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Nombre de la clínica</label>
            <input defaultValue={clinicInfo.name} className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Teléfono</label>
              <input defaultValue={clinicInfo.phone} className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <input defaultValue={clinicInfo.email} className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Dirección</label>
            <input defaultValue={clinicInfo.address} className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Descripción</label>
            <textarea rows={3} defaultValue={clinicInfo.description} className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Horario L-V</label>
              <input defaultValue="09:00 - 19:00" className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Horario Sábados</label>
              <input defaultValue="09:00 - 13:00" className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" className="gradient-dental px-6 py-2.5 rounded-lg font-semibold text-white text-sm hover:opacity-90">
              Guardar cambios
            </button>
            {saved && <span className="text-sm text-success font-medium">✓ Guardado exitosamente</span>}
          </div>
        </form>
      </div>
    </div>
  );
}
