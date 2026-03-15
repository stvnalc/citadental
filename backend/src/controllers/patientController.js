const prisma = require('../config/db');
const { getAvailableSlots, timeToMinutes, minutesToTime } = require('../services/availabilityService');

exports.getProfile = async (req, res) => {
  try {
    const { password, ...user } = req.user;
    const appointmentCount = await prisma.appointment.count({ where: { userId: req.user.id } });

    res.json({ user, appointmentCount });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
};

exports.getAppointments = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const where = { userId: req.user.id };
    if (status) where.status = status;

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        include: { service: { select: { name: true, duration: true, price: true } } },
        orderBy: [{ date: 'desc' }, { startTime: 'desc' }],
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      }),
      prisma.appointment.count({ where }),
    ]);

    res.json({ appointments, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    console.error('[Patient] getAppointments error:', error);
    res.status(500).json({ error: 'Error al obtener citas' });
  }
};

exports.createAppointment = async (req, res) => {
  try {
    const { serviceId, date, startTime, notes } = req.body;

    // Validate service exists
    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service || !service.isActive) {
      return res.status(400).json({ error: 'Servicio no disponible' });
    }

    // Check date is in the future
    const appointmentDate = new Date(date + 'T00:00:00Z');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (appointmentDate < today) {
      return res.status(400).json({ error: 'No puedes agendar citas en fechas pasadas' });
    }

    // Calculate endTime
    const startMin = timeToMinutes(startTime);
    const endTime = minutesToTime(startMin + service.duration);

    // Verify slot is available
    const slots = await getAvailableSlots(date, service.duration);
    const isAvailable = slots.some((s) => s.startTime === startTime);
    if (!isAvailable) {
      return res.status(409).json({ error: 'El horario seleccionado ya no está disponible' });
    }

    const appointment = await prisma.appointment.create({
      data: {
        userId: req.user.id,
        serviceId,
        date: appointmentDate,
        startTime,
        endTime,
        notes: notes || null,
        status: 'pending',
      },
      include: { service: { select: { name: true, duration: true, price: true } } },
    });

    // Create notification
    await prisma.notification.create({
      data: {
        userId: req.user.id,
        title: 'Cita agendada',
        message: `Tu cita de ${service.name} para el ${date} a las ${startTime} ha sido registrada. Pendiente de confirmación.`,
      },
    });

    res.status(201).json({ message: 'Cita agendada exitosamente', appointment });
  } catch (error) {
    console.error('[Patient] createAppointment error:', error);
    res.status(500).json({ error: 'Error al agendar la cita' });
  }
};

exports.cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await prisma.appointment.findUnique({ where: { id } });
    if (!appointment) {
      return res.status(404).json({ error: 'Cita no encontrada' });
    }
    if (appointment.userId !== req.user.id) {
      return res.status(403).json({ error: 'No tienes permiso para cancelar esta cita' });
    }
    if (['cancelled', 'completed'].includes(appointment.status)) {
      return res.status(400).json({ error: 'Esta cita no puede ser cancelada' });
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: { status: 'cancelled' },
      include: { service: { select: { name: true } } },
    });

    await prisma.notification.create({
      data: {
        userId: req.user.id,
        title: 'Cita cancelada',
        message: `Tu cita de ${updated.service.name} para el ${appointment.date.toISOString().split('T')[0]} ha sido cancelada.`,
      },
    });

    res.json({ message: 'Cita cancelada', appointment: updated });
  } catch (error) {
    console.error('[Patient] cancelAppointment error:', error);
    res.status(500).json({ error: 'Error al cancelar la cita' });
  }
};
