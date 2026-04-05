# 🦷 CitaDental — Palacios Iucci Dental Group

Sistema de gestión de citas odontológicas para **Palacios Iucci Dental Group**.

---

## 🚀 Instalación Local (tu computadora)

> **👉 [Lee la guía completa de instalación local aquí → SETUP_LOCAL.md](./SETUP_LOCAL.md)**

### Resumen rápido

```bash
# 1. Clonar el repositorio
git clone https://github.com/TU_USUARIO/pidentalgroup.git citadental
cd citadental

# 2. Crear la base de datos PostgreSQL
sudo -u postgres psql -c "CREATE USER citadental WITH PASSWORD 'citadental123';"
sudo -u postgres psql -c "CREATE DATABASE citadental OWNER citadental;"

# 3. Configurar el backend
cd backend
cp .env.example .env    # Editar .env con tus datos (ver SETUP_LOCAL.md)
npm run setup           # Instala deps + crea tablas + carga datos de prueba

# 4. Configurar el frontend
cd ../frontend
npm install

# 5. Iniciar (necesitas 2 terminales)
# Terminal 1:
cd backend && npm run dev

# Terminal 2:
cd frontend && npm run dev
```

Abre **http://localhost:8080** en tu navegador.

---

## 🖥️ Inicio Rápido (servidor de producción)

Si estás en el servidor donde ya está desplegado:

```bash
cd /home/ubuntu/citadental
./iniciar.sh
```

Esto inicia PostgreSQL y la aplicación. La app estará disponible en:

| Recurso       | URL                          |
|---------------|------------------------------|
| 🌐 Aplicación | http://localhost:3000        |
| 📡 API        | http://localhost:3000/api    |

---

## 🔑 Credenciales de Prueba

| Rol      | Email                         | Contraseña    |
|----------|-------------------------------|---------------|
| Admin    | admin@pidentalgroup.com       | admin123      |
| Paciente | maria.garcia@email.com        | paciente123   |

> Ver todas las cuentas de prueba en [SETUP_LOCAL.md → Credenciales](./SETUP_LOCAL.md#10--credenciales-de-prueba)

---

## 📋 Comandos del Servidor (producción)

```bash
./iniciar.sh              # Iniciar todo (PostgreSQL + App)
./iniciar.sh start        # Iniciar todo
./iniciar.sh stop         # Detener todo
./iniciar.sh restart      # Reiniciar la aplicación
./iniciar.sh status       # Ver estado de los servicios
./iniciar.sh logs         # Ver logs en tiempo real
./iniciar.sh seed         # Recargar datos de prueba en la BD
./iniciar.sh help         # Mostrar ayuda
```

---

## 📋 Comandos de Desarrollo (local)

```bash
# ── Backend (desde backend/) ──────────────
npm run dev              # Iniciar en modo desarrollo (nodemon)
npm run setup            # Instalación completa
npx prisma studio        # Editor visual de base de datos
npx prisma db push       # Sincronizar esquema con BD
npx prisma generate      # Regenerar cliente Prisma
node prisma/seed.js      # Recargar datos de prueba

# ── Frontend (desde frontend/) ────────────
npm run dev              # Iniciar en modo desarrollo (Vite)
npm run build            # Build de producción
npm run preview          # Previsualizar build
```

---

## 📁 Estructura del Proyecto

```
citadental/
├── backend/           # API Express + Prisma
│   ├── src/
│   │   ├── server.js          # Servidor principal
│   │   ├── controllers/       # Controladores de rutas
│   │   ├── middleware/         # Auth, validación, rate limiting
│   │   ├── routes/            # Definición de rutas API
│   │   └── services/          # Lógica de negocio
│   ├── prisma/
│   │   ├── schema.prisma      # Esquema de base de datos
│   │   └── seed.js            # Datos de prueba
│   ├── .env                   # Variables de entorno (no se sube a Git)
│   └── .env.example           # Plantilla de variables de entorno
├── frontend/          # React + Vite + Tailwind
│   ├── src/
│   │   ├── App.tsx            # Componente raíz
│   │   ├── pages/             # Páginas de la app
│   │   └── components/        # Componentes reutilizables
│   ├── .env                   # Variables del frontend
│   └── dist/                  # Build de producción
├── SETUP_LOCAL.md             # 📖 Guía de instalación local
├── ecosystem.config.js        # Configuración PM2 (producción)
├── iniciar.sh                 # Script de inicio rápido (producción)
└── README.md                  # Este archivo
```

---

## ⚙️ Tecnologías

| Capa           | Tecnologías                                |
|----------------|-------------------------------------------|
| **Backend**    | Node.js, Express, Prisma ORM             |
| **Frontend**   | React, TypeScript, Tailwind CSS, Shadcn/UI |
| **Base de datos** | PostgreSQL 14+                         |
| **Auth**       | JWT (JSON Web Tokens)                      |
| **Producción** | PM2                                        |

---

## 📍 Información de la Clínica

- **Nombre:** Palacios Iucci Dental Group
- **Dirección:** Av. 137 de Prebo, Edif. 137, Mezzanina Ofic #3, Valencia, Carabobo
- **Teléfono:** +58 412-441-38-79
- **Email:** info@pidentalgroup.com
- **WhatsApp:** wa.me/584124413879
- **Instagram:** @pidentalgroup

---

© 2026 CitaDental — PALACIOS IUCCI DENTAL GROUP. Todos los derechos reservados.
