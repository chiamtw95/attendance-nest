FROM node:14 AS builder

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install

# Install app dependencies

COPY . .

EXPOSE 3000
CMD [ "yarn", "start" ]