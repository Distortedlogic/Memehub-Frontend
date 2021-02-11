FROM node:14-slim

WORKDIR /app

ENV PATH=/app/node_modules/.bin:$PATH ENV='dev'

COPY package*.json /app
RUN npm install --silent

CMD ["npm", "run", "dev"]