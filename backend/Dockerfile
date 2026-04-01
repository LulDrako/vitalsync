# ============================================================
# STAGE 1 — builder : installation des dépendances
# On utilise une image complète pour installer les packages
# ============================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copier uniquement les fichiers de dépendances en premier
# pour profiter du cache Docker (si package.json ne change pas,
# cette couche n'est pas reconstruite)
COPY package*.json ./
RUN npm ci --only=production

# ============================================================
# STAGE 2 — production : image finale légère
# On repart d'une image propre et on copie uniquement
# ce qui est nécessaire à l'exécution
# ============================================================
FROM node:20-alpine AS production

# Créer un utilisateur non-root pour la sécurité
RUN addgroup -S vitalsync && adduser -S vitalsync -G vitalsync

WORKDIR /app

# Copier les node_modules depuis le stage builder
COPY --from=builder /app/node_modules ./node_modules

# Copier le code source
COPY . .

# Changer le propriétaire des fichiers
RUN chown -R vitalsync:vitalsync /app

# Utiliser l'utilisateur non-root
USER vitalsync

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["node", "server.js"]
