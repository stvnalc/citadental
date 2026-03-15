import { useState } from "react";
import { Check, CalendarDays, Clock } from "lucide-react";
import { services, timeSlots } from "@/data/mockData";

const steps = ["Servicio", "Fecha y hora", "Confirmar"];

export default function BookAppointment() {
  const [step, setStep] = useState(0);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const service = services.find((s) => s.id === selectedService);

  // Generate next 14 days
  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return d.toISOString().split("T")[0];
  }).filter((d) => new Date(d).getDay() !== 0); // exclude sundays

  const availableSlots = timeSlots.filter((_, i) => i % 2 === 0 || Math.random() > 0.3); // simulate availability

  if (confirmed) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <div className="w-16 h-16 rounded-full bg-success/15 flex items-center justify-center mx-auto mb-4">
          <Check className="h-8 w-8 text-success" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">¡Cita reservada!</h2>
        <p className="text-muted-foreground mb-2">Tu cita ha sido registrada exitosamente.</p>
        <div className="rounded-xl border bg-card p-5 shadow-card mt-6 text-left space-y-2">
          <p className="text-sm"><span className="font-medium text-foreground">Servicio:</span> <span className="text-muted-foreground">{service?.name}</span></p>
          <p className="text-sm"><span className="font-medium text-foreground">Fecha:</span> <span className="text-muted-foreground">{selectedDate}</span></p>
          <p className="text-sm"><span className="font-medium text-foreground">Hora:</span> <span className="text-muted-foreground">{selectedTime}</span></p>
          <p className="text-sm"><span className="font-medium text-foreground">Estado:</span> <span className="text-warning font-medium">Pendiente de confirmación</span></p>
        </div>
        <button onClick={() => { setConfirmed(false); setStep(0); setSelectedService(null); setSelectedDate(""); setSelectedTime(null); }} className="mt-6 gradient-dental px-6 py-3 rounded-lg font-semibold text-white hover:opacity-90">
          Reservar otra cita
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-6">Reservar Cita</h1>

      {/* Stepper */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${
              i <= step ? "gradient-dental text-white" : "bg-secondary text-muted-foreground"
            }`}>{i + 1}</div>
            <span className={`text-sm font-medium hidden sm:block ${i <= step ? "text-foreground" : "text-muted-foreground"}`}>{s}</span>
            {i < steps.length - 1 && <div className={`flex-1 h-0.5 ${i < step ? "bg-primary" : "bg-border"}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Service */}
      {step === 0 && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground mb-4">Selecciona el servicio que necesitas:</p>
          {services.filter((s) => s.active).map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedService(s.id)}
              className={`w-full text-left rounded-xl border p-4 transition-all ${
                selectedService === s.id ? "border-primary bg-accent shadow-card" : "bg-card hover:shadow-card"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-foreground">{s.name}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{s.description}</p>
                  <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {s.duration} min</span>
                    <span className="font-medium text-primary">${s.price}</span>
                  </div>
                </div>
                {selectedService === s.id && (
                  <div className="h-5 w-5 rounded-full gradient-dental flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
            </button>
          ))}
          <button
            disabled={!selectedService}
            onClick={() => setStep(1)}
            className="w-full gradient-dental py-3 rounded-lg font-semibold text-white hover:opacity-90 disabled:opacity-50 mt-4"
          >
            Continuar
          </button>
        </div>
      )}

      {/* Step 2: Date & Time */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2"><CalendarDays className="h-4 w-4 text-primary" /> Selecciona una fecha</p>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {dates.map((d) => {
                const date = new Date(d + "T12:00:00");
                const dayName = date.toLocaleDateString("es-ES", { weekday: "short" });
                const dayNum = date.getDate();
                const month = date.toLocaleDateString("es-ES", { month: "short" });
                return (
                  <button
                    key={d}
                    onClick={() => setSelectedDate(d)}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      selectedDate === d ? "border-primary bg-accent" : "bg-card hover:border-primary/30"
                    }`}
                  >
                    <p className="text-[10px] uppercase text-muted-foreground">{dayName}</p>
                    <p className="text-lg font-bold text-foreground">{dayNum}</p>
                    <p className="text-[10px] text-muted-foreground">{month}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedDate && (
            <div>
              <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> Selecciona un horario</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {availableSlots.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTime(t)}
                    className={`py-2.5 px-3 rounded-lg border text-sm font-medium transition-all ${
                      selectedTime === t ? "border-primary bg-accent text-primary" : "bg-card text-foreground hover:border-primary/30"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={() => setStep(0)} className="flex-1 py-3 rounded-lg font-semibold border text-foreground hover:bg-secondary transition-colors">
              Atrás
            </button>
            <button
              disabled={!selectedDate || !selectedTime}
              onClick={() => setStep(2)}
              className="flex-1 gradient-dental py-3 rounded-lg font-semibold text-white hover:opacity-90 disabled:opacity-50"
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Confirm */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="rounded-xl border bg-card p-6 shadow-card space-y-4">
            <h3 className="font-semibold text-foreground text-lg">Resumen de tu cita</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Servicio</span>
                <span className="font-medium text-foreground">{service?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Duración</span>
                <span className="font-medium text-foreground">{service?.duration} min</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Fecha</span>
                <span className="font-medium text-foreground">{selectedDate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Hora</span>
                <span className="font-medium text-foreground">{selectedTime}</span>
              </div>
              <hr />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Precio referencial</span>
                <span className="font-bold text-primary text-lg">${service?.price}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-lg font-semibold border text-foreground hover:bg-secondary transition-colors">
              Atrás
            </button>
            <button onClick={() => setConfirmed(true)} className="flex-1 gradient-dental py-3 rounded-lg font-semibold text-white hover:opacity-90">
              Confirmar reserva
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
