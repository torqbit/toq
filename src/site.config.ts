import { PageSiteConfig } from "@/services/siteConstant";
import NavBar from "./components/Marketing/LandingPage/NavBar/NavBar";
import Features from "./components/Marketing/LandingPage/Feature/Features";

const config: PageSiteConfig = {
  navBar: {
    component: NavBar,
    navigationLinks: [
      {
        title: "Course",
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
    name: "TORQBIT",
    logo: "/icon/torqbit.png",
    title: "A platform to guide you to the future",
    description: "Master the art of product building and turn your ideas into successful, scalable products",
    ogImage: "/icon/torqbit.png",
    favicon: "/favicon.ico",
    brandColor: "#6B74EE",
  },

  darkMode: true,
  heroSection: {
    title: "The Awesomest teaching platform",
    description: `Torqbit, an open-source platform, serves as a learning management software
 that works for single person to largest educational institutions `,
    actionButtons: {
      primary: {
        label: "Get Started",
        link: "/dashboard",
      },
      secondary: {
        label: "Contact Us",
        link: "mailto:support@torqbit.com",
      },
    },
    banner: {
      lightModePath: "/img/landing/online-learning.png",
      darkModePath: "/img/landing/online-learning.png",
      position: "right",
    },
  },
  footer: {
    discordLink: "https://discord.gg/NserMXcx",
    githubLink: "https://github.com/torqbit",
    youtubeLink: "https://www.youtube.com/@torqbit",
    tagLine: "Master Skills, Transform Futures",
  },
  sections: {
    feature: {
      component: Features,
      featureInfo: {
        featureList: [
          {
            img: "/img/landing/auth.png",
            title: "Authentication",
            description:
              "Configure authentication with Google, Github or any other auth provider supported by NextAuth",
            link: "/docs/auth",
            cardClass: "steps__card__small",
          },
          {
            img: "/img/landing/auth.png",
            title: "Authentication",
            description:
              "Configure authentication with Google, Github or any other auth provider supported by NextAuth",
            link: "/docs/auth",
            cardClass: "steps__card__small",
          },
          {
            img: "/img/landing/auth.png",
            title: "Email",
            description:
              "Configure authentication with Google, Github or any other auth provider supported by NextAuth",
            link: "/docs/auth",
            cardClass: "steps__card__small",
          },
          {
            img: "/img/landing/auth.png",
            title: "Authentication",
            description:
              "Configure authentication with Google, Github or any other auth provider supported by NextAuth",
            link: "/docs/auth",
            cardClass: "steps__card__small",
          },
        ],
        title: "Features",
        description: "Features for the learning platform",
      },
    },
  },
};
export default config;
