import { ThemeSchema } from "@/types/schema";
import { lazy } from "react";
const NavBar = lazy(() => import("@/components/Marketing/LandingPage/NavBar/NavBar"));

export type PageThemeConfig = ThemeSchema;

export const DEFAULT_THEME: PageThemeConfig = {
  navBar: {
    component: NavBar,
    navigationLinks: [
      {
        title: "Courses",
        link: "/#courses",
      },
      {
        title: "Events",
        link: "/events",
      },
      {
        title: "Blog",
        link: "/blog",
      },
    ],
  },

  brand: {
    name: "Torqbit",
    logo: "/icon/torqbit.png",
    title: "Become a Pro Product Builder",
    description: "Master the art of product building and turn your ideas into successful, scalable products",
    ogImage: "/icon/torqbit.png",
    favicon: "/favicon.ico",
    brandColor: "#5b63d3",
  },

  darkMode: false,
  heroSection: {
    title: "Become a Pro Product Builder",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores rerum voluptatum perferendis autem veritatis nostrum. Libero aliquam dignissimos sunt voluptatum!",
    actionButtons: {
      primary: {
        label: "Go to Dashboard",
        link: "/dashboard",
      },
      secondary: {
        label: "Contact Us",
        link: "mailto:support@torqbit.com",
      },
    },
    banner: {
      lightModePath: "/img/macbook-light.png",
      darkModePath: "/img/macbook-dark.png",
      align: "bottom",
    },
  },
  footer: {
    discordLink: "https://discord.gg/NserMXcx",
    githubLink: "https://github.com/torqbit",
    youtubeLink: "https://www.youtube.com/@torqbit",
  },
};

export const DEEP_OBJECT_KEYS = Object.entries(DEFAULT_THEME)
  .map(([key, value]) => {
    const isObject = value && typeof value === "object" && !Array.isArray(value);
    if (isObject) {
      return key;
    }
  })
  .filter(Boolean);
