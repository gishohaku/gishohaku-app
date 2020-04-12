FROM node:10-alpine

WORKDIR /app

ARG project_id
ARG api_key
ENV PROJECT_ID=$project_id
ENV API_KEY=$api_key

COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock
RUN yarn install

ADD . .
RUN yarn build

CMD ["yarn", "start"]