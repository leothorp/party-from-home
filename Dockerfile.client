FROM node:10.16.3-stretch as builder

WORKDIR /root/package
COPY package.json package-lock.json ./
RUN npm install
COPY . /root/package/
RUN REACT_APP_SET_AUTH=passcode npm run build

FROM nginx
COPY --from=builder /root/package/public/ /usr/share/nginx/html/
COPY --from=builder /root/package/build/ /usr/share/nginx/html/
COPY ./cloud/nginx.conf /etc/nginx/nginx.conf
COPY ./cloud/default.conf /etc/nginx/conf.d/default.conf
