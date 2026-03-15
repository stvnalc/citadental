const router = require('express').Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const patientController = require('../controllers/patientController');

router.use(authenticate, authorize('patient'));

router.get('/profile', patientController.getProfile);
router.get('/appointments', patientController.getAppointments);

router.post(
  '/appointments',
  validate([
    body('serviceId').notEmpty().withMessage('El servicio es requerido'),
    body('date').notEmpty().isISO8601().withMessage('Fecha inv\u00e1lida'),
    body('startTime').matches(/^\d{2}:\d{2}$/).withMessage('Hora inv\u00e1lida'),
  ]),
  patientController.createAppointment
);

router.patch('/appointments/:id/cancel', patientController.cancelAppointment);

module.exports = router;
