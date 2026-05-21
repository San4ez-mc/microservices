#!/usr/bin/env bash
set -euo pipefail

BRANCH="${1:-main}"
ROOT="/var/www"

DOMAINS=(
  "img.flows.fineko.space"
  "slides.flows.fineko.space"
  "video.flows.fineko.space"
  "render.flows.fineko.space"
)

for DOMAIN in "${DOMAINS[@]}"; do
  DIR="${ROOT}/${DOMAIN}"
  if [ -d "${DIR}/.git" ]; then
    echo "Deploying ${DOMAIN}"
    git -C "${DIR}" fetch origin
    git -C "${DIR}" checkout "${BRANCH}"
    git -C "${DIR}" pull --ff-only origin "${BRANCH}"
    npm --prefix "${DIR}" install
  else
    echo "Skipping ${DOMAIN}: repo not initialized"
  fi

done

echo "Deploy complete"
