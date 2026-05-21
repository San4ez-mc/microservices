FROM ghcr.io/puppeteer/puppeteer:24.9.0

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

COPY src ./src
COPY .env.example ./.env.example

EXPOSE 3002
CMD ["node", "src/index.js"]
