# ── Stage 1: Base ──────────────────────────────────────────
# Start from official Node.js image (slim = smaller size)
FROM node:18-alpine

# ── Metadata ───────────────────────────────────────────────
LABEL maintainer="LasMinruk"
LABEL service="user-service"
LABEL version="1.0.0"

# ── Set working directory inside the container ──────────────
# All commands after this run inside /app inside the container
WORKDIR /app

# ── Copy package files first ────────────────────────────────
# We copy package.json BEFORE copying source code
# This way Docker caches npm install — faster rebuilds
COPY package*.json ./

# ── Install dependencies ────────────────────────────────────
# --omit=dev means don't install nodemon etc. in production
RUN npm install --omit=dev

# ── Copy source code ────────────────────────────────────────
COPY . .

ENV MONGO_URI=""

# ── Tell Docker this container listens on port 3001 ─────────
EXPOSE 3001

# ── Security: Run as non-root user ──────────────────────────
# Never run containers as root - security best practice
USER node

# ── Start the application ───────────────────────────────────
CMD ["node", "server.js"]

