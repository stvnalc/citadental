const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ─── Clinic Profile ───
  const clinic = await prisma.clinicProfile.upsert({
    where: { id: 'clinic-1' },
    update: {},
    create: {
      id: 'clinic-1',
      name: 'PALACIOS IUCCI DENTAL GROUP',
      phone: '+58 412-441-38-79',
      address: 'Av. 137 de Prebo, Edif. 137, Mezzanina Ofic #3, Valencia, Carabobo',
      email: 'info@pidentalgroup.com',
      description: 'Tú sonrisa es nuestra pasión. Clínica odontológica moderna con atención integral y de calidad.',
    },
  });
  console.log('✅ Clinic profile created');

  // ─── Clinic Hours ───
  const hoursData = [
    { dayOfWeek: 0, openTime: '00:00', closeTime: '00:00', isOpen: false }, // Sunday
    { dayOfWeek: 1, openTime: '09:00', closeTime: '19:00', isOpen: true },  // Monday
    { dayOfWeek: 2, openTime: '09:00', closeTime: '19:00', isOpen: true },  // Tuesday
    { dayOfWeek: 3, openTime: '09:00', closeTime: '19:00', isOpen: true },  // Wednesday
    { dayOfWeek: 4, openTime: '09:00', closeTime: '19:00', isOpen: true },  // Thursday
    { dayOfWeek: 5, openTime: '09:00', closeTime: '19:00', isOpen: true },  // Friday
    { dayOfWeek: 6, openTime: '09:00', closeTime: '13:00', isOpen: true },  // Saturday
  ];

  for (const h of hoursData) {
    await prisma.clinicHours.upsert({
      where: { dayOfWeek: h.dayOfWeek },
      update: { openTime: h.openTime, closeTime: h.closeTime, isOpen: h.isOpen },
      create: h,
    });
  }
  console.log('✅ Clinic hours created');

  // ─── Admin User ───
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@pidentalgroup.com' },
    update: {},
    create: {
      email: 'admin@pidentalgroup.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'Palacios Iucci',
      phone: '+58 412-441-38-79',
      role: 'admin',
    },
  });
  console.log('✅ Admin user created (admin@pidentalgroup.com / admin123)');

  // ─── Services ───
  const servicesData = [
    { name: 'Limpieza Dental', description: 'Limpieza profesional con ultrasonido para eliminar sarro y placa bacteriana.', duration: 45, price: 35 },
    { name: 'Evaluación Odontológica', description: 'Evaluación completa del estado bucal con diagnóstico y plan de tratamiento.', duration: 30, price: 25 },
    { name: 'Blanqueamiento Dental', description: 'Blanqueamiento profesional con luz LED para aclarar el tono de tus dientes.', duration: 60, price: 120 },
    { name: 'Ortodoncia - Consulta Inicial', description: 'Evaluación inicial para tratamiento de ortodoncia con brackets o alineadores.', duration: 45, price: 40 },
    { name: 'Extracción Simple', description: 'Extracción dental no quirúrgica con anestesia local.', duration: 30, price: 45 },
    { name: 'Restauración con Resina', description: 'Relleno estético con resina compuesta para caries o fracturas menores.', duration: 40, price: 50 },
    { name: 'Endodoncia (Tratamiento de Conducto)', description: 'Tratamiento del nervio dental para salvar piezas afectadas.', duration: 90, price: 150 },
    { name: 'Revisión General', description: 'Control periódico para mantener la salud bucal en óptimas condiciones.', duration: 20, price: 20 },
    { name: 'Prótesis Dental', description: 'Diseño y colocación de prótesis fijas o removibles personalizadas.', duration: 60, price: 200 },
    { name: 'Odontopediatría', description: 'Atención odontológica especializada para niños en un ambiente amigable.', duration: 30, price: 30 },
  ];

  const serviceIds = [];
  for (const s of servicesData) {
    const existing = await prisma.service.findFirst({ where: { name: s.name } });
    if (!existing) {
      const created = await prisma.service.create({ data: s });
      serviceIds.push(created.id);
    } else {
      serviceIds.push(existing.id);
    }
  }
  console.log(`✅ ${servicesData.length} services created`);

  // ─── Sample Patients ───
  const patientPassword = await bcrypt.hash('paciente123', 12);
  const patientsData = [
    { email: 'maria.garcia@email.com', firstName: 'María', lastName: 'García', phone: '+58 414-555-0101' },
    { email: 'carlos.rodriguez@email.com', firstName: 'Carlos', lastName: 'Rodríguez', phone: '+58 412-555-0202' },
    { email: 'ana.martinez@email.com', firstName: 'Ana', lastName: 'Martínez', phone: '+58 416-555-0303' },
    { email: 'jose.hernandez@email.com', firstName: 'José', lastName: 'Hernández', phone: '+58 424-555-0404' },
    { email: 'laura.lopez@email.com', firstName: 'Laura', lastName: 'López', phone: '+58 412-555-0505' },
    { email: 'valentina.p@email.com', firstName: 'Valentina', lastName: 'Palacios', phone: '+58 414-555-0606' },
    { email: 'diego.f@email.com', firstName: 'Diego', lastName: 'Fernández', phone: '+58 416-555-0707' },
  ];

  const patientIds = [];
  for (const p of patientsData) {
    const user = await prisma.user.upsert({
      where: { email: p.email },
      update: {},
      create: { ...p, password: patientPassword, role: 'patient' },
    });
    patientIds.push(user.id);
  }
  console.log(`✅ ${patientsData.length} sample patients created (password: paciente123)`);

  // ─── Sample Appointments ───
  const appointmentsData = [
    { patientIdx: 0, serviceIdx: 0, date: '2026-03-16', startTime: '09:00', endTime: '09:45', status: 'confirmed' },
    { patientIdx: 1, serviceIdx: 2, date: '2026-03-16', startTime: '10:00', endTime: '11:00', status: 'pending' },
    { patientIdx: 2, serviceIdx: 1, date: '2026-03-16', startTime: '11:00', endTime: '11:30', status: 'confirmed' },
    { patientIdx: 3, serviceIdx: 6, date: '2026-03-16', startTime: '14:00', endTime: '15:30', status: 'confirmed' },
    { patientIdx: 4, serviceIdx: 5, date: '2026-03-17', startTime: '09:30', endTime: '10:10', status: 'pending' },
    { patientIdx: 0, serviceIdx: 7, date: '2026-03-10', startTime: '10:00', endTime: '10:20', status: 'completed' },
    { patientIdx: 1, serviceIdx: 4, date: '2026-03-08', startTime: '15:00', endTime: '15:30', status: 'completed' },
    { patientIdx: 5, serviceIdx: 3, date: '2026-03-17', startTime: '11:00', endTime: '11:45', status: 'confirmed' },
    { patientIdx: 2, serviceIdx: 0, date: '2026-03-05', startTime: '09:00', endTime: '09:45', status: 'cancelled' },
    { patientIdx: 6, serviceIdx: 9, date: '2026-03-18', startTime: '10:00', endTime: '10:30', status: 'pending' },
  ];

  let apptCount = 0;
  for (const a of appointmentsData) {
    const exists = await prisma.appointment.findFirst({
      where: {
        userId: patientIds[a.patientIdx],
        date: new Date(a.date + 'T00:00:00Z'),
        startTime: a.startTime,
      },
    });
    if (!exists) {
      await prisma.appointment.create({
        data: {
          userId: patientIds[a.patientIdx],
          serviceId: serviceIds[a.serviceIdx],
          date: new Date(a.date + 'T00:00:00Z'),
          startTime: a.startTime,
          endTime: a.endTime,
          status: a.status,
        },
      });
      apptCount++;
    }
  }
  console.log(`✅ ${apptCount} sample appointments created`);

  // ─── Sample Notifications ───
  const notifData = [
    { userId: patientIds[0], title: 'Cita confirmada', message: 'Tu cita de Limpieza Dental para el 16 de marzo ha sido confirmada.', isRead: false },
    { userId: patientIds[0], title: 'Recordatorio de cita', message: 'Recuerda tu cita mañana a las 09:00 AM - Limpieza Dental.', isRead: false },
    { userId: patientIds[0], title: 'Bienvenido a CitaDental', message: 'Tu cuenta ha sido creada exitosamente. ¡Agenda tu primera cita!', isRead: true },
  ];

  for (const n of notifData) {
    await prisma.notification.create({ data: n });
  }
  console.log('✅ Sample notifications created');

  console.log('\n🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
