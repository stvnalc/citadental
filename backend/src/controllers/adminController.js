const prisma = require('../config/db');
const { timeToMinutes, minutesToTime, getAvailableSlots } = require('../services/availabilityService');

// ─── Dashboard ───
exports.getDashboard = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const startOfWeek = new Date(today);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1); // Monday
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 7);

    const [
      todayAppointments,
      weekAppointments,
      totalPatients,
      completedToday,
      pendingToday,
      cancelledThisWeek,
      recentAppointments,
    ] = await Promise.all([
      prisma.appointment.count({ where: { date: { gte: today, lt: tomorrow } } }),
      prisma.appointment.count({ where: { date: { gte: startOfWeek, lt: endOfWeek } } }),
      prisma.user.count({ where: { role: 'patient' } }),
      prisma.appointment.count({ where: { date: { gte: today, lt: tomorrow }, status: 'completed' } }),
      prisma.appointment.count({ where: { date: { gte: today, lt: tomorrow }, status: 'pending' } }),
      prisma.appointment.count({ where: { date: { gte: startOfWeek, lt: endOfWeek }, status: 'cancelled' } }),
      prisma.appointment.findMany({
        where: { date: { gte: today } },
        include: {
          user: { select: { firstName: true, lastName: true, email: true, phone: true } },
          service: { select: { name: true, duration: true } },
        },
        orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
        take: 10,
      }),
    ]);

    res.json({
      stats: { todayAppointments, weekAppointments, totalPatients, completedToday, pendingToday, cancelledThisWeek },
      recentAppointments,
    });
  } catch (error) {
    console.error('[Admin] getDashboard error:', error);
    res.status(500).json({ error: 'Error al obtener dashboard' });
  }
};

// ─── Appointments ───
exports.getAppointments = async (req, res) => {
  try {
    const { status, date, page = 1, limit = 50 } = req.query;
    const where = {};
    if (status) where.status = status;
    if (date) {
      const d = new Date(date + 'T00:00:00Z');
      const next = new Date(d);
      next.setDate(next.getDate() + 1);
      where.date = { gte: d, lt: next };
    }

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        include: {
          user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
          service: { select: { name: true, duration: true, price: true } },
        },
        orderBy: [{ date: 'desc' }, { startTime: 'asc' }],
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      }),
      prisma.appointment.count({ where }),
    ]);

    res.json({ appointments, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    console.error('[Admin] getAppointments error:', error);
    res.status(500).json({ error: 'Error al obtener citas' });
  }
};

exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const valid = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!valid.includes(status)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }

    const appointment = await prisma.appointment.findUnique({ where: { id } });
    if (!appointment) {
      return res.status(404).json({ error: 'Cita no encontrada' });
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: { status },
      include: {
        user: { select: { id: true, firstName: true, lastName: true } },
        service: { select: { name: true } },
      },
    });

    // Create notification for patient
    const statusLabels = { pending: 'pendiente', confirmed: 'confirmada', cancelled: 'cancelada', completed: 'completada' };
    await prisma.notification.create({
      data: {
        userId: updated.userId,
        title: `Cita ${statusLabels[status]}`,
        message: `Tu cita de ${updated.service.name} ha sido ${statusLabels[status]}.`,
      },
    });

    res.json({ message: 'Estado actualizado', appointment: updated });
  } catch (error) {
    console.error('[Admin] updateAppointmentStatus error:', error);
    res.status(500).json({ error: 'Error al actualizar estado' });
  }
};

exports.createManualAppointment = async (req, res) => {
  try {
    const { userId, serviceId, date, startTime, notes } = req.body;

    // Verify user & service
    const [user, service] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.service.findUnique({ where: { id: serviceId } }),
    ]);
    if (!user) return res.status(404).json({ error: 'Paciente no encontrado' });
    if (!service) return res.status(404).json({ error: 'Servicio no encontrado' });

    const endTime = minutesToTime(timeToMinutes(startTime) + service.duration);

    // Check availability
    const slots = await getAvailableSlots(date, service.duration);
    const isAvailable = slots.some((s) => s.startTime === startTime);
    if (!isAvailable) {
      return res.status(409).json({ error: 'El horario no está disponible' });
    }

    const appointment = await prisma.appointment.create({
      data: {
        userId,
        serviceId,
        date: new Date(date + 'T00:00:00Z'),
        startTime,
        endTime,
        notes: notes || null,
        status: 'confirmed',
      },
      include: {
        user: { select: { firstName: true, lastName: true } },
        service: { select: { name: true } },
      },
    });

    await prisma.notification.create({
      data: {
        userId,
        title: 'Cita agendada por la clínica',
        message: `Se ha agendado una cita de ${service.name} para el ${date} a las ${startTime}.`,
      },
    });

    res.status(201).json({ message: 'Cita creada', appointment });
  } catch (error) {
    console.error('[Admin] createManualAppointment error:', error);
    res.status(500).json({ error: 'Error al crear cita' });
  }
};

// ─── Patients ───
exports.getPatients = async (req, res) => {
  try {
    const { search, page = 1, limit = 50 } = req.query;
    const where = { role: 'patient' };

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [patients, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: { id: true, firstName: true, lastName: true, email: true, phone: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      }),
      prisma.user.count({ where }),
    ]);

    res.json({ patients, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    console.error('[Admin] getPatients error:', error);
    res.status(500).json({ error: 'Error al obtener pacientes' });
  }
};

// ─── Services CRUD ───
exports.getAllServices = async (req, res) => {
  try {
    const services = await prisma.service.findMany({ orderBy: { name: 'asc' } });
    res.json({ services });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener servicios' });
  }
};

exports.createService = async (req, res) => {
  try {
    const { name, description, duration, price, isActive } = req.body;
    const service = await prisma.service.create({
      data: { name, description, duration: parseInt(duration), price: parseFloat(price), isActive: isActive !== false },
    });
    res.status(201).json({ message: 'Servicio creado', service });
  } catch (error) {
    console.error('[Admin] createService error:', error);
    res.status(500).json({ error: 'Error al crear servicio' });
  }
};

exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, duration, price, isActive } = req.body;

    const data = {};
    if (name !== undefined) data.name = name;
    if (description !== undefined) data.description = description;
    if (duration !== undefined) data.duration = parseInt(duration);
    if (price !== undefined) data.price = parseFloat(price);
    if (isActive !== undefined) data.isActive = isActive;

    const service = await prisma.service.update({ where: { id }, data });
    res.json({ message: 'Servicio actualizado', service });
  } catch (error) {
    console.error('[Admin] updateService error:', error);
    res.status(500).json({ error: 'Error al actualizar servicio' });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    // Check if service has appointments
    const count = await prisma.appointment.count({ where: { serviceId: id } });
    if (count > 0) {
      // Soft delete - just deactivate
      await prisma.service.update({ where: { id }, data: { isActive: false } });
      return res.json({ message: 'Servicio desactivado (tiene citas asociadas)' });
    }
    await prisma.service.delete({ where: { id } });
    res.json({ message: 'Servicio eliminado' });
  } catch (error) {
    console.error('[Admin] deleteService error:', error);
    res.status(500).json({ error: 'Error al eliminar servicio' });
  }
};

// ─── Schedule ───
exports.getSchedule = async (req, res) => {
  try {
    const hours = await prisma.clinicHours.findMany({ orderBy: { dayOfWeek: 'asc' } });
    const blocks = await prisma.scheduleBlock.findMany({
      where: { date: { gte: new Date() } },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    });
    res.json({ hours, blocks });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener horarios' });
  }
};

exports.updateSchedule = async (req, res) => {
  try {
    const { hours } = req.body; // Array of { dayOfWeek, openTime, closeTime, isOpen }

    if (!Array.isArray(hours)) {
      return res.status(400).json({ error: 'Formato inválido' });
    }

    const updates = hours.map((h) =>
      prisma.clinicHours.upsert({
        where: { dayOfWeek: h.dayOfWeek },
        update: { openTime: h.openTime, closeTime: h.closeTime, isOpen: h.isOpen },
        create: { dayOfWeek: h.dayOfWeek, openTime: h.openTime, closeTime: h.closeTime, isOpen: h.isOpen },
      })
    );

    await Promise.all(updates);
    const updated = await prisma.clinicHours.findMany({ orderBy: { dayOfWeek: 'asc' } });
    res.json({ message: 'Horarios actualizados', hours: updated });
  } catch (error) {
    console.error('[Admin] updateSchedule error:', error);
    res.status(500).json({ error: 'Error al actualizar horarios' });
  }
};

exports.createBlock = async (req, res) => {
  try {
    const { date, startTime, endTime, reason } = req.body;

    const block = await prisma.scheduleBlock.create({
      data: {
        date: new Date(date + 'T00:00:00Z'),
        startTime,
        endTime,
        reason: reason || null,
      },
    });

    res.status(201).json({ message: 'Bloque creado', block });
  } catch (error) {
    console.error('[Admin] createBlock error:', error);
    res.status(500).json({ error: 'Error al crear bloque' });
  }
};

exports.deleteBlock = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.scheduleBlock.delete({ where: { id } });
    res.json({ message: 'Bloque eliminado' });
  } catch (error) {
    console.error('[Admin] deleteBlock error:', error);
    res.status(500).json({ error: 'Error al eliminar bloque' });
  }
};

// ─── Clinic Settings ───
exports.getClinicSettings = async (req, res) => {
  try {
    const clinic = await prisma.clinicProfile.findFirst();
    res.json({ clinic });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener configuración' });
  }
};

exports.updateClinicSettings = async (req, res) => {
  try {
    const { name, phone, address, email, description } = req.body;
    const clinic = await prisma.clinicProfile.findFirst();

    if (!clinic) {
      return res.status(404).json({ error: 'Perfil de clínica no encontrado' });
    }

    const data = {};
    if (name !== undefined) data.name = name;
    if (phone !== undefined) data.phone = phone;
    if (address !== undefined) data.address = address;
    if (email !== undefined) data.email = email;
    if (description !== undefined) data.description = description;

    const updated = await prisma.clinicProfile.update({ where: { id: clinic.id }, data });
    res.json({ message: 'Configuración actualizada', clinic: updated });
  } catch (error) {
    console.error('[Admin] updateClinicSettings error:', error);
    res.status(500).json({ error: 'Error al actualizar configuración' });
  }
};
