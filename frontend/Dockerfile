FROM balenalib/asus-tinker-board-alpine-node
WORKDIR /usr/src/app
COPY package.json package.json
RUN npm install
COPY . .

CMD ["npm","start"]
