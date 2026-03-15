const router = require('express').Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { contactLimiter } = require('../middleware/rateLimiter');
const publicController = require('../controllers/publicController');

router.get('/clinic', publicController.getClinic);
router.get('/services', publicController.getServices);
router.get('/availability', publicController.getAvailability);

router.post(
  '/contact',
  contactLimiter,
  validate([
    body('name').notEmpty().trim().withMessage('El nombre es requerido'),
    body('message').notEmpty().trim().withMessage('El mensaje es requerido'),
    body('email').optional({ values: 'falsy' }).isEmail().withMessage('Email inv\u00e1lido'),
  ]),
  publicController.submitContact
);

module.exports = router;
