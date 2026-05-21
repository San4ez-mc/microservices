#!/usr/bin/env bash
set -euo pipefail

# Usage: ./scripts/deploy_service.sh <domain> [branch]
DOMAIN="${1:?domain is required}"
BRANCH="${2:-main}"
DIR="/var/www/${DOMAIN}"

if [ ! -d "${DIR}/.git" ]; then
  echo "Not a git directory: ${DIR}"
  exit 1
fi

git -C "${DIR}" fetch origin
git -C "${DIR}" checkout "${BRANCH}"
git -C "${DIR}" pull --ff-only origin "${BRANCH}"
npm --prefix "${DIR}" install

echo "Service deployed: ${DOMAIN}"
