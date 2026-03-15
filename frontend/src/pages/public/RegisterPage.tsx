import { Link } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import clinicLogo from "@/assets/clinic-logo.jpg";

export default function RegisterPage() {
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={clinicLogo} alt="" className="h-16 w-16 rounded-full object-cover mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground">Crear cuenta</h1>
          <p className="text-sm text-muted-foreground mt-1">Regístrate para reservar tus citas fácilmente</p>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-card">
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Nombre</label>
                <input type="text" className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="María" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Apellido</label>
                <input type="text" className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="García" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Teléfono</label>
              <input type="tel" className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="+58 412-000-0000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <input type="email" className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="tu@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Contraseña</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} className="w-full rounded-lg border bg-background px-3 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Mínimo 8 caracteres" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Confirmar contraseña</label>
              <input type="password" className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Repite tu contraseña" />
            </div>
            <Link to="/paciente" className="block w-full gradient-dental py-3 rounded-lg font-semibold text-white text-center hover:opacity-90 transition-opacity">
              Registrarse
            </Link>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            ¿Ya tienes cuenta? <Link to="/login" className="text-primary font-medium hover:underline">Inicia sesión</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
