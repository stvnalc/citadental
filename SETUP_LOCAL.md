# 🦷 CitaDental — Guía de Instalación Local

Guía paso a paso para configurar **CitaDental** en tu computadora local.

> ⏱ Tiempo estimado: 15-20 minutos

---

## 📋 Tabla de Contenidos

1. [Requisitos Previos](#1--requisitos-previos)
2. [Instalar PostgreSQL](#2--instalar-postgresql)
3. [Crear Base de Datos y Usuario](#3--crear-base-de-datos-y-usuario)
4. [Clonar el Repositorio](#4--clonar-el-repositorio)
5. [Configurar Variables de Entorno](#5--configurar-variables-de-entorno)
6. [Instalar Dependencias](#6--instalar-dependencias)
7. [Configurar la Base de Datos con Prisma](#7--configurar-la-base-de-datos-con-prisma)
8. [Iniciar los Servidores de Desarrollo](#8--iniciar-los-servidores-de-desarrollo)
9. [Acceder a la Aplicación](#9--acceder-a-la-aplicación)
10. [Credenciales de Prueba](#10--credenciales-de-prueba)
11. [Solución de Problemas](#11--solución-de-problemas)

---

## 1. 📦 Requisitos Previos

Asegúrate de tener instalado:

| Software    | Versión mínima | Verificar con          |
|-------------|---------------|------------------------|
| **Node.js** | 18.x o superior | `node --version`     |
| **npm**     | 9.x o superior  | `npm --version`      |
| **PostgreSQL** | 14.x o superior | `psql --version`  |
| **Git**     | Cualquiera     | `git --version`       |

### Instalar Node.js (si no lo tienes)

- **Windows/Mac:** Descarga desde [https://nodejs.org](https://nodejs.org) (versión LTS recomendada)
- **Linux (Ubuntu/Debian):**
  ```bash
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt install -y nodejs
  ```

---

## 2. 🐘 Instalar PostgreSQL

### Windows

1. Descarga el instalador desde [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)
2. Ejecuta el instalador y sigue los pasos
3. **Anota la contraseña** que pongas para el usuario `postgres` (la necesitarás después)
4. Deja el puerto por defecto: **5432**
5. Al terminar, asegúrate de que el servicio esté corriendo (se inicia automáticamente)

### Mac

```bash
# Con Homebrew
brew install postgresql@15
brew services start postgresql@15
```

### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Verificar que PostgreSQL está corriendo

```bash
# Debería mostrar la versión sin errores
psql --version
```

---

## 3. 🗄️ Crear Base de Datos y Usuario

### Opción A: Comandos rápidos (recomendado)

#### Linux / Mac

```bash
# Entra como usuario postgres del sistema
sudo -u postgres psql
```

#### Windows

```bash
# Abre una terminal y ejecuta (usa la contraseña que pusiste al instalar)
psql -U postgres
```

#### Una vez dentro de `psql`, ejecuta estos comandos:

```sql
-- Crear el usuario
CREATE USER citadental WITH PASSWORD 'citadental123';

-- Crear la base de datos
CREATE DATABASE citadental OWNER citadental;

-- Dar permisos
GRANT ALL PRIVILEGES ON DATABASE citadental TO citadental;

-- Salir de psql
\q
```

### Opción B: Comando en una sola línea

#### Linux / Mac
```bash
sudo -u postgres psql -c "CREATE USER citadental WITH PASSWORD 'citadental123';"
sudo -u postgres psql -c "CREATE DATABASE citadental OWNER citadental;"
```

#### Windows (PowerShell)
```powershell
psql -U postgres -c "CREATE USER citadental WITH PASSWORD 'citadental123';"
psql -U postgres -c "CREATE DATABASE citadental OWNER citadental;"
```

### Verificar la conexión

```bash
psql -U citadental -d citadental -h localhost
# Debería conectarte sin errores. Escribe \q para salir.
```

> 💡 **Nota:** Si en Windows te da error de autenticación, revisa que en `pg_hba.conf` el método sea `md5` o `scram-sha-256` en lugar de `trust`. Este archivo suele estar en `C:\Program Files\PostgreSQL\15\data\`.

---

## 4. 📥 Clonar el Repositorio

```bash
git clone https://github.com/TU_USUARIO/pidentalgroup.git citadental
cd citadental
```

> Si ya tienes el proyecto descargado (por ejemplo, del `.zip`), simplemente descomprímelo y entra a la carpeta.

---

## 5. ⚙️ Configurar Variables de Entorno

### Backend (`.env`)

```bash
cd backend
cp .env.example .env
```

Abre el archivo `backend/.env` con tu editor favorito y configúralo así:

```env
# ═══════════════════════════════════════════
# BASE DE DATOS
# ═══════════════════════════════════════════
# Formato: postgresql://USUARIO:CONTRASEÑA@HOST:PUERTO/NOMBRE_BD
DATABASE_URL="postgresql://citadental:citadental123@localhost:5432/citadental?schema=public"

# ═══════════════════════════════════════════
# AUTENTICACIÓN JWT
# ═══════════════════════════════════════════
JWT_SECRET="mi-clave-secreta-cambiar-en-produccion"
JWT_EXPIRES_IN="7d"

# ═══════════════════════════════════════════
# SERVIDOR
# ═══════════════════════════════════════════
PORT=3001
NODE_ENV=development

# ═══════════════════════════════════════════
# EMAIL (Nodemailer) — OPCIONAL para desarrollo
# ═══════════════════════════════════════════
# Si no configuras esto, los emails se simularán con Ethereal
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
CONTACT_EMAIL=contacto@citadental.cc

# ═══════════════════════════════════════════
# CORS
# ═══════════════════════════════════════════
FRONTEND_URL=http://localhost:8080
```

> ⚠️ **IMPORTANTE:** El `PORT` del backend debe ser **3001** para que funcione con el proxy del frontend en desarrollo. El frontend (Vite) corre en el puerto **8080** y reenvía las peticiones `/api` al backend en `localhost:3001`.

### Frontend (`.env`)

```bash
cd ../frontend
```

Crea o edita el archivo `frontend/.env`:

```env
VITE_API_URL=/api
```

> Esto es todo lo que necesita el frontend. El proxy de Vite se encarga de redirigir `/api` al backend.

---

## 6. 📦 Instalar Dependencias

Abre **dos terminales** (o pestañas) y ejecuta:

### Terminal 1 — Backend

```bash
cd citadental/backend
npm install
```

### Terminal 2 — Frontend

```bash
cd citadental/frontend
npm install
```

> ⏳ La primera vez puede tardar unos minutos mientras descarga todos los paquetes.

---

## 7. 🗃️ Configurar la Base de Datos con Prisma

En la **Terminal 1 (backend)**, ejecuta estos comandos en orden:

### Paso 1: Generar el cliente Prisma

```bash
npx prisma generate
```

Esto genera el cliente de Prisma que la aplicación usa para hablar con la base de datos.

### Paso 2: Crear las tablas en la base de datos

```bash
npx prisma db push
```

> ℹ️ Este comando lee el archivo `prisma/schema.prisma` y crea todas las tablas necesarias en tu base de datos PostgreSQL.

### Paso 3: Cargar datos de prueba (seed)

```bash
node prisma/seed.js
```

Esto crea:
- ✅ Perfil de la clínica con horarios
- ✅ 1 usuario administrador
- ✅ 7 pacientes de prueba
- ✅ 10 servicios odontológicos
- ✅ 10 citas de ejemplo
- ✅ Notificaciones de muestra

### Comando "todo en uno" (alternativa)

Si prefieres un solo comando que haga todo:

```bash
npm run setup
```

---

## 8. 🚀 Iniciar los Servidores de Desarrollo

Necesitas **dos terminales** abiertas simultáneamente:

### Terminal 1 — Backend (API)

```bash
cd citadental/backend
npm run dev
```

Deberías ver:
```
🦷 CitaDental API running on http://localhost:3001
📦 Database connected successfully
```

### Terminal 2 — Frontend

```bash
cd citadental/frontend
npm run dev
```

Deberías ver:
```
  VITE v5.x.x  ready in XXX ms

  ➜  Local:   http://localhost:8080/
  ➜  Network: http://X.X.X.X:8080/
```

> ⚠️ **No cierres ninguna de las dos terminales** mientras trabajas. Ambos servidores deben estar corriendo al mismo tiempo.

---

## 9. 🌐 Acceder a la Aplicación

Abre tu navegador y visita:

| Recurso               | URL                                |
|-----------------------|------------------------------------|
| 🌐 **Aplicación**     | http://localhost:8080              |
| 📡 **API (directa)**  | http://localhost:3001/api          |
| 🗄️ **Prisma Studio**  | Ejecuta `npx prisma studio` en backend |

---

## 10. 🔑 Credenciales de Prueba

Después de ejecutar el seed, estas cuentas están disponibles:

| Rol        | Email                        | Contraseña     |
|------------|------------------------------|----------------|
| **Admin**  | admin@pidentalgroup.com      | admin123        |
| **Paciente** | maria.garcia@email.com     | paciente123     |
| **Paciente** | carlos.rodriguez@email.com | paciente123     |
| **Paciente** | ana.martinez@email.com     | paciente123     |
| **Paciente** | luis.fernandez@email.com   | paciente123     |
| **Paciente** | valentina.palacios@email.com | paciente123   |
| **Paciente** | diego.herrera@email.com    | paciente123     |
| **Paciente** | isabella.lopez@email.com   | paciente123     |

---

## 11. 🔧 Solución de Problemas

### ❌ Error: `P1001 - Can't reach database server`

**Causa:** PostgreSQL no está corriendo o los datos de conexión son incorrectos.

**Solución:**
```bash
# Verificar que PostgreSQL está corriendo
# Linux:
sudo systemctl status postgresql

# Mac:
brew services list

# Windows: Busca "Services" en el menú de inicio y busca "postgresql"
```

También verifica que `DATABASE_URL` en `backend/.env` tiene los datos correctos (usuario, contraseña, puerto, nombre de la BD).

---

### ❌ Error: `FATAL: password authentication failed for user "citadental"`

**Causa:** El usuario o la contraseña no coinciden.

**Solución:**
```bash
# Entra como postgres y recrea el usuario
sudo -u postgres psql

# Dentro de psql:
DROP USER IF EXISTS citadental;
CREATE USER citadental WITH PASSWORD 'citadental123';
GRANT ALL PRIVILEGES ON DATABASE citadental TO citadental;
\q
```

---

### ❌ Error: `FATAL: database "citadental" does not exist`

**Causa:** La base de datos no fue creada.

**Solución:**
```bash
sudo -u postgres psql -c "CREATE DATABASE citadental OWNER citadental;"
```

---

### ❌ Error: `prisma: command not found`

**Causa:** Prisma no está instalado o no se ejecutaron las dependencias.

**Solución:**
```bash
cd backend
npm install
npx prisma generate
```

> Siempre usa `npx prisma` (con `npx`) en lugar de solo `prisma`.

---

### ❌ Error: `This host is not allowed` (Vite)

**Causa:** Vite bloquea conexiones de hosts no reconocidos.

**Solución:** Ya está configurado en `vite.config.ts` con `allowedHosts: true`. Si aún aparece, asegúrate de acceder por `http://localhost:8080`.

---

### ❌ Error: `EADDRINUSE: address already in use`

**Causa:** El puerto ya está siendo usado por otro proceso.

**Solución:**
```bash
# Ver qué proceso usa el puerto (ejemplo: 3001)
# Linux/Mac:
lsof -i :3001
kill -9 <PID>

# Windows:
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

---

### ❌ El frontend carga pero no muestra datos / "Network Error"

**Causa:** El backend no está corriendo o el proxy no funciona.

**Solución:**
1. Verifica que el backend esté corriendo en el puerto **3001** (`PORT=3001` en `backend/.env`)
2. Verifica que el frontend tenga `VITE_API_URL=/api` en `frontend/.env`
3. Reinicia ambos servidores
4. Prueba la API directamente: abre `http://localhost:3001/api/public/clinic` en el navegador

---

### ❌ Error al hacer seed: `Unique constraint failed`

**Causa:** Ya existen datos en la base de datos.

**Solución:** El seed usa `upsert` para la mayoría de registros, pero si falla:
```bash
cd backend
npx prisma db push --force-reset
node prisma/seed.js
```

> ⚠️ `--force-reset` **borra todos los datos** de la base de datos.

---

### 💡 Consejos Generales

- Si algo falla, el primer paso siempre es **verificar que PostgreSQL está corriendo**
- Los archivos `.env` **nunca** se suben a Git (están en `.gitignore`)
- Si cambias `schema.prisma`, ejecuta `npx prisma db push` y luego `npx prisma generate`
- Usa `npx prisma studio` para ver y editar los datos directamente en el navegador
- Los emails no se enviarán en desarrollo a menos que configures SMTP. Se simularán con [Ethereal](https://ethereal.email/)

---

## 📚 Referencia Rápida de Comandos

```bash
# ── Desde backend/ ──────────────────────
npm run dev              # Iniciar backend en modo desarrollo
npm run setup            # Instalación completa (install + prisma + seed)
npx prisma studio        # Abrir editor visual de BD
npx prisma db push       # Sincronizar esquema con la BD
npx prisma generate      # Regenerar el cliente Prisma
node prisma/seed.js      # Recargar datos de prueba

# ── Desde frontend/ ─────────────────────
npm run dev              # Iniciar frontend en modo desarrollo
npm run build            # Generar build de producción
npm run preview          # Previsualizar build de producción
```

---

¿Tienes problemas? Abre un **Issue** en el repositorio o contacta al equipo de desarrollo.

© 2026 CitaDental — PALACIOS IUCCI DENTAL GROUP
