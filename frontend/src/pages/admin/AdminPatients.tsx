import { useState } from "react";
import { Search, Mail, Phone } from "lucide-react";
import { patients } from "@/data/mockData";

export default function AdminPatients() {
  const [search, setSearch] = useState("");
  const filtered = patients.filter((p) =>
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Pacientes</h1>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-secondary/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-xs font-bold text-accent-foreground">{p.firstName[0]}{p.lastName[0]}</div>
                    <span className="text-sm font-medium text-foreground">{p.firstName} {p.lastName}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{p.email}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{p.phone}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{p.registeredAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="p-8 text-center text-muted-foreground text-sm">No se encontraron pacientes.</p>}
      </div>

      {/* Mobile */}
      <div className="md:hidden space-y-3">
        {filtered.map((p) => (
          <div key={p.id} className="rounded-xl border bg-card p-4 shadow-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center text-sm font-bold text-accent-foreground">{p.firstName[0]}{p.lastName[0]}</div>
              <div>
                <p className="font-semibold text-foreground text-sm">{p.firstName} {p.lastName}</p>
                <p className="text-xs text-muted-foreground">Desde {p.registeredAt}</p>
              </div>
            </div>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" /> {p.email}</p>
              <p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" /> {p.phone}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
