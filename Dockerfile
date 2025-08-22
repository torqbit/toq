FROM node:20.19.4 AS builder

WORKDIR /opt/torqbit

# RUN apt-get update && apt-get install -y \
#     libcairo2-dev \
#     libpango1.0-dev \
#     libjpeg-dev \
#     libgif-dev \
#     build-essential \
#     pkg-config \
#     python3
    
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
FROM node:20.19.4-slim
RUN apt update && apt install -y curl openssl
# Set working directory for Nginx
WORKDIR /opt/torqbit


# Copy .next/ folder (build artifacts)
COPY --from=builder /opt/torqbit /opt/torqbit


# Expose the port application will run on
EXPOSE 8080