# Use Node 20 LTS
FROM node:20

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json separately
COPY package*.json ./

# Install only production dependencies to reduce image size
RUN npm install --production

# Copy all backend source code
COPY . .

# Expose the port your app listens on
EXPOSE 5000

# Start the backend server
CMD ["node", "server.js"]
# Use Node 20 LTS
FROM node:20

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json separately
COPY package*.json ./

# Install only production dependencies to reduce image size
RUN npm install --production

# Copy all backend source code
COPY . .

# Expose the port your app listens on
EXPOSE 5000

# Start the backend server
CMD ["node", "server.js"]
