FROM nginx

RUN rm -rf /usr/share/nginx/html/*
COPY src/vue/dist/ /usr/share/nginx/html/
COPY default.local.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]