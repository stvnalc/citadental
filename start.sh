#!/bin/bash
# CitaDental - Startup Script
# Starts PostgreSQL, runs migrations, and starts the unified server

set -e

echo "🦷 Starting CitaDental..."

# Start PostgreSQL
echo "📦 Starting PostgreSQL..."
sudo pg_ctlcluster 15 main start 2>/dev/null || true
sleep 2

# Check PostgreSQL is ready
until pg_isready -q; do
  echo "⏳ Waiting for PostgreSQL..."
  sleep 1
done
echo "✅ PostgreSQL is ready"

# Run migrations
cd /home/ubuntu/citadental/backend
echo "📋 Running database migrations..."
npx prisma db push --accept-data-loss 2>/dev/null || true
npx prisma generate 2>/dev/null || true

# Check if database has data, seed if empty
USERS_COUNT=$(PGPASSWORD=citadental123 psql -h localhost -U citadental -d citadental -t -c "SELECT COUNT(*) FROM \"User\";" 2>/dev/null | tr -d ' ' || echo "0")
if [ "$USERS_COUNT" = "0" ] || [ "$USERS_COUNT" = "" ]; then
  echo "🌱 Seeding database..."
  node prisma/seed.js 2>/dev/null || true
fi

# Start the unified server
echo "🚀 Starting CitaDental server on port ${PORT:-3001}..."
PORT=${PORT:-3001} NODE_ENV=production node src/server.js
