import { Link, Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import clinicLogo from "@/assets/clinic-logo.jpg";

const navLinks = [
  { to: "/", label: "Inicio" },
  { to: "/servicios", label: "Servicios" },
  { to: "/contacto", label: "Contacto" },
];

export default function PublicLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const dashboardLink = user?.role === 'patient' ? '/paciente' : '/admin';
  const dashboardLabel = user?.role === 'patient' ? 'Mi Panel' : 'Panel Admin';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={clinicLogo} alt="Palacios Iucci Dental Group" className="h-9 w-9 rounded-full object-cover" />
            <span className="text-lg font-bold text-foreground">CitaDental</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === l.to
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {l.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link to={dashboardLink} className="ml-2 px-4 py-2 rounded-lg text-sm font-medium text-primary hover:bg-accent transition-colors">
                  {dashboardLabel}
                </Link>
                <button onClick={logout} className="ml-1 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors">
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="ml-2 px-4 py-2 rounded-lg text-sm font-medium text-primary hover:bg-accent transition-colors">
                  Iniciar sesión
                </Link>
                <Link to="/registro" className="ml-1 gradient-dental px-4 py-2 rounded-lg text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
                  Registrarse
                </Link>
              </>
            )}
          </nav>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg hover:bg-secondary">
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t bg-card p-4 space-y-2">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium ${
                  location.pathname === l.to ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <hr className="border-border" />
            {user ? (
              <>
                <Link to={dashboardLink} onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 rounded-lg text-sm font-medium text-primary">
                  {dashboardLabel}
                </Link>
                <button onClick={() => { logout(); setMenuOpen(false); }} className="block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary">
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 rounded-lg text-sm font-medium text-primary">
                  Iniciar sesión
                </Link>
                <Link to="/registro" onClick={() => setMenuOpen(false)} className="block gradient-dental px-4 py-2.5 rounded-lg text-sm font-medium text-primary-foreground text-center">
                  Registrarse
                </Link>
              </>
            )}
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t bg-card">
        <div className="container py-10">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <img src={clinicLogo} alt="" className="h-8 w-8 rounded-full object-cover" />
                <span className="font-bold text-foreground">CitaDental</span>
              </div>
              <p className="text-sm text-muted-foreground">PALACIOS IUCCI DENTAL GROUP</p>
              <p className="mt-1 text-sm text-muted-foreground">Tú sonrisa es nuestra pasión ✨</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">Navegación</h4>
              <div className="space-y-2">
                {navLinks.map((l) => (
                  <Link key={l.to} to={l.to} className="block text-sm text-muted-foreground hover:text-primary transition-colors">{l.label}</Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">Contacto</h4>
              <p className="text-sm text-muted-foreground">Av. 137 de Prebo, Edif. 137</p>
              <p className="text-sm text-muted-foreground">Mezzanina Ofic #3, Valencia</p>
              <p className="text-sm text-muted-foreground mt-2">+58 412-441-38-79</p>
              <p className="text-sm text-muted-foreground">info@pidentalgroup.com</p>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t text-center text-xs text-muted-foreground">
            © 2026 CitaDental — PALACIOS IUCCI DENTAL GROUP. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
