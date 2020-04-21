FROM node:13-alpine

USER node

RUN mkdir -p /home/node/app

WORKDIR /home/node/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY --chown=node package.json ./

RUN npm install

# Bundle app source code
COPY --chown=node . .

CMD [ "yarn", "start" ]
