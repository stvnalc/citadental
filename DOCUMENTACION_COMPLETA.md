# Documentación Técnica Completa — CitaDental

## 1. Visión General del Proyecto

**CitaDental** es un sistema integral de gestión de citas odontológicas basado en una arquitectura cliente-servidor (Single Page Application y API REST). Está diseñado para manejar los flujos de pacientes (reserva de citas, historial, notificaciones) y administradores (gestión de agenda, servicios, pacientes y configuración de la clínica).

### Tecnologías Principales
- **Frontend:** React 18, TypeScript, Vite, React Router DOM v6, Tailwind CSS, shadcn/ui.
- **Backend:** Node.js, Express.js (v4.21.2).
- **Base de Datos:** PostgreSQL.
- **ORM:** Prisma (v6.4.1).
- **Seguridad:** JWT (JSON Web Tokens), bcryptjs, express-rate-limit.

---

## 2. Arquitectura del Sistema

La aplicación sigue un patrón de diseño desacoplado donde el frontend y el backend se comunican exclusivamente a través de una API REST utilizando formato JSON.

### Diagrama de Arquitectura
```text
┌─────────────────────┐     HTTP/JSON      ┌─────────────────────┐
│                     │ ◄───────────────►  │                     │
│   Frontend (SPA)    │    Puerto 5173     │   Backend (API)     │
│   React + Vite      │                    │   Express + Prisma  │
│                     │                    │                     │
└─────────────────────┘                    └──────────┬──────────┘
                                                      │
                                                      │ Prisma ORM
                                                      ▼
                                           ┌─────────────────────┐
                                           │    PostgreSQL DB    │
                                           └─────────────────────┘
```

---

## 3. Frontend (React + Vite)

El frontend está estructurado como una **Single Page Application (SPA)**. La gestión del estado global de autenticación se realiza mediante **Context API** (`AuthContext`), mientras que el estado local de los componentes utiliza Hooks estándar de React (`useState`, `useEffect`).

### 3.1 Estructura de Rutas y Layouts
Las rutas están protegidas mediante el componente `ProtectedRoute`, que verifica el token JWT y el rol del usuario.

1. **Rutas Públicas (`PublicLayout`)**
   - `/` - Inicio (Servicios destacados)
   - `/servicios` - Lista completa de servicios
   - `/contacto` - Información y formulario de contacto
   - `/login`, `/registro` - Autenticación

2. **Rutas de Paciente (`PatientLayout` - requiere rol `patient`)**
   - `/me` - Dashboard del paciente
   - `/me/citas` - Historial de citas propias
   - `/me/citas/nueva` - Interfaz para agendar nueva cita
   - `/me/perfil` - Perfil de usuario
   - `/me/notificaciones` - Centro de notificaciones

3. **Rutas de Administrador (`AdminLayout` - requiere rol `admin` o `staff`)**
   - `/admin` - Dashboard con métricas y resumen
   - `/admin/citas` - Gestión general de citas con exportación a PDF
   - `/admin/citas/:id` - Detalles y cambio de estado de la cita
   - `/admin/citas/nueva` - Agendamiento manual por parte de la clínica
   - `/admin/servicios` - CRUD de servicios odontológicos
   - `/admin/horarios` - Configuración de disponibilidad y bloqueos
   - `/admin/pacientes` - Directorio de pacientes
   - `/admin/configuracion` - Ajustes de la clínica

### 3.2 Capa de API y Cliente HTTP
Las peticiones al backend se gestionan a través de una instancia centralizada de Axios en `src/lib/api.ts`.
- **Interceptores:** Se adjunta automáticamente el token JWT almacenado en `localStorage` a cada petición.
- **Manejo de Errores:** Si el servidor responde con error `401 Unauthorized`, el interceptor automáticamente limpia la sesión y redirige al usuario a la pantalla de login.

### 3.3 Componentes y UI
La interfaz utiliza **Tailwind CSS** para los estilos y la librería **shadcn/ui** construida sobre Radix UI para componentes accesibles (Diálogos, Dropdowns, Tablas, Badges, etc.). Para alertas emergentes se utiliza `sonner`.

---

## 4. Backend (Express.js + Prisma)

El backend sigue una arquitectura adaptada del patrón **MVC (Model-View-Controller)**:
`Rutas -> Middlewares (Auth, Validaciones) -> Controladores -> Prisma ORM -> Base de datos`

### 4.1 Modelo de Datos (Prisma)
El archivo `schema.prisma` define las siguientes entidades clave:

- **User:** Maneja autenticación y roles (`admin`, `staff`, `patient`).
- **Service:** Catálogo de tratamientos (nombre, duración, precio, estado activo).
- **Appointment:** Representa una cita. Relaciona a un `User` con un `Service`. Campos: `date`, `startTime`, `endTime`, `status` (pending, confirmed, completed, cancelled), `notes`.
- **Notification:** Avisos del sistema dirigidos a usuarios específicos.
- **ClinicProfile & ClinicHours:** Información pública y horario laboral de la clínica.
- **ScheduleBlock:** Bloqueos excepcionales en la agenda (ej. vacaciones, almuerzo).

### 4.2 Endpoints Principales de la API

#### Autenticación (`/api/auth`)
- `POST /login` - Retorna token JWT y datos de usuario.
- `POST /register` - Creación de nueva cuenta de paciente.
- `GET /me` - Verificación de sesión actual.

#### Administración (`/api/admin/*`)
- `GET /dashboard` - Métricas (citas hoy/semana, pacientes totales).
- `GET /appointments` - Listado paginado y filtrado de citas.
- `GET /appointments/report` - Exportación de citas a PDF (`.pdf`) filtrando por día/mes/año.
- `PATCH /appointments/:id/status` - Actualiza estado de cita y notifica al paciente.
- `GET, POST, PATCH, DELETE /services` - Gestión del catálogo de servicios.
- `POST /schedule/blocks` - Crea excepciones en la agenda.

#### Pacientes (`/api/me/*`)
- `GET /appointments` - Citas del usuario autenticado.
- `POST /appointments` - Reserva una nueva cita verificando disponibilidad.
- `PATCH /appointments/:id/cancel` - Cancelar cita pendiente.

#### Públicos (`/api/*`)
- `GET /availability` - Algoritmo que calcula los "slots" de tiempo disponibles cruzando el horario de la clínica, los bloques de horario y las citas ya existentes, tomando en cuenta la duración del servicio.
- `GET /services`, `GET /clinic` - Información pública.

### 4.3 Servicio de Disponibilidad (`availabilityService.js`)
Es el núcleo de la lógica de negocio para la reserva de citas. Sus pasos son:
1. Obtener horario laboral de la clínica para el día solicitado.
2. Generar fragmentos (slots) de 30 minutos.
3. Excluir slots que choquen con citas previamente agendadas (status distinto de cancelado).
4. Excluir slots que coincidan con bloqueos manuales (`ScheduleBlock`).
5. Verificar si hay suficientes slots continuos para acomodar la duración del servicio.

---

## 5. Seguridad

- **JWT:** Tokens firmados con vigencia de 7 días.
- **RBAC (Role-Based Access Control):** Middleware `authorize('admin', 'staff')` asegura que las rutas administrativas no sean accesibles por pacientes.
- **Hash de Contraseñas:** Encriptación con `bcryptjs` en la base de datos.
- **Validación de Datos:** Uso exhaustivo de `express-validator` en los controladores para sanear entradas.
- **Rate Limiting:** Prevención de fuerza bruta limitando peticiones repetitivas desde la misma IP.

---

## 6. Configuración y Despliegue Local

1. **Base de Datos:** Requiere PostgreSQL en ejecución (puerto 5432).
2. **Backend:**
   - Crear archivo `.env` basándose en `.env.example` con la variable `DATABASE_URL`.
   - Ejecutar `npm install`.
   - Inicializar BD: `npx prisma migrate dev` y `npx prisma db seed`.
   - Iniciar servidor: `npm run dev`.
3. **Frontend:**
   - Crear `.env` con `VITE_API_URL=http://localhost:3001/api`.
   - Ejecutar `npm install`.
   - Iniciar cliente: `npm run dev`.

Ambos entornos pueden levantarse simultáneamente mediante los scripts `iniciar.sh` o `start.sh` en la raíz del proyecto.
