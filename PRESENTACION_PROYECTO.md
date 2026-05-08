# 🦷 CitaDental — PALACIOS IUCCI DENTAL GROUP

## Plataforma de Gestión de Citas Odontológicas

---

## 📋 Resumen Ejecutivo

**CitaDental** es una aplicación web completa y moderna desarrollada para **Palacios Iucci Dental Group**, una clínica odontológica ubicada en Valencia, Carabobo, Venezuela. La plataforma permite a los pacientes registrarse, explorar los servicios disponibles, consultar la disponibilidad en tiempo real y reservar citas odontológicas de forma autónoma, las 24 horas del día.

El sistema también incluye un **panel administrativo completo** que permite a la clínica gestionar citas, servicios, horarios, pacientes y configuraciones generales, todo desde una interfaz intuitiva y responsiva.

| Dato | Valor |
|------|-------|
| **Cliente** | Palacios Iucci Dental Group |
| **Ubicación** | Av. 137 de Prebo, Edif. 137, Mezzanina Ofic #3, Valencia, Carabobo |
| **Teléfono** | +58 412-441-38-79 |
| **Email** | info@pidentalgroup.com |
| **WhatsApp** | wa.me/584124413879 |
| **Instagram** | @pidentalgroup |

---

## 🎯 Descripción General

CitaDental resuelve los siguientes problemas operativos de la clínica:

- **Agendamiento manual**: Los pacientes ya no necesitan llamar para reservar. Pueden hacerlo desde cualquier dispositivo.
- **Disponibilidad en tiempo real**: El sistema calcula automáticamente los horarios disponibles según los horarios de la clínica, bloqueos y citas existentes.
- **Gestión centralizada**: Todo el flujo de citas, pacientes y servicios se administra desde un solo panel.
- **Comunicación**: Sistema de notificaciones integrado y formulario de contacto con envío de emails.
- **Presencia digital**: Landing page profesional que refleja la identidad de la marca.

---

## ✅ Características Implementadas

### 🌐 Sitio Público (Landing Page)
- ✅ Hero section con branding de la clínica y llamados a la acción
- ✅ Sección "¿Por qué elegirnos?" con 4 pilares (Atención Humana, Profesionales Certificados, Emergencias 24h, Toda la Familia)
- ✅ Catálogo de servicios con precios, duración y categorías
- ✅ Testimonios de pacientes
- ✅ Sección CTA "¿Listo para tu próxima cita?" con botón de WhatsApp
- ✅ Footer con información de contacto, navegación y datos legales
- ✅ Diseño completamente responsive (desktop + móvil)

### 📋 Página de Servicios
- ✅ Listado completo de todos los servicios odontológicos
- ✅ Etiquetas por categoría (Preventivo, Diagnóstico, Estética, Ortodoncia, Cirugía, Restaurativa, Endodoncia, Prótesis)
- ✅ Precios y duración de cada servicio
- ✅ Botón "Reservar" directo desde cada servicio

### 📞 Página de Contacto
- ✅ Información completa de la clínica (dirección, teléfono, email, WhatsApp)
- ✅ Horario de atención detallado por día
- ✅ Formulario de contacto con validación (nombre, teléfono, email, mensaje)
- ✅ Envío de emails mediante Nodemailer
- ✅ Mapa de ubicación (Valencia, Carabobo)

### 🔐 Sistema de Autenticación
- ✅ Registro de pacientes (nombre, apellido, teléfono, email, contraseña)
- ✅ Inicio de sesión con email y contraseña
- ✅ Tokens JWT con expiración configurable
- ✅ Protección de rutas por rol (admin, staff, patient)
- ✅ Manejo automático de sesión expirada (redirect a login)
- ✅ Hashing de contraseñas con bcryptjs (12 rondas)

### 👤 Panel del Paciente
- ✅ Perfil del paciente con datos personales
- ✅ Reserva de citas con selección de servicio, fecha y hora
- ✅ Cálculo automático de disponibilidad en tiempo real
- ✅ Lista de "Mis Citas" con filtrado por estado
- ✅ Cancelación de citas
- ✅ Centro de notificaciones con marcado de lectura
- ✅ Navegación dedicada con sidebar

### 🛡️ Panel de Administración
- ✅ **Dashboard**: Estadísticas generales (total citas, pendientes, hoy, pacientes)
- ✅ **Gestión de Citas**: Ver, filtrar y cambiar estado (pendiente → confirmada → completada / cancelada)
- ✅ **Creación manual de citas**: El admin puede crear citas para pacientes existentes
- ✅ **Detalle de cita**: Vista individual con toda la información
- ✅ **Gestión de Servicios**: CRUD completo (crear, editar, activar/desactivar, eliminar)
- ✅ **Gestión de Pacientes**: Listado de pacientes registrados
- ✅ **Horarios**: Configuración de horarios de atención por día de la semana
- ✅ **Bloqueos de horario**: Crear bloqueos temporales (vacaciones, mantenimiento, etc.)
- ✅ **Configuración de clínica**: Editar nombre, teléfono, dirección, email y descripción

### 🔔 Sistema de Notificaciones
- ✅ Notificaciones automáticas al crear/cancelar/confirmar citas
- ✅ Contador de no leídas en la interfaz
- ✅ Marcar como leída (individual y todas)
- ✅ Historial de notificaciones

### 🔒 Seguridad
- ✅ Rate limiting en endpoints de autenticación (20 req/15min)
- ✅ Rate limiting en formulario de contacto (5 req/hora)
- ✅ Validación de datos con express-validator
- ✅ CORS configurado
- ✅ Variables de entorno para secrets
- ✅ Trust proxy para deployment detrás de reverse proxy

---

## 🛠️ Stack Tecnológico

### Frontend
| Tecnología | Propósito |
|------------|-----------|
| **React 18** | Librería de UI |
| **TypeScript** | Tipado estático |
| **Vite** | Build tool y dev server |
| **React Router v6** | Enrutamiento SPA |
| **React Query (TanStack)** | Manejo de estado del servidor y caché |
| **Tailwind CSS** | Framework de estilos utility-first |
| **Shadcn/UI** | Componentes de UI accesibles y personalizables |
| **Axios** | Cliente HTTP |
| **Lucide React** | Iconografía |
| **Radix UI** | Primitivas de componentes accesibles |

### Backend
| Tecnología | Propósito |
|------------|-----------|
| **Node.js** | Runtime de JavaScript |
| **Express.js** | Framework web |
| **Prisma ORM** | Object-Relational Mapping |
| **JSON Web Tokens (JWT)** | Autenticación stateless |
| **bcryptjs** | Hashing de contraseñas |
| **Nodemailer** | Envío de emails (SMTP / Ethereal en dev) |
| **express-validator** | Validación de inputs |
| **express-rate-limit** | Protección contra abuso |
| **Morgan** | Logging de peticiones HTTP |
| **CORS** | Seguridad cross-origin |

### Base de Datos
| Tecnología | Propósito |
|------------|-----------|
| **PostgreSQL 15** | Base de datos relacional |
| **Prisma Migrations** | Control de esquema |
| **Prisma Seed** | Datos iniciales y demo |

### DevOps / Infraestructura
| Tecnología | Propósito |
|------------|-----------|
| **PM2** | Process manager para producción |
| **Git / GitHub** | Control de versiones |
| **Vite Proxy** | Proxy de API en desarrollo |

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENTE                            │
│          (Navegador Web / Dispositivo Móvil)            │
└────────────────────────┬────────────────────────────────┘
                         │ HTTPS
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   FRONTEND (React + Vite)               │
│  ┌──────────┐ ┌────────────┐ ┌──────────────────────┐  │
│  │  Páginas  │ │  Layouts   │ │  Componentes UI      │  │
│  │ Públicas  │ │  Admin     │ │  (Shadcn/UI +        │  │
│  │ Paciente  │ │  Paciente  │ │   Tailwind CSS)      │  │
│  │ Admin     │ │  Público   │ │                      │  │
│  └──────────┘ └────────────┘ └──────────────────────┘  │
│  ┌──────────────────┐ ┌────────────────────────────┐   │
│  │  AuthContext      │ │  API Layer (Axios)         │   │
│  │  (JWT en localStorage) │ │  + React Query Cache │   │
│  └──────────────────┘ └────────────────────────────┘   │
└────────────────────────┬────────────────────────────────┘
                         │ /api/*
                         ▼
┌─────────────────────────────────────────────────────────┐
│                  BACKEND (Express.js)                    │
│  ┌──────────┐ ┌────────────┐ ┌──────────────────────┐  │
│  │  Routes   │ │ Middleware │ │  Controllers         │  │
│  │  /auth    │ │  auth.js   │ │  authController      │  │
│  │  /public  │ │  validate  │ │  publicController    │  │
│  │  /patient │ │  rateLimiter│ │  patientController  │  │
│  │  /admin   │ │            │ │  adminController     │  │
│  │  /notif.  │ │            │ │  notificationCtrl    │  │
│  └──────────┘ └────────────┘ └──────────────────────┘  │
│  ┌──────────────────┐ ┌────────────────────────────┐   │
│  │  Services         │ │  Prisma ORM               │   │
│  │  emailService     │ │  (Query Builder + Schema)  │  │
│  │  availabilityService│└────────────────────────────┘  │
│  └──────────────────┘                                   │
└────────────────────────┬────────────────────────────────┘
                         │ SQL
                         ▼
┌─────────────────────────────────────────────────────────┐
│              PostgreSQL 15 (Base de Datos)               │
│  ┌──────┐ ┌────────┐ ┌──────────┐ ┌────────────────┐  │
│  │users │ │services│ │appointments│ │clinic_profile │  │
│  └──────┘ └────────┘ └──────────┘ └────────────────┘  │
│  ┌────────────┐ ┌───────────────┐ ┌────────────────┐  │
│  │clinic_hours│ │schedule_blocks│ │contact_messages│  │
│  └────────────┘ └───────────────┘ └────────────────┘  │
│  ┌──────────────┐                                      │
│  │notifications │                                      │
│  └──────────────┘                                      │
└─────────────────────────────────────────────────────────┘
```

---

## 👥 Roles de Usuario

### 🔑 Administrador (`admin`)
| Funcionalidad | Descripción |
|---------------|-------------|
| Dashboard | Vista general con métricas clave |
| Gestión de Citas | Ver todas las citas, filtrar, cambiar estados |
| Crear Citas | Asignar citas manualmente a pacientes |
| Gestión de Servicios | CRUD completo de servicios odontológicos |
| Gestión de Pacientes | Ver listado de pacientes registrados |
| Horarios | Configurar horarios de atención por día |
| Bloqueos | Crear bloqueos temporales de agenda |
| Configuración | Editar datos de la clínica |

### 🦷 Paciente (`patient`)
| Funcionalidad | Descripción |
|---------------|-------------|
| Registro | Crear cuenta con datos personales |
| Reservar Cita | Seleccionar servicio, fecha y hora disponible |
| Mis Citas | Ver historial y citas futuras |
| Cancelar Cita | Cancelar citas pendientes o confirmadas |
| Notificaciones | Recibir y gestionar notificaciones |
| Perfil | Ver datos de la cuenta |

### 🌐 Visitante (sin cuenta)
| Funcionalidad | Descripción |
|---------------|-------------|
| Landing Page | Ver información de la clínica |
| Servicios | Explorar catálogo de servicios y precios |
| Contacto | Enviar mensaje vía formulario |
| WhatsApp | Contacto directo vía enlace de WhatsApp |

---

## 🗃️ Modelos de Base de Datos

### Modelo Entidad-Relación

```
User (1) ────── (N) Appointment
                         │
Service (1) ───── (N) Appointment

User (1) ────── (N) Notification

ClinicProfile (1)
ClinicHours (7 registros, uno por día)
ScheduleBlock (N — bloqueos temporales)
ContactMessage (N — mensajes del formulario)
```

### Detalle de Modelos

| Modelo | Campos Principales | Propósito |
|--------|-------------------|-----------|
| **User** | id, email, password, firstName, lastName, phone, role | Usuarios del sistema |
| **Service** | id, name, description, duration, price, isActive | Servicios odontológicos |
| **Appointment** | id, userId, serviceId, date, startTime, endTime, status, notes | Citas agendadas |
| **ClinicProfile** | id, name, phone, address, email, description, logo | Datos de la clínica |
| **ClinicHours** | id, dayOfWeek, openTime, closeTime, isOpen | Horarios semanales |
| **ScheduleBlock** | id, date, startTime, endTime, reason | Bloqueos de agenda |
| **Notification** | id, userId, title, message, isRead | Notificaciones |
| **ContactMessage** | id, name, phone, email, message | Mensajes de contacto |

---

## 📄 Páginas y Vistas Implementadas

### Páginas Públicas
| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/` | `HomePage` | Landing page con hero, servicios, testimonios y CTA |
| `/servicios` | `ServicesPage` | Catálogo completo de servicios con precios |
| `/contacto` | `ContactPage` | Formulario de contacto + info de la clínica |
| `/login` | `LoginPage` | Inicio de sesión |
| `/registro` | `RegisterPage` | Registro de nuevos pacientes |

### Panel del Paciente
| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/paciente/reservar` | `BookAppointment` | Formulario de reserva de citas |
| `/paciente/citas` | `MyAppointments` | Lista de citas del paciente |
| `/paciente/notificaciones` | `Notifications` | Centro de notificaciones |
| `/paciente/perfil` | `PatientProfile` | Perfil del paciente |

### Panel de Administración
| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/admin/citas` | `AdminAppointments` | Gestión de todas las citas |
| `/admin/citas/:id` | `AppointmentDetail` | Detalle de una cita específica |
| `/admin/citas/nueva` | `CreateAppointment` | Crear cita manualmente |
| `/admin/servicios` | `AdminServices` | CRUD de servicios |
| `/admin/pacientes` | `AdminPatients` | Listado de pacientes |
| `/admin/horarios` | `AdminSchedule` | Gestión de horarios y bloqueos |
| `/admin/configuracion` | `AdminSettings` | Configuración de la clínica |

---

## 🔐 Sistema de Autenticación y Seguridad

### Flujo de Autenticación

```
1. Usuario envía POST /api/auth/login (email + password)
2. Backend valida credenciales con bcryptjs
3. Si es válido → genera JWT con userId y role
4. Frontend almacena token en localStorage
5. Axios interceptor adjunta token en headers (Authorization: Bearer <token>)
6. Middleware auth.js verifica token en cada request protegida
7. Middleware authorize() verifica el rol del usuario
8. Si token expira → interceptor redirige a /login
```

### Capas de Seguridad
- **Hashing**: bcryptjs con 12 rondas de salt
- **JWT**: Tokens con expiración configurable (default: 7 días)
- **Rate Limiting**: Protección contra fuerza bruta en login y contacto
- **Validación**: express-validator en todos los endpoints de entrada
- **CORS**: Configurado para aceptar solo el frontend autorizado
- **Roles**: Middleware de autorización por rol en cada grupo de rutas

---

## 🔑 Credenciales de Demo

### Administrador
| Campo | Valor |
|-------|-------|
| **Email** | `admin@pidentalgroup.com` |
| **Contraseña** | `admin123` |

### Pacientes de Prueba
| Paciente | Email | Contraseña |
|----------|-------|------------|
| María García | `maria.garcia@email.com` | `paciente123` |
| Carlos Rodríguez | `carlos.rodriguez@email.com` | `paciente123` |
| Ana Martínez | `ana.martinez@email.com` | `paciente123` |
| José Hernández | `jose.hernandez@email.com` | `paciente123` |
| Laura López | `laura.lopez@email.com` | `paciente123` |
| Valentina Palacios | `valentina.p@email.com` | `paciente123` |
| Diego Fernández | `diego.f@email.com` | `paciente123` |

> ⚠️ Estas credenciales son solo para demo/desarrollo. En producción se deben cambiar.

---

## 🌐 URLs de Acceso

| Entorno | URL | Notas |
|---------|-----|-------|
| **Frontend (Dev)** | `http://localhost:8080` | Vite dev server |
| **Backend API** | `http://localhost:3000/api` | Express server |
| **Prisma Studio** | `http://localhost:5555` | Explorador visual de BD |

### Endpoints API Principales

```
AUTH
  POST   /api/auth/register     — Registro de usuario
  POST   /api/auth/login        — Inicio de sesión
  GET    /api/auth/me           — Perfil del usuario autenticado

PÚBLICO
  GET    /api/public/clinic     — Info de la clínica + horarios
  GET    /api/public/services   — Listado de servicios
  GET    /api/public/availability?date=YYYY-MM-DD&duration=30
  POST   /api/public/contact    — Enviar mensaje de contacto

PACIENTE (requiere auth + role=patient)
  GET    /api/patient/profile
  GET    /api/patient/appointments
  POST   /api/patient/appointments
  PATCH  /api/patient/appointments/:id/cancel

ADMIN (requiere auth + role=admin|staff)
  GET    /api/admin/dashboard
  GET    /api/admin/appointments
  PATCH  /api/admin/appointments/:id/status
  POST   /api/admin/appointments/manual
  GET    /api/admin/patients
  CRUD   /api/admin/services
  GET    /api/admin/schedule
  POST   /api/admin/schedule
  POST   /api/admin/schedule/blocks
  DELETE /api/admin/schedule/blocks/:id
  GET    /api/admin/clinic
  PATCH  /api/admin/clinic

NOTIFICACIONES (requiere auth)
  GET    /api/notifications
  PATCH  /api/notifications/:id/read
  PATCH  /api/notifications/read-all
```

---

## 📊 Servicios Odontológicos Configurados

| # | Servicio | Categoría | Duración | Precio |
|---|----------|-----------|----------|--------|
| 1 | Limpieza Dental | Preventivo | 45 min | $35 |
| 2 | Evaluación Odontológica | Diagnóstico | 30 min | $25 |
| 3 | Blanqueamiento Dental | Estética | 60 min | $120 |
| 4 | Ortodoncia – Consulta Inicial | Ortodoncia | 45 min | $40 |
| 5 | Extracción Simple | Cirugía | 30 min | $45 |
| 6 | Restauración con Resina | Restaurativa | 40 min | $50 |
| 7 | Endodoncia (Tratamiento de Conducto) | Endodoncia | 90 min | $150 |
| 8 | Revisión General | Preventivo | 20 min | $20 |
| 9 | Prótesis Dental | Prótesis | 60 min | $200 |
| 10 | Odontopediatría | Odontopediatría | 30 min | $30 |

---

## 🕐 Horarios de Atención

| Día | Horario |
|-----|---------|
| Lunes | 09:00 – 19:00 |
| Martes | 09:00 – 19:00 |
| Miércoles | 09:00 – 19:00 |
| Jueves | 09:00 – 19:00 |
| Viernes | 09:00 – 19:00 |
| Sábado | 09:00 – 13:00 |
| Domingo | Cerrado |

---

## 📸 Descripción Visual de Funcionalidades

### 🏠 Página de Inicio (Home)
La landing page presenta un hero section con fondo oscuro degradado (dark teal/navy), el logo de Palacios Iucci Dental Group a la derecha, el slogan "Tu sonrisa es nuestra pasión" con la palabra "pasión" destacada en verde menta, y dos botones de acción: "Reservar Cita" (verde menta) y "Ver Servicios" (outline). Debajo se muestran badges de "Profesionales certificados" y "Emergencias 24h".

### 🏥 Sección "¿Por qué elegirnos?"
Cuatro tarjetas en fila con iconos en verde menta: Atención Humana (❤️), Profesionales Certificados (🛡️), Emergencias 24h (🕐) y Toda la Familia (👨‍👩‍👧‍👦). Cada una con descripción breve.

### 💼 Catálogo de Servicios
Tarjetas con borde sutil, etiqueta de categoría coloreada, nombre del servicio, descripción, duración y precio. Botón "Reservar" en verde menta. Layout de 3 columnas en desktop.

### ⭐ Testimonios
Tres tarjetas con estrellas amarillas (★★★★★), cita del paciente y nombre. Fondo blanco limpio.

### 📱 Vista Móvil
Menú hamburguesa, layout de una columna, tipografía ajustada, botones full-width. Totalmente responsive con Tailwind CSS.

### 🔐 Registro e Inicio de Sesión
Formularios centrados con el logo de la clínica arriba. Campos con validación visual, placeholders descriptivos y enlaces entre login/registro.

### 📋 Página de Contacto
Layout de dos columnas: izquierda con información de la clínica (dirección, teléfono, email, WhatsApp, horarios) y derecha con formulario de contacto. Incluye mini-mapa de ubicación.

---

## 📁 Estructura del Proyecto

```
citadental/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Esquema de base de datos
│   │   └── seed.js                # Datos iniciales (demo)
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js              # Conexión Prisma
│   │   ├── controllers/
│   │   │   ├── adminController.js
│   │   │   ├── authController.js
│   │   │   ├── notificationController.js
│   │   │   ├── patientController.js
│   │   │   └── publicController.js
│   │   ├── middleware/
│   │   │   ├── auth.js            # JWT + autorización por rol
│   │   │   ├── rateLimiter.js     # Rate limiting
│   │   │   └── validate.js        # Validación de inputs
│   │   ├── routes/
│   │   │   ├── admin.js
│   │   │   ├── auth.js
│   │   │   ├── notifications.js
│   │   │   ├── patient.js
│   │   │   └── public.js
│   │   ├── services/
│   │   │   ├── availabilityService.js  # Cálculo de slots
│   │   │   └── emailService.js         # Envío de emails
│   │   └── server.js              # Entry point del backend
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/            # Componentes reutilizables + Shadcn UI
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx     # Contexto de autenticación
│   │   ├── data/
│   │   │   └── mockData.ts        # Datos mock (fallback)
│   │   ├── hooks/                 # Custom hooks
│   │   ├── layouts/
│   │   │   ├── AdminLayout.tsx
│   │   │   ├── PatientLayout.tsx
│   │   │   └── PublicLayout.tsx
│   │   ├── lib/
│   │   │   └── api.ts             # Cliente Axios + interceptores
│   │   ├── pages/
│   │   │   ├── admin/             # 7 vistas de administración
│   │   │   ├── patient/           # 4 vistas de paciente
│   │   │   └── public/            # 5 vistas públicas
│   │   ├── App.tsx                # Router principal
│   │   └── main.tsx               # Entry point
│   ├── vite.config.ts
│   └── package.json
├── ecosystem.config.js            # Config PM2 (producción)
├── iniciar.sh                     # Script de gestión (start/stop/status)
├── start.sh                       # Script de inicio automático
├── README.md
├── SETUP_LOCAL.md                 # Guía de instalación local
└── PRESENTACION_PROYECTO.md       # Este documento
```

---

## 📈 Estado Actual del Proyecto

### ✅ Completado
- [x] Diseño y desarrollo del frontend completo (React + TypeScript)
- [x] Backend API REST con Express.js
- [x] Base de datos PostgreSQL con Prisma ORM
- [x] Sistema de autenticación JWT con roles
- [x] CRUD completo de servicios
- [x] Sistema de reserva de citas con disponibilidad en tiempo real
- [x] Panel administrativo funcional
- [x] Panel del paciente funcional
- [x] Sistema de notificaciones
- [x] Formulario de contacto con envío de emails
- [x] Datos de demo (seed) con 10 servicios, 7 pacientes y citas de ejemplo
- [x] Rate limiting y validación de seguridad
- [x] Diseño responsive (desktop + móvil)
- [x] Configuración de producción con PM2
- [x] Documentación técnica (README, SETUP_LOCAL)

### 🔄 Próximos Pasos Sugeridos
- [ ] Panel de staff (rol intermedio entre admin y paciente)
- [ ] Reportes y estadísticas avanzadas (gráficos de citas por mes, ingresos)
- [ ] Recordatorios automáticos por email/SMS antes de la cita
- [ ] Integración con Google Calendar
- [ ] Sistema de pagos en línea
- [ ] Galería de casos (antes/después)
- [ ] Blog de salud dental
- [ ] PWA (Progressive Web App) para instalación en móvil
- [ ] Integración con WhatsApp Business API
- [ ] Deploy en producción (VPS, Railway, Render o similar)
- [ ] Dominio personalizado (ej: citadental.pidentalgroup.com)
- [ ] Certificado SSL

---

## 🎨 Identidad Visual

| Elemento | Valor |
|----------|-------|
| **Color primario** | Dark Teal / Navy (#2D3E50 aprox.) |
| **Color acento** | Verde menta / Teal (#5BBFAD aprox.) |
| **Tipografía** | Sistema (Inter / sans-serif) |
| **Logo** | Diente estilizado con texto "Palacios Iucci Dental Group" |
| **Estilo** | Moderno, limpio, profesional, minimalista |

---

## 📝 Notas Técnicas

- El frontend se sirve como archivos estáticos desde el backend en producción (`frontend/dist`)
- El backend corre en puerto 3000 y el frontend dev server en 8080
- Vite proxy redirige `/api` al backend durante desarrollo
- La base de datos se puede explorar visualmente con `npx prisma studio`
- Los emails en desarrollo se envían a Ethereal (no llegan a correos reales)

---

> **Documento generado:** Mayo 2026  
> **Proyecto:** CitaDental — PALACIOS IUCCI DENTAL GROUP  
> **Versión:** 1.0  
> **Equipo de desarrollo:** Desarrollo asistido por IA
