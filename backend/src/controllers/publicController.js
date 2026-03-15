const prisma = require('../config/db');
const { getAvailableSlots } = require('../services/availabilityService');
const { sendContactEmail } = require('../services/emailService');

exports.getClinic = async (req, res) => {
  try {
    const clinic = await prisma.clinicProfile.findFirst();
    const hours = await prisma.clinicHours.findMany({ orderBy: { dayOfWeek: 'asc' } });

    res.json({ clinic, hours });
  } catch (error) {
    console.error('[Public] getClinic error:', error);
    res.status(500).json({ error: 'Error al obtener información de la clínica' });
  }
};

exports.getServices = async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });

    res.json({ services });
  } catch (error) {
    console.error('[Public] getServices error:', error);
    res.status(500).json({ error: 'Error al obtener servicios' });
  }
};

exports.getAvailability = async (req, res) => {
  try {
    const { date, serviceId } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'La fecha es requerida' });
    }

    let duration = 30; // default
    if (serviceId) {
      const service = await prisma.service.findUnique({ where: { id: serviceId } });
      if (service) {
        duration = service.duration;
      }
    }

    const slots = await getAvailableSlots(date, duration);

    res.json({ date, slots });
  } catch (error) {
    console.error('[Public] getAvailability error:', error);
    res.status(500).json({ error: 'Error al obtener disponibilidad' });
  }
};

exports.submitContact = async (req, res) => {
  try {
    const { name, phone, email, message } = req.body;

    const contact = await prisma.contactMessage.create({
      data: { name, phone: phone || null, email: email || null, message },
    });

    // Send email notification (fire and forget)
    sendContactEmail({ name, phone, email, message });

    res.status(201).json({
      message: 'Mensaje enviado exitosamente. Nos pondremos en contacto contigo pronto.',
      contact,
    });
  } catch (error) {
    console.error('[Public] submitContact error:', error);
    res.status(500).json({ error: 'Error al enviar el mensaje' });
  }
};
