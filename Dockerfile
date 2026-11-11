FROM node:22-bookworm-slim AS frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install --global npm@11.9.0 && npm ci --no-audit --no-fund
COPY frontend/ ./
RUN npm run build

FROM node:22-bookworm-slim
ENV NODE_ENV=production
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install --global npm@11.9.0 && npm ci --omit=dev --no-audit --no-fund
COPY backend/ ./
COPY --from=frontend /app/frontend/build /app/frontend/build
USER node
EXPOSE 3001
CMD ["node", "server.js"]
