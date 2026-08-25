# Dockerfile for VeriLearn (Oracle Cloud Free Tier & Docker Compatible)
FROM node:18-alpine

# Install Icarus Verilog compiler and build dependencies
RUN apk add --no-cache iverilog g++ make

# Set working directory
WORKDIR /app

# Copy application files
COPY . .

# Expose HTTP port
EXPOSE 3001
ENV PORT=3001

# Start VeriLearn Compiler Server & Web App
CMD ["node", "server.js"]
