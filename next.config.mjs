/** @type {import('next').NextConfig} */
import cacheConfig from "./cacheConfig.mjs";
const { protocol, hostname } = new URL(process.env.NEXTAUTH_URL || "http://localhost:3000");
import pwa from "next-pwa";
const isDev = process.env.NODE_ENV === "development";

// Completely disable Sass logger to silence deprecation warnings
const sassOptions = {
  sassOptions: {
    logger: {
      debug: () => {},
      warn: () => {},
      error: () => {},
    },
  },
};

const nextConfig = {
  ...sassOptions,
  reactStrictMode: isDev,
  swcMinify: true,
  experimental: {
    // Enable Turbo mode with better caching
    turbo: {},

    // Better package optimization
    optimizePackageImports: [
      "antd",
      "lucide-react",
      "@ant-design/icons",
      "react-icons",
      "@tiptap/react",
      "@tiptap/core",
    ],

    // Optimize server components
    serverComponentsExternalPackages: ["sharp", "canvas", "puppeteer", "ffmpeg", "sodium-native"],
  },
  transpilePackages: [
    // antd & deps
    "@ant-design",
    "@rc-component",
    "antd",
    "rc-cascader",
    "rc-checkbox",
    "rc-collapse",
    "rc-dialog",
    "rc-drawer",
    "rc-dropdown",
    "rc-field-form",
    "rc-image",
    "rc-input",
    "rc-input-number",
    "rc-mentions",
    "rc-menu",
    "rc-motion",
    "rc-notification",
    "rc-pagination",
    "rc-picker",
    "rc-progress",
    "rc-rate",
    "rc-resize-observer",
    "rc-segmented",
    "rc-select",
    "rc-slider",
    "rc-steps",
    "rc-switch",
    "rc-table",
    "rc-tabs",
    "rc-textarea",
    "rc-tooltip",
    "rc-tree",
    "rc-tree-select",
    "rc-upload",
    "rc-util",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.b-cdn.net",
      },
      {
        protocol: "https",
        hostname: "**.torqbit.com",
      },
      {
        protocol: protocol.slice(0, -1) || "http",
        hostname: hostname || "localhost",
      },
    ],
  },

  productionBrowserSourceMaps: isDev,
  typescript: {
    //for production
    ignoreBuildErrors: true,
  },
  eslint: {
    //for production
    ignoreDuringBuilds: true,
  },
};

const withPWA = pwa({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: isDev,
  runtimeCaching: cacheConfig,
});

export default withPWA(nextConfig);
