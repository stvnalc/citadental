export const clinicInfo = {
  name: "PALACIOS IUCCI DENTAL GROUP",
  shortName: "pidentalgroup",
  systemName: "CitaDental",
  address: "Av. 137 de Prebo, Edif. 137, Mezzanina Ofic #3, Valencia, Carabobo",
  phone: "+58 412-441-38-79",
  whatsapp: "https://wa.me/584124413879",
  email: "info@pidentalgroup.com",
  description: "Tú sonrisa es nuestra pasión. Clínica odontológica moderna con atención integral y de calidad.",
  schedule: {
    weekdays: { open: "09:00", close: "19:00" },
    saturday: { open: "09:00", close: "13:00" },
    sunday: null,
  },
  emergencies: "Emergencias 24 horas",
};

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // minutes
  price: number;
  active: boolean;
  category: string;
}

export const services: Service[] = [
  { id: "s1", name: "Limpieza Dental", description: "Limpieza profesional con ultrasonido para eliminar sarro y placa bacteriana.", duration: 45, price: 35, active: true, category: "Preventivo" },
  { id: "s2", name: "Evaluación Odontológica", description: "Evaluación completa del estado bucal con diagnóstico y plan de tratamiento.", duration: 30, price: 25, active: true, category: "Diagnóstico" },
  { id: "s3", name: "Blanqueamiento Dental", description: "Blanqueamiento profesional con luz LED para aclarar el tono de tus dientes.", duration: 60, price: 120, active: true, category: "Estética" },
  { id: "s4", name: "Ortodoncia - Consulta Inicial", description: "Evaluación inicial para tratamiento de ortodoncia con brackets o alineadores.", duration: 45, price: 40, active: true, category: "Ortodoncia" },
  { id: "s5", name: "Extracción Simple", description: "Extracción dental no quirúrgica con anestesia local.", duration: 30, price: 45, active: true, category: "Cirugía" },
  { id: "s6", name: "Restauración con Resina", description: "Relleno estético con resina compuesta para caries o fracturas menores.", duration: 40, price: 50, active: true, category: "Restaurativa" },
  { id: "s7", name: "Endodoncia (Tratamiento de Conducto)", description: "Tratamiento del nervio dental para salvar piezas afectadas.", duration: 90, price: 150, active: true, category: "Endodoncia" },
  { id: "s8", name: "Revisión General", description: "Control periódico para mantener la salud bucal en óptimas condiciones.", duration: 20, price: 20, active: true, category: "Preventivo" },
  { id: "s9", name: "Prótesis Dental", description: "Diseño y colocación de prótesis fijas o removibles personalizadas.", duration: 60, price: 200, active: true, category: "Prótesis" },
  { id: "s10", name: "Odontopediatría", description: "Atención odontológica especializada para niños en un ambiente amigable.", duration: 30, price: 30, active: true, category: "Pediatría" },
];

export type AppointmentStatus = "confirmed" | "pending" | "completed" | "cancelled";

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  notes?: string;
}

export const appointments: Appointment[] = [
  { id: "a1", patientId: "p1", patientName: "María García", serviceId: "s1", serviceName: "Limpieza Dental", date: "2026-03-16", time: "09:00", status: "confirmed" },
  { id: "a2", patientId: "p2", patientName: "Carlos Rodríguez", serviceId: "s3", serviceName: "Blanqueamiento Dental", date: "2026-03-16", time: "10:00", status: "pending" },
  { id: "a3", patientId: "p3", patientName: "Ana Martínez", serviceId: "s2", serviceName: "Evaluación Odontológica", date: "2026-03-16", time: "11:00", status: "confirmed" },
  { id: "a4", patientId: "p4", patientName: "José Hernández", serviceId: "s7", serviceName: "Endodoncia", date: "2026-03-16", time: "14:00", status: "confirmed" },
  { id: "a5", patientId: "p5", patientName: "Laura López", serviceId: "s6", serviceName: "Restauración con Resina", date: "2026-03-17", time: "09:30", status: "pending" },
  { id: "a6", patientId: "p1", patientName: "María García", serviceId: "s8", serviceName: "Revisión General", date: "2026-03-10", time: "10:00", status: "completed" },
  { id: "a7", patientId: "p2", patientName: "Carlos Rodríguez", serviceId: "s5", serviceName: "Extracción Simple", date: "2026-03-08", time: "15:00", status: "completed" },
  { id: "a8", patientId: "p6", patientName: "Valentina Palacios", serviceId: "s4", serviceName: "Ortodoncia - Consulta Inicial", date: "2026-03-17", time: "11:00", status: "confirmed" },
  { id: "a9", patientId: "p3", patientName: "Ana Martínez", serviceId: "s1", serviceName: "Limpieza Dental", date: "2026-03-05", time: "09:00", status: "cancelled" },
  { id: "a10", patientId: "p7", patientName: "Diego Fernández", serviceId: "s10", serviceName: "Odontopediatría", date: "2026-03-18", time: "10:00", status: "pending" },
];

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  registeredAt: string;
}

export const patients: Patient[] = [
  { id: "p1", firstName: "María", lastName: "García", email: "maria.garcia@email.com", phone: "+58 414-555-0101", birthDate: "1990-05-12", registeredAt: "2025-08-15" },
  { id: "p2", firstName: "Carlos", lastName: "Rodríguez", email: "carlos.rodriguez@email.com", phone: "+58 412-555-0202", birthDate: "1985-11-23", registeredAt: "2025-09-02" },
  { id: "p3", firstName: "Ana", lastName: "Martínez", email: "ana.martinez@email.com", phone: "+58 416-555-0303", birthDate: "1995-03-08", registeredAt: "2025-10-10" },
  { id: "p4", firstName: "José", lastName: "Hernández", email: "jose.hernandez@email.com", phone: "+58 424-555-0404", birthDate: "1978-07-30", registeredAt: "2025-11-01" },
  { id: "p5", firstName: "Laura", lastName: "López", email: "laura.lopez@email.com", phone: "+58 412-555-0505", birthDate: "2000-01-15", registeredAt: "2026-01-20" },
  { id: "p6", firstName: "Valentina", lastName: "Palacios", email: "valentina.p@email.com", phone: "+58 414-555-0606", birthDate: "1998-09-22", registeredAt: "2026-02-05" },
  { id: "p7", firstName: "Diego", lastName: "Fernández", email: "diego.f@email.com", phone: "+58 416-555-0707", birthDate: "2018-04-10", registeredAt: "2026-03-01" },
];

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: "appointment" | "reminder" | "info";
}

export const notifications: Notification[] = [
  { id: "n1", title: "Cita confirmada", message: "Tu cita de Limpieza Dental para el 16 de marzo ha sido confirmada.", date: "2026-03-15", read: false, type: "appointment" },
  { id: "n2", title: "Recordatorio de cita", message: "Recuerda tu cita mañana a las 09:00 AM - Limpieza Dental.", date: "2026-03-15", read: false, type: "reminder" },
  { id: "n3", title: "Bienvenido a CitaDental", message: "Tu cuenta ha sido creada exitosamente. ¡Agenda tu primera cita!", date: "2026-03-14", read: true, type: "info" },
  { id: "n4", title: "Cita completada", message: "Tu revisión general del 10 de marzo fue completada. ¡Gracias por visitarnos!", date: "2026-03-10", read: true, type: "appointment" },
];

export const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
];

export const weeklySchedule = [
  { day: "Lunes", open: "09:00", close: "19:00", active: true },
  { day: "Martes", open: "09:00", close: "19:00", active: true },
  { day: "Miércoles", open: "09:00", close: "19:00", active: true },
  { day: "Jueves", open: "09:00", close: "19:00", active: true },
  { day: "Viernes", open: "09:00", close: "19:00", active: true },
  { day: "Sábado", open: "09:00", close: "13:00", active: true },
  { day: "Domingo", open: "", close: "", active: false },
];

export const adminStats = {
  todayAppointments: 4,
  weekAppointments: 12,
  totalPatients: 7,
  completedToday: 1,
  pendingToday: 2,
  cancelledThisWeek: 1,
};
