import { Link, Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import { Home, CalendarPlus, CalendarDays, Bell, User, LogOut, Menu, X } from "lucide-react";
import clinicLogo from "@/assets/clinic-logo.jpg";

const navItems = [
  { to: "/paciente", label: "Inicio", icon: Home },
  { to: "/paciente/reservar", label: "Reservar", icon: CalendarPlus },
  { to: "/paciente/citas", label: "Mis Citas", icon: CalendarDays },
  { to: "/paciente/notificaciones", label: "Notificaciones", icon: Bell },
  { to: "/paciente/perfil", label: "Perfil", icon: User },
];

export default function PatientLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex w-64 flex-col gradient-dental-dark text-sidebar-foreground">
        <div className="p-5 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-2">
            <img src={clinicLogo} alt="" className="h-8 w-8 rounded-full object-cover" />
            <span className="font-bold text-white">CitaDental</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === item.to
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-full bg-sidebar-primary flex items-center justify-center text-sm font-bold text-white">MG</div>
            <div>
              <p className="text-sm font-medium text-white">María García</p>
              <p className="text-xs text-sidebar-foreground">Paciente</p>
            </div>
          </div>
          <Link to="/" className="flex items-center gap-2 text-sm text-sidebar-foreground hover:text-white transition-colors">
            <LogOut className="h-4 w-4" /> Cerrar sesión
          </Link>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex-1 flex flex-col">
        <header className="lg:hidden sticky top-0 z-50 flex items-center justify-between h-14 px-4 border-b bg-card/90 backdrop-blur-md">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-secondary">
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-bold text-foreground">CitaDental</span>
          <Link to="/paciente/notificaciones" className="p-2 rounded-lg hover:bg-secondary relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
          </Link>
        </header>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-foreground/40" onClick={() => setSidebarOpen(false)} />
            <div className="relative w-72 gradient-dental-dark text-sidebar-foreground flex flex-col animate-fade-in">
              <div className="flex items-center justify-between p-5 border-b border-sidebar-border">
                <div className="flex items-center gap-2">
                  <img src={clinicLogo} alt="" className="h-8 w-8 rounded-full object-cover" />
                  <span className="font-bold text-white">CitaDental</span>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="text-sidebar-foreground hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === item.to ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="p-4 border-t border-sidebar-border">
                <Link to="/" className="flex items-center gap-2 text-sm text-sidebar-foreground hover:text-white">
                  <LogOut className="h-4 w-4" /> Cerrar sesión
                </Link>
              </div>
            </div>
          </div>
        )}

        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
