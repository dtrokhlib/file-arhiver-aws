FROM node:20-alpine3.17

COPY ./package* .
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD [ "node", "dist/index" ]