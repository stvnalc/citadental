const router = require('express').Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimiter');
const { authenticate } = require('../middleware/auth');
const authController = require('../controllers/authController');

router.post(
  '/register',
  authLimiter,
  validate([
    body('email').isEmail().withMessage('Email inv\u00e1lido'),
    body('password').isLength({ min: 8 }).withMessage('La contrase\u00f1a debe tener al menos 8 caracteres'),
    body('firstName').notEmpty().trim().withMessage('El nombre es requerido'),
    body('lastName').notEmpty().trim().withMessage('El apellido es requerido'),
  ]),
  authController.register
);

router.post(
  '/login',
  authLimiter,
  validate([
    body('email').isEmail().withMessage('Email inv\u00e1lido'),
    body('password').notEmpty().withMessage('La contrase\u00f1a es requerida'),
  ]),
  authController.login
);

router.get('/me', authenticate, authController.me);

module.exports = router;
