FROM node:alpine
WORKDIR /nestapp
COPY package*.json ./
RUN npx prisma migrate dev
RUN npx prisma generate
RUN yarn
COPY . .
RUN yarn build
EXPOSE 3000
CMD [ "node", "dist/main.js" ]