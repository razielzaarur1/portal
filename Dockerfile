FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Install ClamAV and update virus definitions
RUN apk add --no-cache clamav clamav-daemon
RUN freshclam || true

# Copy application files
COPY . .

# Expose the server port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
