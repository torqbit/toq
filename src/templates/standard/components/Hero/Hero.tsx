import { FC } from "react";

import styles from "./Hero.module.scss";
import { Button, Flex, Space } from "antd";
import Link from "next/link";
import { User } from "@prisma/client";
import Image from "next/image";
import { useAppContext } from "@/components/ContextApi/AppContext";
import { bannerAlignment } from "@/types/schema";
import { PageSiteConfig } from "@/services/siteConstant";

const MarketingHero: FC<{ isMobile: boolean; user: User; siteConfig: PageSiteConfig }> = ({
  isMobile,
  user,
  siteConfig,
}) => {
  const { globalState } = useAppContext();
  const { heroSection } = siteConfig;

  let bannerAlign =
    isMobile && heroSection?.banner?.position !== "background"
      ? "bottom"
      : (heroSection?.banner?.position as bannerAlignment);

  const getFlexDirection = (align: bannerAlignment) => {
    switch (align) {
      case "left":
        return "row-reverse";

      case "right":
        return "row";

      default:
        return "column";
    }
  };
  const getBannerWidth = (align: bannerAlignment) => {
    switch (align) {
      case "bottom":
        return 1200;

      default:
        return 400;
    }
  };
  const getTextAlign = (align: bannerAlignment) => {
    switch (align) {
      case "left":
        return "left";

      case "right":
        return "left";

      default:
        return "center";
    }
  };

  const getBgImage = () => {
    let bgImage = heroSection?.banner?.darkModePath
      ? heroSection.banner.darkModePath
      : heroSection?.banner?.lightModePath;

    if (siteConfig.brand?.themeSwitch) {
      return globalState.theme === "dark" && bgImage;
    } else {
      if (siteConfig.brand?.defaultTheme == "dark") {
        return bgImage;
      } else {
        return heroSection?.banner?.lightModePath;
      }
    }
  };
  let backgroundStyles = bannerAlign === "background" && {
    backgroundImage: ` ${bannerAlign === "background" ? `url(${getBgImage()})` : ""}`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "top 60px",
    margin: "0px auto",
  };

  return (
    <section
      id="hero"
      style={{
        ...backgroundStyles,
      }}
      className={styles.landing__hero}
    >
      <Flex
        vertical={bannerAlign === "bottom" || bannerAlign === "background"}
        style={{
          flexDirection: getFlexDirection(bannerAlign as bannerAlignment),
        }}
        gap={bannerAlign === "bottom" ? 0 : 40}
        className={styles.heroContentContainer}
      >
        <Flex
          vertical
          align={bannerAlign === "bottom" || bannerAlign === "background" ? "center" : "start"}
          justify={bannerAlign === "bottom" || bannerAlign === "background" ? "center" : "flex-start"}
        >
          <h1 style={{ textAlign: getTextAlign(bannerAlign) }}>{heroSection && heroSection.title}</h1>
          <p className="landingPagePara" style={{ textAlign: getTextAlign(bannerAlign) }}>
            {heroSection && heroSection.description}
          </p>

          <Flex
            justify={bannerAlign == "left" || bannerAlign == "right" ? "start" : "center"}
            align="center"
            gap={20}
            style={{ marginBottom: 50, padding: "0px 20px", width: "100%" }}
          >
            <Link href={user ? `${heroSection?.actionButtons?.primary?.link}` : `/login`}>
              <Button type="primary">{user ? heroSection?.actionButtons?.primary?.label : " Sign up for free"}</Button>
            </Link>
            <a href={`${heroSection?.actionButtons?.secondary?.link}`} aria-label="Contact us through mail">
              <Button className={styles.btn__contact}>{heroSection?.actionButtons?.secondary?.label}</Button>
            </a>
          </Flex>
        </Flex>
        {bannerAlign !== "background" && getBgImage() !== "" && (
          <img
            alt="Website builder screenshot"
            className="max-w-[80vw] md:max-w-[100%]"
            width={getBannerWidth(bannerAlign as bannerAlignment)}
            loading="lazy"
            src={`${getBgImage()}`}
          />
        )}
      </Flex>
    </section>
  );
};

export default MarketingHero;
