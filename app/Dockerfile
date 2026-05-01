# Next.jsのバージョンアップ対応と一緒に構成を再度検討する
FROM node:14-alpine

WORKDIR /app

ARG project_id
ARG api_key

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
RUN npm install

ADD . .
RUN API_KEY=${api_key} PROJECT_ID=${project_id} npm run build

CMD ["yarn", "start"]