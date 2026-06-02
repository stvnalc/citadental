const router = require('express').Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

// All routes require authentication and at least staff role
router.use(authenticate, authorize('admin', 'staff'));

// ── Dashboard (admin + staff) ──
router.get('/dashboard', adminController.getDashboard);

// ── Appointments (admin + staff) ──
router.get('/appointments', adminController.getAppointments);
router.get('/appointments/report', adminController.exportAppointmentsReport);
router.patch('/appointments/:id/status',
  validate([body('status').notEmpty().withMessage('Estado requerido')]),
  adminController.updateAppointmentStatus
);
router.post('/appointments/manual',
  validate([
    body('userId').notEmpty().withMessage('Paciente requerido'),
    body('serviceId').notEmpty().withMessage('Servicio requerido'),
    body('date').notEmpty().isISO8601().withMessage('Fecha inválida'),
    body('startTime').matches(/^\d{2}:\d{2}$/).withMessage('Hora inválida'),
  ]),
  adminController.createManualAppointment
);

// ── Patients (admin + staff) ──
router.get('/patients', adminController.getPatients);

// ── Services ──
router.get('/services', adminController.getAllServices); // admin + staff
router.post('/services',
  authorize('admin'), // admin only
  validate([
    body('name').notEmpty().trim().withMessage('Nombre requerido'),
    body('duration').isInt({ min: 5 }).withMessage('Duración inválida'),
    body('price').isFloat({ min: 0 }).withMessage('Precio inválido'),
  ]),
  adminController.createService
);
router.patch('/services/:id', authorize('admin'), adminController.updateService); // admin only
router.delete('/services/:id', authorize('admin'), adminController.deleteService); // admin only

// ── Schedule ──
router.get('/schedule', adminController.getSchedule); // admin + staff
router.post('/schedule',
  authorize('admin'), // admin only
  validate([body('hours').isArray().withMessage('Formato inválido')]),
  adminController.updateSchedule
);
router.post('/schedule/blocks',
  authorize('admin'), // admin only
  validate([
    body('date').notEmpty().isISO8601().withMessage('Fecha inválida'),
    body('startTime').matches(/^\d{2}:\d{2}$/).withMessage('Hora inicio inválida'),
    body('endTime').matches(/^\d{2}:\d{2}$/).withMessage('Hora fin inválida'),
  ]),
  adminController.createBlock
);
router.delete('/schedule/blocks/:id', authorize('admin'), adminController.deleteBlock); // admin only

// ── Clinic settings (admin only) ──
router.get('/clinic', authorize('admin'), adminController.getClinicSettings);
router.patch('/clinic', authorize('admin'), adminController.updateClinicSettings);

// ── User management (admin only) ──
router.get('/users', authorize('admin'), adminController.getUsers);
router.post('/users',
  authorize('admin'),
  validate([
    body('email').isEmail().withMessage('Email inválido'),
    body('firstName').notEmpty().trim().withMessage('Nombre requerido'),
    body('lastName').notEmpty().trim().withMessage('Apellido requerido'),
    body('password').isLength({ min: 6 }).withMessage('Contraseña mínimo 6 caracteres'),
    body('role').isIn(['admin', 'staff', 'patient']).withMessage('Rol inválido'),
  ]),
  adminController.createUser
);
router.patch('/users/:id',
  authorize('admin'),
  adminController.updateUser
);
router.delete('/users/:id', authorize('admin'), adminController.deleteUser);

module.exports = router;
