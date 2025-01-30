FROM node:20 AS builder

WORKDIR /opt/torqbit

# Install Yarn package manager
RUN npm install yarn


# Remove package-lock.json file 
RUN rm package-lock.json

# Copy package.json and yarn.lock to the working directory

COPY package.json yarn.lock ./

# Install dependencies using Yarn
RUN yarn install 

# Copy the rest of the application code
COPY . .
COPY docker.env /opt/torqbit/.env
# Generate the schema & build the Next.js application
RUN npx prisma generate && yarn build 

# Step 2: Prepare Nginx to serve the built app
FROM node:20-slim
RUN apt update && apt install -y nginx curl openssl
# Set working directory for Nginx
WORKDIR /opt/torqbit

# Copy the built app and static files to the Nginx directory
# Copy .next/ folder (build artifacts)
COPY --from=builder /opt/torqbit /opt/torqbit

# Copy custom Nginx configuration if needed (optional)
COPY nginx.conf /etc/nginx/nginx.conf
COPY academy.com /etc/nginx/sites-available/default


# Expose the port Nginx will run on
EXPOSE 80