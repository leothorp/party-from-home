FROM node:10.16.3-stretch

RUN apt-get update && apt-get install -y libpq-dev libssl-dev openssl ca-certificates wget
RUN wget https://curl.haxx.se/ca/cacert.pem
ENV SSL_CERT_PATH /cacert.pem

WORKDIR /root/package
COPY package.json package-lock.json ./
RUN npm install
COPY . /root/package/

CMD ["node", "server.js"]
