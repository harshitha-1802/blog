FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Expose the development server port
EXPOSE 3000

# Run the React app
CMD ["npm", "start"]
