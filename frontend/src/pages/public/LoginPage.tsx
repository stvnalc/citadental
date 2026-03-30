import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import clinicLogo from "@/assets/clinic-logo.jpg";

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Por favor completa todos los campos");
      return;
    }
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`¡Bienvenido, ${user.firstName}!`);
      navigate(user.role === 'patient' ? '/paciente' : '/admin');
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Error al iniciar sesión. Verifica tus credenciales.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (type: 'patient' | 'admin') => {
    if (type === 'admin') {
      setEmail('admin@pidentalgroup.com');
      setPassword('admin123');
    } else {
      setEmail('maria.garcia@email.com');
      setPassword('paciente123');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={clinicLogo} alt="" className="h-16 w-16 rounded-full object-cover mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground">Bienvenido a CitaDental</h1>
          <p className="text-sm text-muted-foreground mt-1">Inicia sesión para gestionar tus citas</p>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-card">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border bg-background pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="tu@email.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border bg-background pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="block w-full gradient-dental py-3 rounded-lg font-semibold text-white text-center hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            ¿No tienes cuenta? <Link to="/registro" className="text-primary font-medium hover:underline">Regístrate</Link>
          </div>

          {/* Demo links */}
          <div className="mt-6 pt-4 border-t">
            <p className="text-xs text-muted-foreground text-center mb-3">Demo — Acceso rápido:</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => fillDemo('patient')}
                className="text-xs text-center py-2 rounded-lg border text-foreground hover:bg-secondary transition-colors font-medium"
              >
                Paciente Demo
              </button>
              <button
                onClick={() => fillDemo('admin')}
                className="text-xs text-center py-2 rounded-lg border text-foreground hover:bg-secondary transition-colors font-medium"
              >
                Admin Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
