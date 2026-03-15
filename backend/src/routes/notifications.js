const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const notificationController = require('../controllers/notificationController');

router.use(authenticate);

router.get('/', notificationController.getNotifications);
router.patch('/:id/read', notificationController.markAsRead);
router.patch('/read-all', notificationController.markAllAsRead);

module.exports = router;
