FROM balenalib/asus-tinker-board-alpine-node
WORKDIR /usr/src/app
COPY package.json package.json
RUN npm install
RUN npm i -g serve
ENV API_HOST=http://localhost
ENV REACT_APP_STRIPE_KEY=pk_test_CFWtG6ajKXWCe31wnZRpW4bK00lV9TwQ2H
COPY . .

CMD ["npm","start"]
