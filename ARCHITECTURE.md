# 🏗️ Arquitectura del Sistema — CitaDental

## 1. Visión General

CitaDental sigue una arquitectura **cliente-servidor** desacoplada con comunicación vía **API REST**:

```
┌─────────────────────┐     HTTP/JSON      ┌─────────────────────┐
│                     │ ◄───────────────►  │                     │
│   Frontend (SPA)    │    Puerto 5173      │   Backend (API)     │
│   React + Vite      │                     │   Express + Prisma  │
│   Puerto 5173       │                     │   Puerto 3001       │
│                     │                     │                     │
└─────────────────────┘                     └──────────┬──────────┘
                                                       │
                                                       │ Prisma ORM
                                                       ▼
                                            ┌─────────────────────┐
                                            │    PostgreSQL DB     │
                                            └─────────────────────┘
```

## 2. Arquitectura del Frontend

### 2.1 Patrón: SPA con Context API

El frontend es una **Single Page Application** construida con React. La gestión de estado global se maneja con **Context API** (AuthContext) y estado local con hooks de React.

```
App.tsx (Router principal)
├── AuthProvider (contexto global de autenticación)
│
├── Rutas Públicas ─── PublicLayout
│   ├── HomePage          → GET /api/services
│   ├── ServicesPage      → GET /api/services
│   ├── ContactPage       → GET /api/clinic, POST /api/contact
│   ├── LoginPage         → POST /api/auth/login
│   └── RegisterPage      → POST /api/auth/register
│
├── Rutas Paciente ─── PatientLayout (ProtectedRoute role=patient)
│   ├── PatientDashboard  → GET /api/me/appointments, GET /api/notifications
│   ├── BookAppointment   → GET /api/services, GET /api/availability, POST /api/me/appointments
│   ├── MyAppointments    → GET /api/me/appointments, PATCH cancel
│   ├── PatientProfile    → GET /api/me/profile
│   └── Notifications     → GET /api/notifications, PATCH read
│
└── Rutas Admin ─── AdminLayout (ProtectedRoute role=admin)
    ├── AdminDashboard    → GET /api/admin/dashboard
    ├── AdminAppointments → GET /api/admin/appointments
    ├── AppointmentDetail → GET + PATCH /api/admin/appointments/:id/status
    ├── CreateAppointment → GET patients + services, POST manual
    ├── AdminServices     → CRUD /api/admin/services
    ├── AdminSchedule     → GET/POST /api/admin/schedule + blocks
    ├── AdminPatients     → GET /api/admin/patients
    └── AdminSettings     → GET/PATCH /api/admin/clinic
```

### 2.2 Capa de Comunicación (api.ts)

```typescript
// Patrón: Axios instance con interceptores
const api = axios.create({ baseURL: '/api' });

// Interceptor Request: Inyecta JWT en Authorization header
api.interceptors.request.use(config => {
  const token = localStorage.getItem('citadental_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Interceptor Response: Redirige a login si 401
api.interceptors.response.use(res => res, err => {
  if (err.response?.status === 401) {
    // Limpia sesión y redirige
  }
});
```

Las funciones de la API están organizadas por módulo:
- `authAPI` — login, register, me
- `publicAPI` — clinic, services, availability, contact
- `patientAPI` — profile, appointments, booking
- `adminAPI` — dashboard, appointments, services, schedule, clinic, patients
- `notificationsAPI` — list, markRead, markAllRead

### 2.3 Flujo de Autenticación

```
1. Usuario envía credenciales → POST /api/auth/login
2. Backend valida y retorna { token, user }
3. Frontend almacena token en localStorage
4. AuthContext actualiza estado global (user, isAuthenticated, role)
5. Cada request subsecuente incluye: Authorization: Bearer <token>
6. ProtectedRoute verifica rol antes de renderizar componentes
7. Si token expira → interceptor 401 → redirect a /login
```

### 2.4 Componentes y Layouts

- **PublicLayout**: Navbar con links públicos, muestra "Mi Panel" si autenticado
- **PatientLayout**: Sidebar con navegación de paciente, badge de notificaciones, logout
- **AdminLayout**: Sidebar con navegación administrativa, logout
- **ProtectedRoute**: HOC que verifica autenticación y rol antes de renderizar

## 3. Arquitectura del Backend

### 3.1 Patrón: MVC (Model-View-Controller) adaptado

```
Routes (definición de endpoints)
  ↓
Middleware (auth, validate, rateLimiter)
  ↓
Controllers (lógica de negocio)
  ↓
Prisma ORM (acceso a datos)
  ↓
PostgreSQL
```

### 3.2 Middleware Chain

```
Request → CORS → JSON Parser → Rate Limiter → Route Matcher
  → authenticate (JWT verify) → authorize (role check) → validate (express-validator)
    → Controller → Response
```

### 3.3 Modelo de Datos (Prisma Schema)

```
User (id, firstName, lastName, email, phone, password, role)
  ├── 1:N → Appointment
  └── 1:N → Notification

Service (id, name, description, duration, price, isActive)
  └── 1:N → Appointment

Appointment (id, userId, serviceId, date, startTime, endTime, status, notes)
  ├── N:1 → User
  └── N:1 → Service

ClinicProfile (id, name, phone, address, email, description)

ClinicHours (id, dayOfWeek, openTime, closeTime, isOpen)

ScheduleBlock (id, date, startTime, endTime, reason)

Notification (id, userId, title, message, isRead)
```

### 3.4 Servicio de Disponibilidad

El sistema calcula slots disponibles considerando:
1. Horario de la clínica para ese día de la semana
2. Citas ya agendadas (no canceladas)
3. Bloqueos de horario activos
4. Duración del servicio seleccionado

```
GET /api/availability?date=2026-03-16&duration=45

→ Obtener clinicHours para el día
→ Generar slots cada 30 min dentro del horario
→ Filtrar slots ocupados por citas existentes
→ Filtrar slots bloqueados por scheduleBlocks
→ Retornar: [{ startTime: "09:00", available: true }, ...]
```

## 4. Seguridad

| Capa | Mecanismo | Implementación |
|------|-----------|----------------|
| Autenticación | JWT | jsonwebtoken, tokens de 7 días |
| Autorización | RBAC | Middleware authorize('admin', 'staff') |
| Contraseñas | Hash | bcryptjs con salt rounds |
| Validación | Server-side | express-validator en cada ruta |
| Rate Limiting | Throttling | express-rate-limit (100 req/15min) |
| CORS | Whitelist | Solo localhost:5173 en desarrollo |
| XSS | Sanitize | Express JSON parser + React DOM escaping |

## 5. Flujos Principales

### 5.1 Reserva de Cita (Paciente)
```
1. Paciente selecciona servicio → frontend obtiene duración
2. Paciente selecciona fecha → GET /api/availability?date&duration
3. Backend calcula y retorna slots disponibles
4. Paciente selecciona hora → POST /api/me/appointments
5. Backend valida disponibilidad, crea cita con status 'pending'
6. Se crea notificación automática para el paciente
```

### 5.2 Gestión de Cita (Admin)
```
1. Admin ve lista de citas → GET /api/admin/appointments
2. Puede filtrar por estado y fecha
3. Abre detalle → ve info completa del paciente y servicio
4. Cambia estado → PATCH /api/admin/appointments/:id/status
5. Backend actualiza estado y crea notificación para el paciente
```

## 6. Decisiones de Diseño

1. **¿Por qué SPA y no SSR?** — La aplicación es altamente interactiva (formularios, dashboards, actualizaciones en tiempo real). SPA ofrece mejor UX sin recargas de página.

2. **¿Por qué Context API y no Redux?** — El estado global es simple (solo autenticación). Context API es suficiente y evita boilerplate innecesario.

3. **¿Por qué Prisma?** — ORM type-safe con generación automática de tipos, migraciones declarativas y excelente DX para proyectos Node.js.

4. **¿Por qué JWT y no sesiones?** — Arquitectura stateless que no requiere almacenamiento de sesiones en servidor, ideal para APIs REST desacopladas.

5. **¿Por qué datos mock como fallback?** — Garantiza que el frontend sea utilizable para demostración incluso si el backend no está disponible (graceful degradation).

6. **¿Por qué Tailwind CSS?** — Productividad alta con clases utilitarias, consistencia visual, y excelente soporte para diseño responsive.

## 7. Diagrama de Componentes

```
                    ┌───────────────────────────────────────┐
                    │            FRONTEND (React)            │
                    │                                       │
                    │  ┌─────────┐  ┌──────────┐  ┌──────┐ │
                    │  │ Contexts │  │  Layouts  │  │Pages │ │
                    │  │ (Auth)   │  │ (3 tipos) │  │(15+) │ │
                    │  └────┬─────┘  └─────┬─────┘  └──┬───┘ │
                    │       │              │           │     │
                    │       └──────────────┼───────────┘     │
                    │                      │                 │
                    │              ┌───────┴────────┐        │
                    │              │   api.ts       │        │
                    │              │  (Axios + JWT) │        │
                    │              └───────┬────────┘        │
                    └─────────────────────┼─────────────────┘
                                          │ HTTP/JSON
                    ┌─────────────────────┼─────────────────┐
                    │            BACKEND (Express)           │
                    │              ┌───────┴────────┐        │
                    │              │    Routes      │        │
                    │              │ auth|admin|... │        │
                    │              └───────┬────────┘        │
                    │              ┌───────┴────────┐        │
                    │              │  Middleware     │        │
                    │              │ JWT|Validate   │        │
                    │              └───────┬────────┘        │
                    │              ┌───────┴────────┐        │
                    │              │  Controllers   │        │
                    │              └───────┬────────┘        │
                    │              ┌───────┴────────┐        │
                    │              │  Prisma ORM    │        │
                    │              └───────┬────────┘        │
                    └─────────────────────┼─────────────────┘
                                          │
                                ┌─────────┴──────────┐
                                │    PostgreSQL      │
                                └────────────────────┘
```

---

*Documento generado para defensa de proyecto — CitaDental © 2026*
