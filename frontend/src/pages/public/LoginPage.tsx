import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import clinicLogo from "@/assets/clinic-logo.jpg";

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={clinicLogo} alt="" className="h-16 w-16 rounded-full object-cover mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground">Bienvenido a CitaDental</h1>
          <p className="text-sm text-muted-foreground mt-1">Inicia sesión para gestionar tus citas</p>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-card">
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email o teléfono</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="text" className="w-full rounded-lg border bg-background pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="tu@email.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type={showPass ? "text" : "password"} className="w-full rounded-lg border bg-background pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-muted-foreground">
                <input type="checkbox" className="rounded border-border" /> Recordarme
              </label>
              <a href="#" className="text-primary hover:underline font-medium">¿Olvidaste tu contraseña?</a>
            </div>
            <Link to="/paciente" className="block w-full gradient-dental py-3 rounded-lg font-semibold text-white text-center hover:opacity-90 transition-opacity">
              Iniciar sesión
            </Link>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            ¿No tienes cuenta? <Link to="/registro" className="text-primary font-medium hover:underline">Regístrate</Link>
          </div>

          {/* Demo links */}
          <div className="mt-6 pt-4 border-t">
            <p className="text-xs text-muted-foreground text-center mb-3">Demo — Acceso rápido:</p>
            <div className="grid grid-cols-2 gap-2">
              <Link to="/paciente" className="text-xs text-center py-2 rounded-lg border text-foreground hover:bg-secondary transition-colors font-medium">
                Panel Paciente
              </Link>
              <Link to="/admin" className="text-xs text-center py-2 rounded-lg border text-foreground hover:bg-secondary transition-colors font-medium">
                Panel Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
