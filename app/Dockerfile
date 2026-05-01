FROM node:14-alpine

WORKDIR /app

ARG project_id
ARG api_key

ENV PORT=8080

COPY package.json package-lock.json ./

RUN npm install --legacy-peer-deps --production=false

COPY . .

RUN API_KEY=${api_key} PROJECT_ID=${project_id} npm run build

ENV NODE_ENV=production

EXPOSE 8080

CMD ["sh", "-c", "npx next start -p ${PORT}"]