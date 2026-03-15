import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/servicios" element={<ServicesPage />} />
            <Route path="/contacto" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registro" element={<RegisterPage />} />
          </Route>

          {/* Patient routes */}
          <Route path="/paciente" element={<PatientLayout />}>
            <Route index element={<PatientDashboard />} />
            <Route path="reservar" element={<BookAppointment />} />
            <Route path="citas" element={<MyAppointments />} />
            <Route path="perfil" element={<PatientProfile />} />
            <Route path="notificaciones" element={<Notifications />} />
          </Route>

          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout />}>
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
