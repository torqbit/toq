FROM node:18 AS builder

WORKDIR /opt/torqbit

# Install Yarn package manager
RUN npm install yarn


# Remove package-lock.json file 

RUN rm package-lock.json

RUN apt-get update && apt-get install -y vim

# Copy package.json and yarn.lock to the working directory

COPY package.json yarn.lock ./

# Install dependencies using Yarn
RUN yarn install 

# Copy the rest of the application code
COPY . .

# Generate the schema & build the Next.js application
RUN npx prisma generate && yarn build 

# Step 2: Prepare Nginx to serve the built app
FROM nginx:alpine

# Set working directory for Nginx
WORKDIR /usr/share/nginx/html

# Copy the built app and static files to the Nginx directory
# Copy .next/ folder (build artifacts)
COPY --from=builder /opt/torqbit/.next /usr/share/nginx/html/.next

# Copy the Next.js static files to Nginx directory
COPY --from=builder /opt/torqbit/public /usr/share/nginx/html/public

# Copy custom Nginx configuration if needed (optional)
COPY nginx.conf /etc/nginx/nginx.conf

# Expose the port Nginx will run on
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]