#Instructions go here

FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV SERVER_PORT=3000 MONGODB_URI=mongodb+srv://Mana:mana@cluster0.2vit5vm.mongodb.net/students?retryWrites=true&w=majority&appName=Cluster0
EXPOSE 3000

CMD [ "npm", "start" ]