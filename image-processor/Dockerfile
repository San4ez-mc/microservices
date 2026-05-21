FROM node:20-bookworm-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
  ca-certificates \
  fonts-dejavu-core \
  fonts-noto-core \
  fonts-noto-cjk \
  fonts-noto-color-emoji \
  && rm -rf /var/lib/apt/lists/*

COPY package.json ./
RUN npm install --omit=dev

COPY src ./src
COPY .env.example ./.env.example

EXPOSE 3001
CMD ["node", "src/index.js"]
