FROM balenalib/asus-tinker-board-s-alpine-node:10-20181025
WORKDIR /usr/src/app
ENV UDEV=on
COPY package.json package.json
RUN  apk update && apk add python g++ make
RUN npm config set python /usr/bin/python2.7
# RUN npm cache clean -f && npm install -g n && n stable
RUN npm install
RUN mkdir ./temp
RUN mkdir ./storage
RUN su mount sda ./temp

COPY . .

CMD ["npm","start"]
