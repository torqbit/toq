import appConstant from "@/services/appConstant";
import MarketingSvgIcons from "../MarketingSvgIcons";
import { Button, Card } from "antd";
import styles from "@/styles/Marketing/LandingPage/LandingPage.module.scss";
import { useThemeConfig } from "@/components/ContextApi/ThemeConfigContext";

const About = () => {
  const { brand } = useThemeConfig();
  const cardDetail = [
    {
      icon: MarketingSvgIcons.openSource,
      title: "Open source platform",
      description:
        "The training platform has been open sourced, and we train people to become open source contributors to build network and learn from the best",
    },
    {
      icon: MarketingSvgIcons.illustrativeVideo,
      title: "illustrative videos",
      description:
        "We have crafted easy to understand illustrations for explaining complex concepts, thereby allowing students to move faster and start building products.",
    },
    {
      icon: MarketingSvgIcons.codeIcon,
      title: "High quality coding",
      description:
        "We emphasize on writing quality code, as the code is read and debugged multiple times. And such coders are highly demanded.",
    },
  ];
  return (
    <section className={styles.aboutContainer}>
      <div>
        <h3>What&apos;s different about {brand.name}?</h3>
        <div className={styles.cardWrapper}>
          {cardDetail.map((detail, i) => {
            return (
              <div key={i} className={styles.card}>
                <div className={styles.icon}>{detail.icon}</div>
                <div className={styles.content}>
                  <h2>{detail.title}</h2>
                  <p>{detail.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default About;
