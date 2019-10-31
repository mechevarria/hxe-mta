FROM node:10

ARG HXE_HOST
ARG HXE_PORT
ENV HXE_HOST=${HXE_HOST} \
  HXE_PORT=${HXE_PORT}

WORKDIR /usr/src/app

COPY .npmrc ./

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8443

CMD [ "node", "server.js" ]