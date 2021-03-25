FROM node:lts

RUN apt-get update && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

RUN mkdir /mnt/simulator
WORKDIR /mnt/simulator

COPY ./engine/package.json ./engine/package-lock.json /mnt/simulator/

RUN npm ci

COPY ./engine /mnt/simulator/

EXPOSE 5000

ENTRYPOINT [ "node", "./server.js"]
