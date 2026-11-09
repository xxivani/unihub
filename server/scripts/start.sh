#!/bin/sh
# Boot script for Railway: migrate -> (optionally seed an empty DB) -> start API.
set -e

echo "[start] running migrations"
npx sequelize-cli db:migrate

if [ "$SEED_ON_BOOT" = "true" ]; then
  COUNT=$(node scripts/user-count.js 2>/dev/null | grep '^USER_COUNT=' | cut -d= -f2 || true)
  if [ "$COUNT" = "0" ]; then
    echo "[start] Users table empty -> running seeders"
    npx sequelize-cli db:seed:all
  else
    echo "[start] skipping seed (user count: ${COUNT:-unknown})"
  fi
fi

echo "[start] starting server"
exec node server.js
