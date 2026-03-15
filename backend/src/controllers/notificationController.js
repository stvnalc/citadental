const prisma = require('../config/db');

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const unreadCount = await prisma.notification.count({
      where: { userId: req.user.id, isRead: false },
    });

    res.json({ notifications, unreadCount });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener notificaciones' });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await prisma.notification.findUnique({ where: { id } });
    if (!notification || notification.userId !== req.user.id) {
      return res.status(404).json({ error: 'Notificación no encontrada' });
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    res.json({ notification: updated });
  } catch (error) {
    res.status(500).json({ error: 'Error al marcar notificación' });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user.id, isRead: false },
      data: { isRead: true },
    });

    res.json({ message: 'Todas las notificaciones marcadas como leídas' });
  } catch (error) {
    res.status(500).json({ error: 'Error al marcar notificaciones' });
  }
};
