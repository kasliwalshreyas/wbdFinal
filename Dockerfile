FROM node:16
WORKDIR /src
COPY package*.json .
RUN npm install --silent
COPY . .
EXPOSE 8800
CMD ["npm", "start"]