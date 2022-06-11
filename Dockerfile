# --- Base ---
FROM node:16-stretch-slim AS base

RUN mkdir -p /opt/node_app && chown -R node:node /opt/node_app
WORKDIR /opt/node_app

# the official node image provides an unprivileged user as a security best practice
# but we have to manually enable it. We put it here so npm installs dependencies as the same
# user who runs the app. 
# https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md#non-root-user
COPY ./package*.json ./

# --- dev ---
FROM base AS dev
ENV NODE_ENV development
ENV PORT 3000
RUN npm install
ENV PATH /opt/node_app/node_modules/.bin:$PATH

# copy in our source code last, as it changes the most
COPY --chown=node:node . .
USER node
RUN npm run build
CMD [ "npm", "run", "debug" ]


# --- test ---
FROM base as test
ENV NODE_ENV test
ENV PORT 3000
RUN npm ci
ENV PATH /opt/node_app/node_modules/.bin:$PATH
USER node
CMD ["npm", "run", "test:ci"]

# --- Release ---
FROM base AS release
ENV NODE_ENV production
ENV PORT 3000
ENV PATH /opt/node_app/node_modules/.bin:$PATH

COPY --from=dev /opt/node_app/dist ./dist
RUN npm ci --only=production
USER node
CMD [ "npm", "run", "start" ]