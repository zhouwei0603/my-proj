FROM node:24.4.1

WORKDIR /my-proj-data
COPY src/data/package.json .
RUN npm install
COPY src/data/ .
CMD ["node", "server.js"]