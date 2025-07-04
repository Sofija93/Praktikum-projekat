# Use the official Node.js image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

#Install dependencies
RUN npm install

#Copy the rest of the application code
COPY . . 

#Generate database
RUN npx prisma Generate
#Run database migrations
RUN npx prisma migrate dev --name

#Build the application
RUN npm run build
#Expose the port the app runs on
EXPOSE 3000
#Start the application
CMD ["npm","run", "start"]