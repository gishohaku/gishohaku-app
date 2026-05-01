FROM node:14-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

ARG project_id
ARG api_key

COPY package.json package-lock.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN API_KEY=${api_key} PROJECT_ID=${project_id} npm run build

EXPOSE 8080

CMD ["sh", "-c", "npm start -- -p ${PORT}"]