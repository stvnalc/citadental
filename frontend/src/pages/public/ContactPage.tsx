import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { clinicInfo, weeklySchedule } from "@/data/mockData";

export default function ContactPage() {
  return (
    <div className="container py-12 lg:py-20">
      <div className="text-center mb-12">
        <h1 className="text-3xl lg:text-4xl font-bold text-foreground">Contacto</h1>
        <p className="mt-2 text-muted-foreground">Estamos para atenderte. Contáctanos o visítanos en nuestra sede.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="rounded-xl border bg-card p-6 shadow-card">
            <h2 className="font-semibold text-foreground text-lg mb-4">Información de la Clínica</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-accent p-2"><MapPin className="h-4 w-4 text-primary" /></div>
                <div>
                  <p className="text-sm font-medium text-foreground">Dirección</p>
                  <p className="text-sm text-muted-foreground">{clinicInfo.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-accent p-2"><Phone className="h-4 w-4 text-primary" /></div>
                <div>
                  <p className="text-sm font-medium text-foreground">Teléfono</p>
                  <p className="text-sm text-muted-foreground">{clinicInfo.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-accent p-2"><Mail className="h-4 w-4 text-primary" /></div>
                <div>
                  <p className="text-sm font-medium text-foreground">Email</p>
                  <p className="text-sm text-muted-foreground">{clinicInfo.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-accent p-2"><MessageCircle className="h-4 w-4 text-primary" /></div>
                <div>
                  <p className="text-sm font-medium text-foreground">WhatsApp</p>
                  <a href={clinicInfo.whatsapp} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">{clinicInfo.phone}</a>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-6 shadow-card">
            <h2 className="font-semibold text-foreground text-lg mb-4 flex items-center gap-2"><Clock className="h-5 w-5 text-primary" /> Horario de Atención</h2>
            <div className="space-y-2">
              {weeklySchedule.map((d) => (
                <div key={d.day} className="flex items-center justify-between text-sm py-1.5 border-b border-border last:border-0">
                  <span className="font-medium text-foreground">{d.day}</span>
                  <span className={d.active ? "text-muted-foreground" : "text-destructive font-medium"}>
                    {d.active ? `${d.open} - ${d.close}` : "Cerrado"}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm font-medium text-primary">{clinicInfo.emergencies}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border bg-card p-6 shadow-card">
            <h2 className="font-semibold text-foreground text-lg mb-4">Envíanos un mensaje</h2>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Nombre</label>
                  <input type="text" className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Tu nombre" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Teléfono</label>
                  <input type="tel" className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="+58 412..." />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                <input type="email" className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="tu@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Mensaje</label>
                <textarea rows={4} className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" placeholder="¿En qué podemos ayudarte?" />
              </div>
              <button type="submit" className="w-full gradient-dental py-3 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity">
                Enviar mensaje
              </button>
            </form>
          </div>

          {/* Map placeholder */}
          <div className="rounded-xl border bg-card overflow-hidden shadow-card">
            <div className="bg-accent/50 h-56 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-10 w-10 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">Valencia, Carabobo</p>
                <p className="text-xs text-muted-foreground mt-1">Av. 137 de Prebo, Edif. 137</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
