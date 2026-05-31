FROM mcr.microsoft.com/playwright:v1.42.1-jammy

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy framework files
COPY . .

# Run test suite by default
CMD ["npm", "run", "test"]
