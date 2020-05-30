FROM node:12.17.0
COPY src /opt/app

RUN apt-get update && apt-get install -y emacs

CMD ["node", "/opt/app/index.js"]