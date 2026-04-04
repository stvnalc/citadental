#!/bin/bash
# ═══════════════════════════════════════════════════════
#  CitaDental - Script de Inicio Rápido
#  Palacios Iucci Dental Group
# ═══════════════════════════════════════════════════════

set -e

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m'

PROJECT_DIR="/home/ubuntu/citadental"
BACKEND_DIR="$PROJECT_DIR/backend"

show_help() {
  echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
  echo -e "${CYAN}  🦷 CitaDental - Comandos disponibles${NC}"
  echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
  echo ""
  echo -e "  ${GREEN}./iniciar.sh${NC}            Iniciar todo (PostgreSQL + App)"
  echo -e "  ${GREEN}./iniciar.sh start${NC}      Iniciar todo (PostgreSQL + App)"
  echo -e "  ${GREEN}./iniciar.sh stop${NC}       Detener todo"
  echo -e "  ${GREEN}./iniciar.sh restart${NC}    Reiniciar la aplicación"
  echo -e "  ${GREEN}./iniciar.sh status${NC}     Ver estado de los servicios"
  echo -e "  ${GREEN}./iniciar.sh logs${NC}       Ver logs en tiempo real"
  echo -e "  ${GREEN}./iniciar.sh seed${NC}       Recargar datos de prueba"
  echo -e "  ${GREEN}./iniciar.sh help${NC}       Mostrar esta ayuda"
  echo ""
}

start_postgres() {
  echo -e "${YELLOW}📦 Iniciando PostgreSQL...${NC}"
  sudo pg_ctlcluster 15 main start 2>/dev/null || true
  sleep 2
  if pg_isready -q; then
    echo -e "${GREEN}✅ PostgreSQL está listo${NC}"
  else
    echo -e "${RED}❌ Error: PostgreSQL no pudo iniciar${NC}"
    exit 1
  fi
}

stop_postgres() {
  echo -e "${YELLOW}📦 Deteniendo PostgreSQL...${NC}"
  sudo pg_ctlcluster 15 main stop 2>/dev/null || true
  echo -e "${GREEN}✅ PostgreSQL detenido${NC}"
}

start_app() {
  echo -e "${YELLOW}🚀 Iniciando CitaDental...${NC}"
  cd "$PROJECT_DIR"
  pm2 delete citadental 2>/dev/null || true
  pm2 start ecosystem.config.js
  sleep 2
  
  if pm2 list | grep -q "online"; then
    echo ""
    echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}  🦷 CitaDental está corriendo correctamente!${NC}"
    echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "  🌐 Aplicación:  ${CYAN}http://localhost:3000${NC}"
    echo -e "  📡 API:         ${CYAN}http://localhost:3000/api${NC}"
    echo ""
    echo -e "  👤 Admin:       admin@pidentalgroup.com / admin123"
    echo -e "  👤 Paciente:    maria.garcia@email.com / paciente123"
    echo ""
  else
    echo -e "${RED}❌ Error al iniciar CitaDental${NC}"
    pm2 logs citadental --lines 20 --nostream
    exit 1
  fi
}

stop_app() {
  echo -e "${YELLOW}🛑 Deteniendo CitaDental...${NC}"
  pm2 delete citadental 2>/dev/null || true
  echo -e "${GREEN}✅ CitaDental detenido${NC}"
}

seed_db() {
  echo -e "${YELLOW}🌱 Recargando datos de prueba...${NC}"
  cd "$BACKEND_DIR"
  node prisma/seed.js
  echo -e "${GREEN}✅ Base de datos recargada${NC}"
}

show_status() {
  echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
  echo -e "${CYAN}  🦷 Estado de CitaDental${NC}"
  echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
  echo ""
  
  echo -e "${YELLOW}PostgreSQL:${NC}"
  if pg_isready -q; then
    echo -e "  ${GREEN}● Activo${NC}"
  else
    echo -e "  ${RED}● Inactivo${NC}"
  fi
  echo ""
  
  echo -e "${YELLOW}Aplicación:${NC}"
  pm2 list
  echo ""
}

show_logs() {
  echo -e "${CYAN}📋 Logs de CitaDental (Ctrl+C para salir)${NC}"
  pm2 logs citadental
}

# ─── Main ───
case "${1:-start}" in
  start)
    start_postgres
    start_app
    ;;
  stop)
    stop_app
    stop_postgres
    ;;
  restart)
    stop_app
    sleep 1
    start_app
    ;;
  status)
    show_status
    ;;
  logs)
    show_logs
    ;;
  seed)
    seed_db
    ;;
  help|--help|-h)
    show_help
    ;;
  *)
    echo -e "${RED}Comando no reconocido: $1${NC}"
    show_help
    exit 1
    ;;
esac
