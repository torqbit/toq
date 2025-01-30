import { bannerAlignment, ThemeSchema } from "@/types/schema";
import { Theme } from "@/types/theme";

export type PageSiteConfig = ThemeSchema;

export const DEFAULT_THEME = {
  template: "standard",
  updated: false,
  navBar: {
    links: [
      {
        title: "Courses",
        link: "/courses",
      },
      {
        title: "Events",
        link: "/events",
      },
      {
        title: "Blog",
        link: "/blogs",
      },
    ],
  },

  brand: {
    name: "TORQBIT",
    logo: "/icon/torqbit.png",
    darkLogo: "/icon/torqbit.png",
    defaultTheme: "light" as Theme,
    themeSwitch: true,
    icon: "/img/brand/torqbit-icon.png",
    title: "Become a Pro Product Builder",
    description: "Master the art of product building and turn your ideas into successful, scalable products",
    ogImage: "/icon/torqbit.png",
    favicon: "/favicon.ico",
    brandColor: "#5b63d3",
    socialLinks: {
      discord: "https://discord.gg/NserMXcx",
      github: "https://github.com/torqbit",
      youtube: "https://www.youtube.com/@torqbit",
    },
  },

  darkMode: true,
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
      position: "bottom" as bannerAlignment,
    },
  },
  sections: {
    courses: {
      enable: false,
      title: "Courses",
      description: "Description for the course list",
    },
    learning: {
      enabled: false,
      title: "Our Learning path",
      description: "Description for the course list",
    },
    blog: {
      enable: false,
      title: "Blogs",
      description: "Description for the blog list",
    },
    features: {
      enabled: true,
      items: [
        {
          img: "/img/landing/auth.png",
          title: "Authentication",
          description: "Configure authentication with Google, Github or any other auth provider supported by NextAuth",
          link: "/docs/auth",
          cardClass: "steps__card__small",
        },
        {
          img: "/img/landing/auth.png",
          title: "Authentication",
          description: "Configure authentication with Google, Github or any other auth provider supported by NextAuth",
          link: "/docs/auth",
          cardClass: "steps__card__small",
        },
        {
          img: "/img/landing/auth.png",
          title: "Authentication",
          description: "Configure authentication with Google, Github or any other auth provider supported by NextAuth",
          link: "/docs/auth",
          cardClass: "steps__card__small",
        },
      ],
      title: "Features",
      description: "Features for the learning platform",
    },

    faq: {
      title: "FAQ",
      description: "FFrequently asked questions by the students",
      items: [
        {
          question: "First question",
          answer: "First answer",
        },
        {
          question: "Second question",
          answer: "Second answer",
        },
        {
          question: "Third question",
          answer: "Third answer",
        },
      ],
      enabled: true,
    },
    tesimonials: {
      items: [],
      enabled: true,
      title: "Teachers love our product",
      description: "Find out what excites our users, when using our product",
    },
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
