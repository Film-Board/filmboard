FROM node:12-slim

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN npm i ffbinaries -g

RUN ffbinaries -o=/usr/local/bin

COPY package.json /usr/src/app
COPY yarn.lock /usr/src/app

RUN yarn install --prod

COPY . /usr/src/app

RUN yarn run build

EXPOSE 3000

CMD ["yarn", "run", "start"]
