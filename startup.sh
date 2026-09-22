#!/bin/sh
# Restart contract: idempotent, non-blocking, binds 0.0.0.0:8080 via npm run dev.
set -eu
cd /workspace

if curl -sf -o /dev/null --max-time 2 http://127.0.0.1:8080/; then
  exit 0
fi

npm run dev > /tmp/flagship-lab-dev.log 2>&1 &
sleep 1
exit 0
