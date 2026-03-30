import { useState, useEffect } from "react";
import { Search, Mail, Phone, Loader2 } from "lucide-react";
import { adminAPI } from "@/lib/api";
import { toast } from "sonner";

export default function AdminPatients() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchTimer, setSearchTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { loadPatients(); }, []);

  const loadPatients = async (query?: string) => {
    try {
      const params: Record<string, string> = {};
      if (query) params.search = query;
      const { data } = await adminAPI.getPatients(params);
      setPatients(data.patients || []);
    } catch {
      toast.error('Error al cargar pacientes');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    if (searchTimer) clearTimeout(searchTimer);
    setSearchTimer(setTimeout(() => loadPatients(value), 400));
  };

  if (loading) {
    return <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Pacientes</h1>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Buscar paciente..."
          className="w-full rounded-lg border bg-card pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Desktop */}
      <div className="hidden md:block rounded-xl border bg-card shadow-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-secondary/50">
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Paciente</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Email</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Teléfono</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Registrado</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {patients.map((p) => (
              <tr key={p.id} className="hover:bg-secondary/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-xs font-bold text-accent-foreground">{p.firstName?.[0]}{p.lastName?.[0]}</div>
                    <span className="text-sm font-medium text-foreground">{p.firstName} {p.lastName}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{p.email}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{p.phone || '—'}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{new Date(p.createdAt).toLocaleDateString('es-VE')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {patients.length === 0 && <p className="p-8 text-center text-muted-foreground text-sm">No se encontraron pacientes.</p>}
      </div>

      {/* Mobile */}
      <div className="md:hidden space-y-3">
        {patients.map((p) => (
          <div key={p.id} className="rounded-xl border bg-card p-4 shadow-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center text-sm font-bold text-accent-foreground">{p.firstName?.[0]}{p.lastName?.[0]}</div>
              <div>
                <p className="font-semibold text-foreground text-sm">{p.firstName} {p.lastName}</p>
                <p className="text-xs text-muted-foreground">Desde {new Date(p.createdAt).toLocaleDateString('es-VE')}</p>
              </div>
            </div>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" /> {p.email}</p>
              <p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" /> {p.phone || '—'}</p>
            </div>
          </div>
        ))}
        {patients.length === 0 && <p className="text-center text-muted-foreground py-8">No se encontraron pacientes.</p>}
      </div>
    </div>
  );
}
