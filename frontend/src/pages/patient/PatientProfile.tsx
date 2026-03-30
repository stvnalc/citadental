import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { patientAPI } from "@/lib/api";

export default function PatientProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    patientAPI.getProfile()
      .then(res => setProfile(res.data?.user || res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;
  }

  const p = profile || user;

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-6">Mi Perfil</h1>

      <div className="rounded-xl border bg-card shadow-card">
        <div className="p-6 border-b flex items-center gap-4">
          <div className="h-14 w-14 rounded-full gradient-dental flex items-center justify-center text-xl font-bold text-white">
            {p?.firstName?.[0]}{p?.lastName?.[0]}
          </div>
          <div>
            <h2 className="font-semibold text-foreground text-lg">{p?.firstName} {p?.lastName}</h2>
            <p className="text-sm text-muted-foreground">
              Paciente desde {p?.createdAt ? new Date(p.createdAt).toLocaleDateString("es-ES", { month: "long", year: "numeric" }) : '—'}
            </p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Nombre</label>
            <input disabled defaultValue={p?.firstName || ''} className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm disabled:opacity-60 focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Apellido</label>
            <input disabled defaultValue={p?.lastName || ''} className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm disabled:opacity-60 focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Email</label>
            <input disabled defaultValue={p?.email || ''} className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm disabled:opacity-60 focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Teléfono</label>
            <input disabled defaultValue={p?.phone || ''} className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm disabled:opacity-60 focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Rol</label>
            <input disabled defaultValue={p?.role === 'patient' ? 'Paciente' : p?.role || ''} className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm disabled:opacity-60 focus:outline-none capitalize" />
          </div>
        </div>

        {profile?.stats && (
          <div className="p-6 border-t">
            <h3 className="text-sm font-semibold text-foreground mb-3">Estadísticas</h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg bg-accent p-3">
                <p className="text-xl font-bold text-foreground">{profile.stats.total || 0}</p>
                <p className="text-[10px] text-muted-foreground">Total citas</p>
              </div>
              <div className="rounded-lg bg-accent p-3">
                <p className="text-xl font-bold text-foreground">{profile.stats.upcoming || 0}</p>
                <p className="text-[10px] text-muted-foreground">Próximas</p>
              </div>
              <div className="rounded-lg bg-accent p-3">
                <p className="text-xl font-bold text-foreground">{profile.stats.completed || 0}</p>
                <p className="text-[10px] text-muted-foreground">Completadas</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
