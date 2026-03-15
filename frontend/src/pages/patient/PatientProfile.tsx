import { useState } from "react";
import { patients } from "@/data/mockData";

export default function PatientProfile() {
  const patient = patients[0]; // Mock: María García
  const [editing, setEditing] = useState(false);

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-6">Mi Perfil</h1>

      <div className="rounded-xl border bg-card shadow-card">
        <div className="p-6 border-b flex items-center gap-4">
          <div className="h-14 w-14 rounded-full gradient-dental flex items-center justify-center text-xl font-bold text-white">
            {patient.firstName[0]}{patient.lastName[0]}
          </div>
          <div>
            <h2 className="font-semibold text-foreground text-lg">{patient.firstName} {patient.lastName}</h2>
            <p className="text-sm text-muted-foreground">Paciente desde {new Date(patient.registeredAt).toLocaleDateString("es-ES", { month: "long", year: "numeric" })}</p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Nombre</label>
            <input disabled={!editing} defaultValue={patient.firstName} className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Apellido</label>
            <input disabled={!editing} defaultValue={patient.lastName} className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Email</label>
            <input disabled={!editing} defaultValue={patient.email} className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Teléfono</label>
            <input disabled={!editing} defaultValue={patient.phone} className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Fecha de nacimiento</label>
            <input disabled={!editing} type="date" defaultValue={patient.birthDate} className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
        </div>

        <div className="p-6 border-t flex gap-3">
          {editing ? (
            <>
              <button onClick={() => setEditing(false)} className="flex-1 py-2.5 rounded-lg border font-medium text-foreground hover:bg-secondary text-sm">Cancelar</button>
              <button onClick={() => setEditing(false)} className="flex-1 gradient-dental py-2.5 rounded-lg font-medium text-white text-sm hover:opacity-90">Guardar</button>
            </>
          ) : (
            <button onClick={() => setEditing(true)} className="w-full gradient-dental py-2.5 rounded-lg font-medium text-white text-sm hover:opacity-90">Editar perfil</button>
          )}
        </div>
      </div>
    </div>
  );
}
