# 1. --- Base ---
FROM node:12.16-stretch-slim AS base

# install dependencies first, in a different location for easier app bind mounting for local development
# due to default /opt permissions we have to create the dir with root and change perms
RUN mkdir -p /opt/node_app && chown -R node:node /opt/node_app
WORKDIR /opt/node_app

# the official node image provides an unprivileged user as a security best practice
# but we have to manually enable it. We put it here so npm installs dependencies as the same
# user who runs the app. 
# https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md#non-root-user
USER node
COPY package*.json ./


# 2. --- Dependencies ---
FROM base AS dependencies
ENV NODE_ENV development
ENV PORT 3000

RUN npm install
ENV PATH /opt/node_app/node_modules/.bin:$PATH

# copy in our source code last, as it changes the most
COPY --chown=node:node . .
RUN npm run build
CMD [ "npm", "run", "debug" ]


# 3. --- Release ---
FROM base AS release
ENV NODE_ENV production
ENV PORT 3000
ENV PATH /opt/node_app/node_modules/.bin:$PATH

COPY --from=dependencies ./opt/node_app/dist ./dist
RUN npm ci --only=production
CMD [ "npm", "run", "start" ]