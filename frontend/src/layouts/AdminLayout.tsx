import { Link, Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import { LayoutDashboard, CalendarDays, Stethoscope, Clock, Users, Settings, LogOut, Menu, X } from "lucide-react";
import clinicLogo from "@/assets/clinic-logo.jpg";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/citas", label: "Citas", icon: CalendarDays },
  { to: "/admin/servicios", label: "Servicios", icon: Stethoscope },
  { to: "/admin/horarios", label: "Horarios", icon: Clock },
  { to: "/admin/pacientes", label: "Pacientes", icon: Users },
  { to: "/admin/configuracion", label: "Configuración", icon: Settings },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path || (path !== "/admin" && location.pathname.startsWith(path + "/"));

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="hidden lg:flex w-64 flex-col gradient-dental-dark text-sidebar-foreground">
        <div className="p-5 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-2">
            <img src={clinicLogo} alt="" className="h-8 w-8 rounded-full object-cover" />
            <div>
              <span className="font-bold text-white text-sm block">CitaDental</span>
              <span className="text-[10px] text-sidebar-foreground">Panel Administrativo</span>
            </div>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.to) ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-full bg-sidebar-primary flex items-center justify-center text-sm font-bold text-white">AD</div>
            <div>
              <p className="text-sm font-medium text-white">Admin</p>
              <p className="text-xs text-sidebar-foreground">Administrador</p>
            </div>
          </div>
          <Link to="/" className="flex items-center gap-2 text-sm text-sidebar-foreground hover:text-white transition-colors">
            <LogOut className="h-4 w-4" /> Cerrar sesión
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="lg:hidden sticky top-0 z-50 flex items-center justify-between h-14 px-4 border-b bg-card/90 backdrop-blur-md">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-secondary">
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-bold text-foreground">CitaDental Admin</span>
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground">AD</div>
        </header>

        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-foreground/40" onClick={() => setSidebarOpen(false)} />
            <div className="relative w-72 gradient-dental-dark text-sidebar-foreground flex flex-col animate-fade-in">
              <div className="flex items-center justify-between p-5 border-b border-sidebar-border">
                <span className="font-bold text-white">CitaDental</span>
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
                      isActive(item.to) ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent"
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
