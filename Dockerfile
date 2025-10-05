# -----------------------------
# Etapa 1: Builder
# -----------------------------
FROM node:lts-alpine3.17 AS builder

WORKDIR /usr/src/app

# Copiamos los archivos de dependencias primero para aprovechar el cache
COPY package*.json ./

# Instalamos todas las dependencias (incluyendo dev)
RUN npm ci

# Copiamos el resto del código fuente
COPY . .

# Compilamos el código
RUN npm run build

# -----------------------------
# Runtime (development)
# -----------------------------
FROM builder as development
EXPOSE 3000
CMD ["sh", "-c", "npm i && npm run db:deploy && npm run dev"]


# -----------------------------
# Runtime (production)
# -----------------------------
FROM builder AS production
WORKDIR /usr/src/app
# Copiamos los archivos esenciales desde el builder
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/prisma ./prisma
# Instalar solo dependencias necesarias para producción
RUN npm ci --omit=dev
EXPOSE 3000
CMD ["sh", "-c", "npm run db:deploy && npm start"]
