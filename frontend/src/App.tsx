import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Layouts
import PublicLayout from "@/layouts/PublicLayout";
import PatientLayout from "@/layouts/PatientLayout";
import AdminLayout from "@/layouts/AdminLayout";

// Public pages
import HomePage from "@/pages/public/HomePage";
import ServicesPage from "@/pages/public/ServicesPage";
import ContactPage from "@/pages/public/ContactPage";
import LoginPage from "@/pages/public/LoginPage";
import RegisterPage from "@/pages/public/RegisterPage";

// Patient pages
import PatientDashboard from "@/pages/patient/PatientDashboard";
import BookAppointment from "@/pages/patient/BookAppointment";
import MyAppointments from "@/pages/patient/MyAppointments";
import PatientProfile from "@/pages/patient/PatientProfile";
import Notifications from "@/pages/patient/Notifications";

// Admin pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminAppointments from "@/pages/admin/AdminAppointments";
import AppointmentDetail from "@/pages/admin/AppointmentDetail";
import CreateAppointment from "@/pages/admin/CreateAppointment";
import AdminServices from "@/pages/admin/AdminServices";
import AdminSchedule from "@/pages/admin/AdminSchedule";
import AdminPatients from "@/pages/admin/AdminPatients";
import AdminSettings from "@/pages/admin/AdminSettings";

import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/servicios" element={<ServicesPage />} />
        <Route path="/contacto" element={<ContactPage />} />
        <Route path="/login" element={user ? <Navigate to={user.role === 'patient' ? '/paciente' : '/admin'} replace /> : <LoginPage />} />
        <Route path="/registro" element={user ? <Navigate to={user.role === 'patient' ? '/paciente' : '/admin'} replace /> : <RegisterPage />} />
      </Route>

      {/* Patient routes */}
      <Route path="/paciente" element={<ProtectedRoute allowedRoles={['patient']}><PatientLayout /></ProtectedRoute>}>
        <Route index element={<PatientDashboard />} />
        <Route path="reservar" element={<BookAppointment />} />
        <Route path="citas" element={<MyAppointments />} />
        <Route path="perfil" element={<PatientProfile />} />
        <Route path="notificaciones" element={<Notifications />} />
      </Route>

      {/* Admin routes */}
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin', 'staff']}><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="citas" element={<AdminAppointments />} />
        <Route path="citas/nueva" element={<CreateAppointment />} />
        <Route path="citas/:id" element={<AppointmentDetail />} />
        <Route path="servicios" element={<AdminServices />} />
        <Route path="horarios" element={<AdminSchedule />} />
        <Route path="pacientes" element={<AdminPatients />} />
        <Route path="configuracion" element={<AdminSettings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
