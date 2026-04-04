# 🦷 CitaDental — Palacios Iucci Dental Group

Sistema de gestión de citas odontológicas para **Palacios Iucci Dental Group**.

---

## 🚀 Inicio Rápido

```bash
cd /home/ubuntu/citadental
./iniciar.sh
```

Esto inicia PostgreSQL y la aplicación. La app estará disponible en:

| Recurso       | URL                          |
|---------------|------------------------------|
| 🌐 Aplicación | http://localhost:3000        |
| 📡 API        | http://localhost:3000/api    |

### Credenciales de prueba

| Rol      | Email                         | Contraseña    |
|----------|-------------------------------|---------------|
| Admin    | admin@pidentalgroup.com       | admin123      |
| Paciente | maria.garcia@email.com        | paciente123   |

---

## 📋 Comandos Disponibles

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

## 🛠 Comandos Manuales (sin el script)

### Iniciar PostgreSQL
```bash
sudo pg_ctlcluster 15 main start
```

### Iniciar la aplicación con PM2
```bash
cd /home/ubuntu/citadental
pm2 start ecosystem.config.js
```

### Detener la aplicación
```bash
pm2 delete citadental
```

### Detener PostgreSQL
```bash
sudo pg_ctlcluster 15 main stop
```

### Ver logs
```bash
pm2 logs citadental
```

### Ver estado
```bash
pm2 status
```

### Reiniciar app
```bash
pm2 restart citadental
```

### Recargar datos de prueba
```bash
cd /home/ubuntu/citadental/backend
node prisma/seed.js
```

### Migraciones de base de datos
```bash
cd /home/ubuntu/citadental/backend
npx prisma db push
npx prisma generate
```

---

## 📁 Estructura del Proyecto

```
citadental/
├── backend/           # API Express + Prisma
│   ├── src/
│   │   ├── server.js          # Servidor principal (sirve frontend + API)
│   │   ├── controllers/       # Controladores de rutas
│   │   ├── middleware/         # Auth, validación, rate limiting
│   │   ├── routes/            # Definición de rutas API
│   │   └── services/          # Lógica de negocio
│   ├── prisma/
│   │   ├── schema.prisma      # Esquema de base de datos
│   │   └── seed.js            # Datos de prueba
│   └── .env                   # Variables de entorno
├── frontend/          # React + Vite + Tailwind
│   ├── src/
│   │   ├── App.tsx            # Componente raíz
│   │   ├── pages/             # Páginas de la app
│   │   └── components/        # Componentes reutilizables
│   └── dist/                  # Build de producción (servido por Express)
├── ecosystem.config.js        # Configuración PM2
├── iniciar.sh                 # Script de inicio rápido
└── README.md                  # Este archivo
```

---

## ⚙️ Tecnologías

- **Backend:** Node.js, Express, Prisma ORM
- **Frontend:** React, TypeScript, Tailwind CSS, Shadcn/UI
- **Base de datos:** PostgreSQL 15
- **Proceso:** PM2
- **Auth:** JWT (JSON Web Tokens)

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
