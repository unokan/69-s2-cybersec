#!/usr/bin/env bash
set -eu

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

if [ ! -f .env ]; then
    echo "Error: .env not found. Copy .envsimple to .env and fill in the values first." >&2
    exit 1
fi

cp api.http.simple api.http

echo "Synced api.http from api.http.simple"
echo 'Values are read live from .env by REST Client via {{$dotenv ...}}'