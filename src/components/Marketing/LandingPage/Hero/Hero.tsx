import { FC } from "react";

import styles from "./Hero.module.scss";
import { Button, Flex, Space } from "antd";
import Link from "next/link";
import { Theme, User } from "@prisma/client";
import Image from "next/image";
import { useAppContext } from "@/components/ContextApi/AppContext";
import { useThemeConfig } from "@/components/ContextApi/ThemeConfigContext";
import { bannerAlignment } from "@/types/schema";

const MarketingHero: FC<{ isMobile: boolean; user: User }> = ({ isMobile, user }) => {
  const { globalState } = useAppContext();
  const { heroSection } = useThemeConfig();

  let bannerAlign = isMobile ? "bottom" : (heroSection?.banner?.align as bannerAlignment);

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
        return 500;
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

  return (
    <>
      <Flex
        vertical={bannerAlign === "bottom"}
        style={{
          flexDirection: getFlexDirection(bannerAlign as bannerAlignment),
        }}
        gap={bannerAlign === "bottom" ? 0 : 40}
        className={styles.heroContentContainer}
      >
        <Flex
          vertical
          align={bannerAlign === "bottom" ? "center" : "start"}
          justify={bannerAlign === "bottom" ? "center" : "flex-start"}
        >
          <h1 style={{ textAlign: getTextAlign(bannerAlign) }}>{heroSection && heroSection.title}</h1>
          <p style={{ textAlign: getTextAlign(bannerAlign) }}>{heroSection && heroSection.description}</p>

          <Space size={"large"} style={{ marginBottom: 50, padding: "0px 20px" }}>
            <Link href={user ? `${heroSection?.actionButtons?.primary?.link}` : `/login`}>
              <Button type="primary">{user ? heroSection?.actionButtons?.primary?.label : " Sign up for free"}</Button>
            </Link>
            <a href={heroSection?.actionButtons?.secondary?.link} aria-label="Contact us through mail">
              <Button className={styles.btn__contact}>{heroSection?.actionButtons?.secondary?.label}</Button>
            </a>
          </Space>
        </Flex>
        <Image
          alt="Website builder screenshot"
          height={625}
          width={getBannerWidth(bannerAlign as bannerAlignment)}
          loading="lazy"
          src={`${
            globalState.theme === Theme.dark && heroSection?.banner?.darkModePath
              ? heroSection.banner.darkModePath
              : heroSection?.banner?.lightModePath
          }`}
        />
      </Flex>
      {bannerAlign === "bottom" && <div className={styles.hero_img_bg}></div>}
    </>
  );
};

export default MarketingHero;
