FROM node:lts

RUN apt-get clean all
RUN apt-get update
RUN apt update

RUN mkdir /mnt/simulator
WORKDIR /mnt/simulator

COPY ./engine/package.json ./engine/package-lock.json /mnt/simulator/

RUN npm ci

COPY ./engine /mnt/simulator/

EXPOSE 5000

ENTRYPOINT [ "node", "./server.js"]
