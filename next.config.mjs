/** @type {import('next').NextConfig} */

const { protocol, hostname } = new URL(process.env.NEXTAUTH_URL || "http://localhost:3000");
import pwa from "next-pwa";
import cacheConfig from "./cacheConfig.mjs";

const nextConfig = {
  // reactStrictMode: true,
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

  productionBrowserSourceMaps: false,
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
  disable: process.env.NODE_ENV === "development",
  runtimeCaching: cacheConfig,
});

export default withPWA(nextConfig);
