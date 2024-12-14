/** @type {import('next').NextConfig} */

const { protocol, hostname } = new URL(process.env.NEXTAUTH_URL);

const cacheConfig = require("./cacheConfig");

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.b-cdn.net",
      },
      {
        protocol: protocol,
        hostname: hostname,
      },
    ],
  },

  productionBrowserSourceMaps: false,
  webpack: (config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
    if (config.cache && !dev) {
      config.cache = Object.freeze({
        type: "memory",
      });
      config.cache.maxMemoryGenerations = 0;
    }

    config.module.rules.push({
      test: /\.js$/,
      resolve: {
        fullySpecified: false,
      },
    });

    return config;
  },
  typescript: {
    //for production
    ignoreBuildErrors: true,
  },
  eslint: {
    //for production
    ignoreDuringBuilds: true,
  },
};

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",

  runtimeCaching: cacheConfig,
});

module.exports = withPWA(nextConfig);
