/** @type {import('next').NextConfig} */

const cacheConfig = require("./cacheConfig");

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["cdn.torqbit.com", "torqbit-dev.b-cdn.net", "dev-test-103-pz.b-cdn.net", "dev-test-101-pz.b-cdn.net"],
  },

  productionBrowserSourceMaps: false,
  webpack: (config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
    if (config.cache && !dev) {
      config.cache = Object.freeze({
        type: "memory",
      });
      config.cache.maxMemoryGenerations = 0;
    }
    // Important: return the modified config
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
