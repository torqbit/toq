import styles from "./Footer.module.scss";
import { Flex, Tooltip } from "antd";
import Link from "next/link";
import Image from "next/image";
import SvgIcons from "@/components/SvgIcons";
import { FC } from "react";
import { DEFAULT_THEME, PageSiteConfig } from "@/services/siteConstant";
import { Theme } from "@/types/theme";
import { isValidImagePath } from "@/lib/utils";
import DOMPurify from "isomorphic-dompurify";
import { useAppContext } from "@/components/ContextApi/AppContext";

const Footer: FC<{ siteConfig: PageSiteConfig; homeLink: string; isMobile: boolean; activeTheme: Theme }> = ({
  siteConfig,
  isMobile,
  homeLink,
  activeTheme,
}) => {
  const { brand } = siteConfig;

  const getLogoSrc = (activeTheme: Theme) => {
    switch (activeTheme) {
      case "dark":
        return isValidImagePath(`${brand?.darkLogo}`) ? DOMPurify.sanitize(`${brand?.darkLogo}`) : "";

      default:
        return isValidImagePath(`${brand?.logo}`) ? DOMPurify.sanitize(`${brand?.logo}`) : "";
    }
  };

  const socialLinks = [
    {
      href: brand?.socialLinks?.discord,
      icon: <i>{SvgIcons.discord}</i>,
      name: "Discord",
    },
    {
      href: brand?.socialLinks?.github,
      icon: <i>{SvgIcons.github}</i>,
      name: "Github",
    },
    {
      href: brand?.socialLinks?.youtube,
      icon: <i>{SvgIcons.youtube}</i>,
      name: "Youtube",
    },
    {
      href: brand?.socialLinks?.instagram,
      icon: <i>{SvgIcons.instagram}</i>,
      name: "Instagram",
    },
    {
      href: brand?.socialLinks?.xcom,
      icon: <i>{SvgIcons.XIcon}</i>,
      name: "X.com",
    },
  ];
  const { globalState } = useAppContext();

  return (
    <section className={styles.footerContainer}>
      <footer>
        <div>
          {globalState.theme == "light" &&
          brand?.logo == DEFAULT_THEME.brand.logo &&
          window.location.origin !== process.env.NEXT_PUBLIC_NEXTAUTH_URL ? (
            <>
              <h1 className="font-brand" style={{ marginLeft: 15 }}>
                {brand?.name}
              </h1>
            </>
          ) : (
            <Link href={DOMPurify.sanitize(homeLink)}>
              <Flex align="center" gap={5}>
                {siteConfig.brand &&
                typeof siteConfig.brand?.logo === "string" &&
                typeof siteConfig.brand?.darkLogo === "string" ? (
                  <Image
                    className={styles.logo_img}
                    src={getLogoSrc(activeTheme)}
                    height={100}
                    alt={`logo of ${siteConfig.brand?.name}`}
                    width={200}
                    style={{ width: "auto", height: 30, cursor: "pointer" }}
                  />
                ) : (
                  siteConfig.brand?.logo
                )}

                {!brand?.logo && <h1 className="font-brand">{brand?.name}</h1>}
              </Flex>
            </Link>
          )}
        </div>

        <Flex gap={10}>
          {socialLinks.map((link, i) => {
            if (link.href) {
              return (
                <Tooltip title={link.name} key={i}>
                  <Link className={styles.social__links__icon} href={link.href}>
                    {link.icon}
                  </Link>
                </Tooltip>
              );
            }
          })}
        </Flex>
        <div className={styles.powered__by}>
          <Link href="https://torqbit.com " target="_blank">
            <p>Powered by Torqbit</p>
          </Link>
        </div>
      </footer>
    </section>
  );
};

export default Footer;
