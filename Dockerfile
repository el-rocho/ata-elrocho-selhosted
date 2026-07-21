# 1. Etapa de compilación de la PWA estática
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# 2. Etapa de ejecución del servidor Node.js + Express
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server

# Volumen persistente para la base de datos JSON / SQLite
VOLUME ["/app/data"]

EXPOSE 3000

CMD ["node", "server/index.js"]
