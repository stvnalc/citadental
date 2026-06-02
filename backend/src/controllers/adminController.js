const prisma = require('../config/db');
const { timeToMinutes, minutesToTime, getAvailableSlots } = require('../services/availabilityService');
const PDFDocument = require('pdfkit');
const bcrypt = require('bcryptjs');

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

// ─── Export Appointments Report (PDF) ───
exports.exportAppointmentsReport = async (req, res) => {
  try {
    const { range, status } = req.query;

    // Calculate date range
    const now = new Date();
    let startDate, endDate, rangeLabel;

    switch (range) {
      case 'day': {
        startDate = new Date(now);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);
        rangeLabel = 'Hoy';
        break;
      }
      case 'month': {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        rangeLabel = 'Este Mes';
        break;
      }
      case 'year': {
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear() + 1, 0, 1);
        rangeLabel = 'Este Año';
        break;
      }
      default:
        return res.status(400).json({ error: 'Rango inválido. Use: day, month, year' });
    }

    // Build query
    const where = { date: { gte: startDate, lt: endDate } };
    if (status) where.status = status;

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        user: { select: { firstName: true, lastName: true, email: true, phone: true } },
        service: { select: { name: true, duration: true, price: true } },
      },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    });

    // Status labels in Spanish
    const statusLabels = {
      pending: 'Pendiente',
      confirmed: 'Confirmada',
      completed: 'Completada',
      cancelled: 'Cancelada',
    };

    // Summary data
    const statusCounts = {
      pending: appointments.filter(a => a.status === 'pending').length,
      confirmed: appointments.filter(a => a.status === 'confirmed').length,
      completed: appointments.filter(a => a.status === 'completed').length,
      cancelled: appointments.filter(a => a.status === 'cancelled').length,
    };

    const totalRevenue = appointments
      .filter(a => a.status !== 'cancelled')
      .reduce((sum, a) => sum + (parseFloat(a.service?.price) || 0), 0);

    // ── Create PDF Document ──
    const doc = new PDFDocument({ size: 'LETTER', layout: 'landscape', margin: 40 });

    // Collect PDF into buffer
    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));

    const pdfReady = new Promise((resolve) => {
      doc.on('end', () => resolve(Buffer.concat(chunks)));
    });

    // Brand colors
    const primaryColor = '#0D9488';  // teal-600
    const headerBg = '#0F766E';      // teal-700
    const lightBg = '#F0FDFA';       // teal-50
    const darkText = '#1a1a1a';
    const mutedText = '#6b7280';

    // ── Helper functions ──
    const drawRoundedRect = (x, y, w, h, r, color) => {
      doc.roundedRect(x, y, w, h, r).fill(color);
    };

    // ── Page 1: Header + Summary ──
    const pageW = doc.page.width - 80; // usable width

    // Header bar
    drawRoundedRect(40, 40, pageW, 50, 6, headerBg);
    doc.fontSize(20).fill('#FFFFFF').font('Helvetica-Bold')
      .text('Reporte de Citas — CitaDental', 55, 53, { width: pageW - 30 });

    // Subtitle
    const generatedAt = now.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    doc.fontSize(10).fill(mutedText).font('Helvetica-Oblique')
      .text(`Período: ${rangeLabel}  |  Generado: ${generatedAt}`, 40, 100, { align: 'center', width: pageW });

    // ── Summary Cards ──
    const cardY = 125;
    const cardH = 60;
    const cardW = (pageW - 30) / 4; // 4 cards with gaps
    const cardGap = 10;

    const summaryCards = [
      { label: 'Total Citas', value: appointments.length.toString(), color: primaryColor },
      { label: 'Confirmadas', value: statusCounts.confirmed.toString(), color: '#2563EB' },
      { label: 'Pendientes', value: statusCounts.pending.toString(), color: '#D97706' },
      { label: 'Completadas', value: statusCounts.completed.toString(), color: '#16A34A' },
    ];

    summaryCards.forEach((card, i) => {
      const x = 40 + i * (cardW + cardGap);
      // Card background
      drawRoundedRect(x, cardY, cardW, cardH, 6, lightBg);
      // Left accent bar
      doc.roundedRect(x, cardY, 4, cardH, 2).fill(card.color);
      // Value
      doc.fontSize(22).fill(card.color).font('Helvetica-Bold')
        .text(card.value, x + 15, cardY + 10, { width: cardW - 25 });
      // Label
      doc.fontSize(9).fill(mutedText).font('Helvetica')
        .text(card.label, x + 15, cardY + 38, { width: cardW - 25 });
    });

    // Second row: Cancelled + Revenue
    const card2Y = cardY + cardH + 12;
    const card2W = (pageW - 10) / 2;

    // Cancelled card
    drawRoundedRect(40, card2Y, card2W, 50, 6, lightBg);
    doc.roundedRect(40, card2Y, 4, 50, 2).fill('#DC2626');
    doc.fontSize(18).fill('#DC2626').font('Helvetica-Bold')
      .text(statusCounts.cancelled.toString(), 55, card2Y + 8, { width: card2W - 25 });
    doc.fontSize(9).fill(mutedText).font('Helvetica')
      .text('Canceladas', 55, card2Y + 32, { width: card2W - 25 });

    // Revenue card
    const revX = 40 + card2W + 10;
    drawRoundedRect(revX, card2Y, card2W, 50, 6, lightBg);
    doc.roundedRect(revX, card2Y, 4, 50, 2).fill(primaryColor);
    doc.fontSize(18).fill(primaryColor).font('Helvetica-Bold')
      .text(`$${totalRevenue.toFixed(2)}`, revX + 15, card2Y + 8, { width: card2W - 25 });
    doc.fontSize(9).fill(mutedText).font('Helvetica')
      .text('Ingreso Estimado (sin canceladas)', revX + 15, card2Y + 32, { width: card2W - 25 });

    // ── Data Table ──
    const tableTop = card2Y + 75;
    const columns = [
      { header: 'Paciente', width: 130 },
      { header: 'Email', width: 150 },
      { header: 'Teléfono', width: 90 },
      { header: 'Servicio', width: 120 },
      { header: 'Precio', width: 65 },
      { header: 'Fecha', width: 75 },
      { header: 'Hora', width: 55 },
      { header: 'Estado', width: 75 },
    ];

    const totalTableW = columns.reduce((s, c) => s + c.width, 0);

    // Draw table header
    const drawTableHeader = (y) => {
      drawRoundedRect(40, y, totalTableW, 24, 3, headerBg);
      let xPos = 45;
      columns.forEach((col) => {
        doc.fontSize(8).fill('#FFFFFF').font('Helvetica-Bold')
          .text(col.header, xPos, y + 7, { width: col.width - 10, lineBreak: false });
        xPos += col.width;
      });
      return y + 24;
    };

    // Draw a single data row
    const drawDataRow = (appointment, y, index) => {
      const rowH = 22;

      // Alternate row color
      if (index % 2 === 0) {
        doc.rect(40, y, totalTableW, rowH).fill(lightBg);
      }

      let xPos = 45;
      const rowData = [
        `${appointment.user?.firstName || ''} ${appointment.user?.lastName || ''}`.trim(),
        appointment.user?.email || '',
        appointment.user?.phone || '',
        appointment.service?.name || '',
        `$${(parseFloat(appointment.service?.price) || 0).toFixed(2)}`,
        new Date(appointment.date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        appointment.startTime || '',
        statusLabels[appointment.status] || appointment.status,
      ];

      rowData.forEach((text, i) => {
        const col = columns[i];
        const fontColor = i === rowData.length - 1
          ? (appointment.status === 'cancelled' ? '#DC2626' : appointment.status === 'completed' ? '#16A34A' : appointment.status === 'confirmed' ? '#2563EB' : '#D97706')
          : darkText;
        doc.fontSize(7.5).fill(fontColor).font(i === rowData.length - 1 ? 'Helvetica-Bold' : 'Helvetica')
          .text(String(text), xPos, y + 6, { width: col.width - 10, lineBreak: false });
        xPos += col.width;
      });

      return y + rowH;
    };

    // Render the table
    let currentY = drawTableHeader(tableTop);
    const pageBottom = doc.page.height - 60;

    appointments.forEach((a, index) => {
      // Check if we need a new page
      if (currentY + 24 > pageBottom) {
        doc.addPage({ size: 'LETTER', layout: 'landscape', margin: 40 });
        currentY = drawTableHeader(40);
      }
      currentY = drawDataRow(a, currentY, index);
    });

    if (appointments.length === 0) {
      doc.fontSize(11).fill(mutedText).font('Helvetica-Oblique')
        .text('No se encontraron citas para este período.', 40, currentY + 15, { align: 'center', width: totalTableW });
    }

    // ── Footer ──
    const footerY = doc.page.height - 40;
    doc.fontSize(7).fill(mutedText).font('Helvetica')
      .text('CitaDental — Sistema de Gestión de Citas', 40, footerY, { align: 'center', width: pageW });

    // Finalize PDF
    doc.end();
    const pdfBuffer = await pdfReady;

    // ── Send response ──
    const dateStr = now.toISOString().slice(0, 10);
    const rangeNames = { day: 'Hoy', month: 'Mes', year: 'Año' };
    const filename = `Reporte_Citas_${rangeNames[range]}_${dateStr}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('[Admin] exportAppointmentsReport error:', error);
    res.status(500).json({ error: 'Error al generar reporte' });
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

// ─── User Management (Admin only) ───
exports.getUsers = async (req, res) => {
  try {
    const { search, role, page = 1, limit = 50 } = req.query;
    const where = {};

    if (role) where.role = role;

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: { id: true, firstName: true, lastName: true, email: true, phone: true, role: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      }),
      prisma.user.count({ where }),
    ]);

    res.json({ users, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    console.error('[Admin] getUsers error:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, role } = req.body;

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) {
      return res.status(409).json({ error: 'Ya existe un usuario con este email' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        firstName,
        lastName,
        phone: phone || null,
        role,
      },
    });

    const { password: _, ...sanitized } = user;
    res.status(201).json({ message: 'Usuario creado', user: sanitized });
  } catch (error) {
    console.error('[Admin] createUser error:', error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, phone, role, password } = req.body;

    const userExists = await prisma.user.findUnique({ where: { id } });
    if (!userExists) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Prevent admin from changing their own role (safety)
    if (id === req.user.id && role && role !== req.user.role) {
      return res.status(400).json({ error: 'No puedes cambiar tu propio rol' });
    }

    const data = {};
    if (firstName !== undefined) data.firstName = firstName;
    if (lastName !== undefined) data.lastName = lastName;
    if (email !== undefined) {
      // Check email uniqueness
      const emailTaken = await prisma.user.findFirst({ where: { email: email.toLowerCase(), id: { not: id } } });
      if (emailTaken) return res.status(409).json({ error: 'Email ya está en uso' });
      data.email = email.toLowerCase();
    }
    if (phone !== undefined) data.phone = phone || null;
    if (role !== undefined) data.role = role;
    if (password) data.password = await bcrypt.hash(password, 12);

    const updated = await prisma.user.update({ where: { id }, data });
    const { password: _, ...sanitized } = updated;
    res.json({ message: 'Usuario actualizado', user: sanitized });
  } catch (error) {
    console.error('[Admin] updateUser error:', error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (id === req.user.id) {
      return res.status(400).json({ error: 'No puedes eliminar tu propia cuenta' });
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    await prisma.user.delete({ where: { id } });
    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    console.error('[Admin] deleteUser error:', error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};
