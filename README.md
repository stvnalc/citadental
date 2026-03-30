# 🦷 CitaDental — Sistema de Gestión de Citas Odontológicas

**PALACIOS IUCCI DENTAL GROUP**  
Valencia, Carabobo, Venezuela

---

## 📋 Descripción

CitaDental es un sistema web full-stack para la gestión integral de citas odontológicas. Permite a los pacientes agendar citas en línea, ver su historial y recibir notificaciones, mientras que el equipo administrativo puede gestionar la agenda, servicios, horarios y configuración de la clínica.

## 🚀 Tecnologías

### Frontend
- **React 18** + **TypeScript** — UI declarativa con tipado estático
- **Vite** — Bundler ultrarrápido con HMR
- **Tailwind CSS** — Framework de utilidades CSS
- **React Router v6** — Enrutamiento SPA con rutas protegidas
- **Axios** — Cliente HTTP con interceptores JWT
- **Lucide React** — Iconografía consistente
- **Sonner** — Notificaciones toast
- **shadcn/ui** — Componentes base accesibles

### Backend
- **Node.js** + **Express** — Servidor REST API
- **Prisma ORM** — Acceso a base de datos con migraciones
- **PostgreSQL** — Base de datos relacional
- **JWT (jsonwebtoken)** — Autenticación stateless
- **bcryptjs** — Hash de contraseñas
- **express-validator** — Validación de datos
- **express-rate-limit** — Protección contra ataques de fuerza bruta
- **CORS** — Control de acceso cross-origin

## 📁 Estructura del Proyecto

```
citadental/
├── frontend/                 # Aplicación React
│   ├── src/
│   │   ├── assets/           # Logo e imágenes
│   │   ├── components/       # Componentes reutilizables (UI + custom)
│   │   ├── contexts/         # AuthContext (estado global de autenticación)
│   │   ├── data/             # Datos mock (fallback)
│   │   ├── layouts/          # PublicLayout, PatientLayout, AdminLayout
│   │   ├── lib/              # api.ts (servicio HTTP con Axios)
│   │   └── pages/
│   │       ├── public/       # Home, Services, Contact, Login, Register
│   │       ├── patient/      # Dashboard, Booking, Appointments, Profile, Notifications
│   │       └── admin/        # Dashboard, Appointments, Services, Schedule, Patients, Settings
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── controllers/      # Lógica de negocio por módulo
│   │   ├── routes/           # Definición de endpoints REST
│   │   ├── middleware/       # Auth JWT, validación, rate limiting
│   │   ├── services/         # Disponibilidad, email
│   │   ├── config/           # Conexión Prisma
│   │   └── server.js         # Punto de entrada
│   ├── prisma/
│   │   ├── schema.prisma     # Modelo de datos
│   │   └── seed.js           # Datos iniciales
│   └── package.json
├── README.md
└── ARCHITECTURE.md
```

## ⚙️ Instalación y Ejecución

### Prerrequisitos
- Node.js >= 18
- PostgreSQL >= 14
- npm o yarn

### 1. Clonar el repositorio
```bash
git clone <repo-url>
cd citadental
```

### 2. Backend
```bash
cd backend
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tu DATABASE_URL, JWT_SECRET, etc.

# Ejecutar migraciones
npx prisma migrate dev

# Poblar base de datos con datos iniciales
npx prisma db seed

# Iniciar servidor (puerto 3001)
npm run dev
```

### 3. Frontend
```bash
cd frontend
npm install

# Iniciar servidor de desarrollo (puerto 5173)
npm run dev
```

### 4. Acceder
- Frontend: http://localhost:5173
- API: http://localhost:3001/api

## 👤 Usuarios de Prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| Admin | admin@pidentalgroup.com | admin123 |
| Paciente | maria.garcia@email.com | password123 |

## 🔑 Funcionalidades

### Pacientes
- ✅ Registro e inicio de sesión
- ✅ Agendar citas seleccionando servicio, fecha y hora disponible
- ✅ Ver y cancelar citas
- ✅ Perfil personal
- ✅ Notificaciones en tiempo real

### Administración
- ✅ Dashboard con estadísticas (citas hoy, semana, pacientes)
- ✅ Gestión completa de citas (crear, confirmar, completar, cancelar)
- ✅ CRUD de servicios odontológicos
- ✅ Configuración de horarios semanales
- ✅ Bloqueo de rangos horarios
- ✅ Listado y búsqueda de pacientes
- ✅ Configuración de datos de la clínica

### Seguridad
- ✅ Autenticación JWT con refresh automático
- ✅ Rutas protegidas por rol (paciente/admin)
- ✅ Hash de contraseñas con bcrypt
- ✅ Rate limiting en endpoints sensibles
- ✅ Validación de datos en servidor

## 📡 API Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | /api/auth/register | Registro de paciente |
| POST | /api/auth/login | Inicio de sesión |
| GET | /api/auth/me | Perfil del usuario autenticado |
| GET | /api/services | Servicios públicos |
| GET | /api/clinic | Info de la clínica |
| GET | /api/availability | Horarios disponibles |
| POST | /api/contact | Formulario de contacto |
| GET | /api/me/appointments | Citas del paciente |
| POST | /api/me/appointments | Crear cita |
| PATCH | /api/me/appointments/:id/cancel | Cancelar cita |
| GET | /api/admin/dashboard | Estadísticas |
| GET | /api/admin/appointments | Todas las citas |
| PATCH | /api/admin/appointments/:id/status | Cambiar estado |
| POST | /api/admin/appointments/manual | Cita manual |
| GET/POST/PATCH/DELETE | /api/admin/services | CRUD servicios |
| GET/POST | /api/admin/schedule | Horarios |
| POST/DELETE | /api/admin/schedule/blocks | Bloqueos |
| GET/PATCH | /api/admin/clinic | Configuración |
| GET | /api/admin/patients | Pacientes |
| GET | /api/notifications | Notificaciones |
| PATCH | /api/notifications/:id/read | Marcar leída |

## 🎨 Diseño

Esquema de colores: verde/teal dental profesional con degradados, diseño responsive mobile-first con Tailwind CSS.

## 📝 Licencia

Proyecto académico — PALACIOS IUCCI DENTAL GROUP © 2026
