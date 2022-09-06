FROM nginx:stable-alpine

RUN rm -rf /usr/share/nginx/html/*
RUN rm -rf /etc/nginx/conf.d/*

COPY --chown=nginx:nginx build /usr/share/nginx/html
COPY --chown=nginx:nginx docker/nginx/default.conf /etc/nginx/conf.d/

EXPOSE 80

ENTRYPOINT ["/bin/sh", "-c", "exec nginx -g 'daemon off;';"]
