FROM ghcr.io/puppeteer/puppeteer:24.9.0

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends ffmpeg && rm -rf /var/lib/apt/lists/*

COPY package.json ./
RUN npm install --omit=dev

COPY src ./src
COPY .env.example ./.env.example

EXPOSE 3004
CMD ["node", "src/index.js"]
