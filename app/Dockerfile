FROM node:16-alpine

WORKDIR /app

ARG project_id
ARG api_key

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
RUN npm install

ADD . .
RUN API_KEY=${api_key} PROJECT_ID=${project_id} npm run build

CMD ["yarn", "start"]