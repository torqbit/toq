import { PageThemeConfig } from "@/services/themeConstant";
import SvgIcons from "./components/SvgIcons";
import NavBar from "./components/Marketing/LandingPage/NavBar/NavBar";

const config: PageThemeConfig = {
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
};
export default config;
