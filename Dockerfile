FROM node:16.15

#  Navigate to the container working directory
WORKDIR /app
#  Copy package.json
COPY package*.json ./

RUN npm install
COPY . .

CMD ["npm", "run", "start:dev"]
