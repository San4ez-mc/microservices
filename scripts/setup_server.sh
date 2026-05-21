#!/usr/bin/env bash
set -euo pipefail

# Usage: ./scripts/setup_server.sh <repo_url> [branch]
REPO_URL="${1:?Repository URL is required}"
BRANCH="${2:-main}"
ROOT="/var/www"

SERVICES=(
  "image-processor:img.flows.fineko.space"
  "slide-builder:slides.flows.fineko.space"
  "video-processor:video.flows.fineko.space"
  "remotion-renderer:render.flows.fineko.space"
)

for entry in "${SERVICES[@]}"; do
  SERVICE="${entry%%:*}"
  DOMAIN="${entry##*:}"
  TARGET_DIR="${ROOT}/${DOMAIN}"

  if [ ! -d "${TARGET_DIR}/.git" ]; then
    git clone --filter=blob:none --no-checkout "${REPO_URL}" "${TARGET_DIR}"
    git -C "${TARGET_DIR}" sparse-checkout init --cone
    git -C "${TARGET_DIR}" sparse-checkout set "${SERVICE}" "package.json"
    git -C "${TARGET_DIR}" checkout "${BRANCH}"
  fi

done

echo "Server setup complete."
