import { Link } from "react-router-dom";
import { CalendarPlus, Shield, Clock, Star, Phone, Sparkles, Heart, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { publicAPI } from "@/lib/api";
import { clinicInfo as fallbackClinic, services as fallbackServices } from "@/data/mockData";
import clinicLogo from "@/assets/clinic-logo.jpg";

export default function HomePage() {
  const [services, setServices] = useState(fallbackServices);
  const [clinicInfo] = useState(fallbackClinic);

  useEffect(() => {
    publicAPI.getServices().then(res => {
      const list = res.data?.services || res.data || [];
      if (list.length) {
        setServices(list.map((s: any) => ({
          id: s.id,
          name: s.name,
          description: s.description,
          duration: s.duration || s.durationMinutes,
          price: parseFloat(s.price),
          active: s.isActive !== undefined ? s.isActive : s.active,
          category: s.category || 'General',
        })));
      }
    }).catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden gradient-dental-dark text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-primary blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-primary blur-3xl" />
        </div>
        <div className="container relative py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm backdrop-blur-sm">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>PALACIOS IUCCI DENTAL GROUP</span>
              </div>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-tight">
                Tu sonrisa es nuestra
                <span className="block text-primary"> pasión</span>
              </h1>
              <p className="text-lg text-white/70 max-w-md">
                Agenda tu cita odontológica de forma fácil y rápida. Atención profesional con tecnología de vanguardia.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/registro" className="gradient-dental px-6 py-3 rounded-lg font-semibold text-white transition-opacity hover:opacity-90 flex items-center gap-2">
                  <CalendarPlus className="h-5 w-5" />
                  Reservar Cita
                </Link>
                <Link to="/servicios" className="px-6 py-3 rounded-lg font-semibold border border-white/20 text-white hover:bg-white/10 transition-colors">
                  Ver Servicios
                </Link>
              </div>
              <div className="flex items-center gap-6 pt-4 text-sm text-white/60">
                <div className="flex items-center gap-1.5"><Shield className="h-4 w-4" /> Profesionales certificados</div>
                <div className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> Emergencias 24h</div>
              </div>
            </div>
            <div className="hidden lg:flex justify-center">
              <div className="relative">
                <div className="w-72 h-72 rounded-full gradient-dental opacity-20 blur-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                <img src={clinicLogo} alt="Palacios Iucci Dental Group" className="relative w-64 h-64 rounded-3xl object-cover shadow-2xl border-4 border-white/10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">¿Por qué elegirnos?</h2>
            <p className="mt-2 text-muted-foreground max-w-lg mx-auto">Ofrecemos la mejor atención odontológica con un equipo comprometido con tu bienestar.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Heart, title: "Atención Humana", desc: "Nos enfocamos en tu comodidad y confianza en cada consulta." },
              { icon: Shield, title: "Profesionales Certificados", desc: "Odontólogos con amplia experiencia y formación actualizada." },
              { icon: Clock, title: "Emergencias 24h", desc: "Atención de urgencias las 24 horas para tu tranquilidad." },
              { icon: Users, title: "Toda la Familia", desc: "Odontopediatría y tratamientos para todas las edades." },
            ].map((b, i) => (
              <div key={i} className="rounded-xl border bg-card p-6 shadow-card hover:shadow-card-hover transition-shadow text-center">
                <div className="mx-auto w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4">
                  <b.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{b.title}</h3>
                <p className="text-sm text-muted-foreground">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services preview */}
      <section className="py-16 lg:py-24 bg-secondary/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">Nuestros Servicios</h2>
            <p className="mt-2 text-muted-foreground">Soluciones completas para tu salud bucal.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.filter(s => s.active).slice(0, 6).map((s) => (
              <div key={s.id} className="rounded-xl border bg-card p-5 shadow-card hover:shadow-card-hover transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-foreground">{s.name}</h3>
                  <span className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full">{s.category}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{s.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {s.duration} min</span>
                  <span className="font-bold text-primary">${s.price}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/servicios" className="gradient-dental inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity">
              Ver todos los servicios
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">Lo que dicen nuestros pacientes</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Laura López", text: "Excelente atención, el equipo es muy profesional y amable. Mi sonrisa nunca se vio mejor.", stars: 5 },
              { name: "Carlos Rodríguez", text: "Me atendieron una emergencia a las 2am y fueron increíbles. Totalmente recomendados.", stars: 5 },
              { name: "Valentina Palacios", text: "El sistema de citas en línea es super práctico. No más llamadas ni esperas.", stars: 5 },
            ].map((t, i) => (
              <div key={i} className="rounded-xl border bg-card p-6 shadow-card">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-4">"{t.text}"</p>
                <p className="text-sm font-semibold text-foreground">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 gradient-dental-dark text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">¿Listo para tu próxima cita?</h2>
          <p className="text-white/70 max-w-md mx-auto mb-8">Reserva tu cita en minutos y recibe la atención odontológica que mereces.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/registro" className="gradient-dental px-8 py-3 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity">
              Crear cuenta y reservar
            </Link>
            <a href={clinicInfo.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold border border-white/20 text-white hover:bg-white/10 transition-colors">
              <Phone className="h-5 w-5" /> WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
