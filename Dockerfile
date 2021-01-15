# Docker with multi-stage build
# It helps us keep the built production image as small as possible by keeping all the development dependencies in
# the intermediate layer, which may, in turn, result in faster deployments.
FROM node:14.15-alpine as development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=development

COPY . .

RUN npm run build

FROM node:14.15-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .
# Now this part is exactly the same as the one above, but this time, we are making sure that we install only dependencies
# defined in dependencies in package.json by using the --only=production argument. This way we don’t install packages
# such as TypeScript that would cause our final image to increase in size.
COPY --from=development /usr/src/app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main"]
