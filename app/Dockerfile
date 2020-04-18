FROM node:10-alpine

WORKDIR /app

ARG project_id
ARG api_key

COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock
RUN yarn install

ADD . .
RUN API_KEY=${api_key} PROJECT_ID=${project_id} yarn build

CMD ["yarn", "start"]