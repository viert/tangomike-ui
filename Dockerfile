FROM node:20.6.1 as builder
ADD public /opt/public
ADD src /opt/src

ADD package.json /opt/
ADD yarn.lock /opt/
ADD index.html /opt/
ADD env.d.ts /opt/
ADD tsconfig.json /opt/
ADD tsconfig.app.json /opt/
ADD tsconfig.node.json /opt/
ADD vite.config.ts /opt/

ADD .env /opt/.env
WORKDIR /opt
RUN yarn && yarn build

FROM nginx:latest
COPY --from=builder /opt/dist /usr/share/nginx/html
