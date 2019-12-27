FROM balenalib/asus-tinker-board-alpine-node
WORKDIR /usr/src/app
COPY package.json package.json
RUN npm config set python /usr/bin/python2.7
RUN apk add --no-cache --virtual .gyp \
        python \
        make \
        g++ \
    && npm install \
    && apk del .gyp
COPY . .

CMD ["npm","start"]
