FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm install -g typescript

COPY tsconfig.json ./
COPY ./src ./

RUN if [ -f .env ]; then rm .env; fi
RUN npm run clean
RUN npm run build
RUN npm run remove-src

COPY files/templates ./dist/templates
COPY files/setup ./dist/setup

CMD ["npm", "run", "start"]
