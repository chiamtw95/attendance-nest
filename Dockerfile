FROM node:alpine as builder
WORKDIR /nestapp

COPY . .
RUN npm run build

EXPOSE 3000
CMD [ "npm", "run", "start:prod" ]