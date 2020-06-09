FROM balenalib/asus-tinker-board-alpine-node
WORKDIR /usr/src/app
COPY package.json package.json
RUN npm install
RUN npm i -g serve
COPY . .

CMD ["npm","start"]
