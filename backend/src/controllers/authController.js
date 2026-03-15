const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const sanitizeUser = (user) => {
  const { password, ...rest } = user;
  return rest;
};

exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) {
      return res.status(409).json({ error: 'Ya existe una cuenta con este email' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        firstName,
        lastName,
        phone: phone || null,
        role: 'patient',
      },
    });

    // Create welcome notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'Bienvenido a CitaDental',
        message: 'Tu cuenta ha sido creada exitosamente. ¡Agenda tu primera cita!',
      },
    });

    const token = generateToken(user.id);

    res.status(201).json({
      message: 'Cuenta creada exitosamente',
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error('[Auth] Register error:', error);
    res.status(500).json({ error: 'Error al crear la cuenta' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = generateToken(user.id);

    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error('[Auth] Login error:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

exports.me = async (req, res) => {
  try {
    res.json({ user: sanitizeUser(req.user) });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
};
