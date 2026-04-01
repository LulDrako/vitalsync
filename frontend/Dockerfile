# ============================================================
# STAGE 1 — builder : on pourrait compiler du React ici
# Pour l'instant le frontend est statique (HTML/JS pur)
# ============================================================
FROM node:20-alpine AS builder

WORKDIR /app
COPY . .

# ============================================================
# STAGE 2 — production : Nginx sert les fichiers statiques
# et fait office de reverse proxy vers l'API backend
# ============================================================
FROM nginx:alpine AS production

# Copier la configuration Nginx personnalisée
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers statiques du frontend
COPY --from=builder /app/index.html /usr/share/nginx/html/index.html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
