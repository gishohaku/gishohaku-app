FROM node:22-alpine

WORKDIR /app

ARG project_id
ARG api_key

ENV PORT=8080
ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN API_KEY=${api_key} PROJECT_ID=${project_id} npm run build \
    && rm -rf .next/cache

ENV NODE_ENV=production

EXPOSE 8080

CMD ["sh", "-c", "npm start -- -p ${PORT}"]