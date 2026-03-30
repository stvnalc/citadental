import { Link } from "react-router-dom";
import { Clock, CalendarPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { publicAPI } from "@/lib/api";
import { services as fallbackServices } from "@/data/mockData";

export default function ServicesPage() {
  const [services, setServices] = useState(fallbackServices);
  const [loading, setLoading] = useState(true);

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
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="container py-12 lg:py-20">
      <div className="text-center mb-12">
        <h1 className="text-3xl lg:text-4xl font-bold text-foreground">Nuestros Servicios</h1>
        <p className="mt-2 text-muted-foreground max-w-lg mx-auto">Ofrecemos una amplia gama de servicios odontológicos con los más altos estándares de calidad.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.filter(s => s.active).map((s) => (
            <div key={s.id} className="rounded-xl border bg-card p-6 shadow-card hover:shadow-card-hover transition-shadow flex flex-col">
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs bg-accent text-accent-foreground px-2.5 py-0.5 rounded-full font-medium">{s.category}</span>
                {s.price > 0 && <span className="text-lg font-bold text-primary">${s.price}</span>}
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{s.name}</h3>
              <p className="text-sm text-muted-foreground flex-1 mb-4">{s.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {s.duration} min</span>
                <Link to="/registro" className="gradient-dental text-xs font-medium px-4 py-2 rounded-lg text-white hover:opacity-90 flex items-center gap-1.5">
                  <CalendarPlus className="h-3.5 w-3.5" /> Reservar
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
