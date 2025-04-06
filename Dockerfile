# Step 1: Build the React app with Vite
FROM node:22 AS builder

WORKDIR /app

# Copy package.json and package-lock.json first for caching dependencies
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Build the Vite project
RUN npm run build

# Step 2: Serve with Nginx
FROM nginx:alpine

# Copy build files from previous stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
