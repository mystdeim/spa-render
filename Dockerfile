FROM node:22-slim

WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends chromium && \
    rm -rf /var/lib/apt/lists/*

COPY plugins plugins/
COPY server.js package.json package-lock.json ./

RUN npm ci

EXPOSE 3000

CMD ["node", "server.js"]
