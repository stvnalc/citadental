const router = require('express').Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

router.use(authenticate, authorize('admin', 'staff'));

// Dashboard
router.get('/dashboard', adminController.getDashboard);

// Appointments
router.get('/appointments', adminController.getAppointments);
router.patch('/appointments/:id/status',
  validate([body('status').notEmpty().withMessage('Estado requerido')]),
  adminController.updateAppointmentStatus
);
router.post('/appointments/manual',
  validate([
    body('userId').notEmpty().withMessage('Paciente requerido'),
    body('serviceId').notEmpty().withMessage('Servicio requerido'),
    body('date').notEmpty().isISO8601().withMessage('Fecha inv\u00e1lida'),
    body('startTime').matches(/^\d{2}:\d{2}$/).withMessage('Hora inv\u00e1lida'),
  ]),
  adminController.createManualAppointment
);

// Patients
router.get('/patients', adminController.getPatients);

// Services CRUD
router.get('/services', adminController.getAllServices);
router.post('/services',
  validate([
    body('name').notEmpty().trim().withMessage('Nombre requerido'),
    body('duration').isInt({ min: 5 }).withMessage('Duraci\u00f3n inv\u00e1lida'),
    body('price').isFloat({ min: 0 }).withMessage('Precio inv\u00e1lido'),
  ]),
  adminController.createService
);
router.patch('/services/:id', adminController.updateService);
router.delete('/services/:id', adminController.deleteService);

// Schedule
router.get('/schedule', adminController.getSchedule);
router.post('/schedule',
  validate([body('hours').isArray().withMessage('Formato inv\u00e1lido')]),
  adminController.updateSchedule
);
router.post('/schedule/blocks',
  validate([
    body('date').notEmpty().isISO8601().withMessage('Fecha inv\u00e1lida'),
    body('startTime').matches(/^\d{2}:\d{2}$/).withMessage('Hora inicio inv\u00e1lida'),
    body('endTime').matches(/^\d{2}:\d{2}$/).withMessage('Hora fin inv\u00e1lida'),
  ]),
  adminController.createBlock
);
router.delete('/schedule/blocks/:id', adminController.deleteBlock);

// Clinic settings
router.get('/clinic', adminController.getClinicSettings);
router.patch('/clinic', adminController.updateClinicSettings);

module.exports = router;
