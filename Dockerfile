FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm install -g nodemon
RUN npm install -g typescript

COPY ./ /app/
RUN rm .env
RUN npm run clean
RUN npm run build
RUN npm run remove-src

CMD ["npm", "run", "start"]
