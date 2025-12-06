# Frontend Vite build
FROM node:20-alpine as build
WORKDIR /app

ARG VITE_API_URL=https://example.com/api
ENV VITE_API_URL=${VITE_API_URL}

COPY frontend/package*.json ./
COPY frontend/tsconfig*.json ./
COPY frontend/vite.config.ts ./
COPY frontend/index.html ./
COPY frontend/public ./public
COPY frontend/src ./src

RUN npm install && npm run build

FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
