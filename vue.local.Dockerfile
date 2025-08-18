FROM node:24.4.1

WORKDIR /my-proj-vue
RUN CD ./vue
RUN npm run build
COPY src/vue/dist .
CMD ["node"]