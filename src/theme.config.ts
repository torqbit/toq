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
    name: "Torqbit",
    logo: "/icon/torqbit.png",
    title: "Become a Pro Product Builder",
    description: "Master the art of product building and turn your ideas into successful, scalable products",
    ogImage: "/icon/torqbit.png",
    favicon: "/favicon.ico",
    brandColor: "#000",
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
      align: "left",
    },
  },
  footer: {
    discordLink: "https://discord.gg/NserMXcx",
    githubLink: "https://github.com/torqbit",
    youtubeLink: "https://www.youtube.com/@torqbit",
  },
};
export default config;
