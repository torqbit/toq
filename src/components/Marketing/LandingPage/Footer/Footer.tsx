import styles from "./Footer.module.scss";
import { Flex } from "antd";
import Link from "next/link";
import Image from "next/image";
import SvgIcons from "@/components/SvgIcons";
import { FC } from "react";
import { PageThemeConfig } from "@/services/themeConstant";

const Footer: FC<{ themeConfig: PageThemeConfig; isMobile: boolean }> = ({ themeConfig, isMobile }) => {
  const { footer, navBar, brand } = themeConfig;

  const footerContent = [
    {
      title: "Resources",
      links: navBar?.navigationLinks?.map((nav) => {
        return {
          href: nav.link,
          label: nav.title,
        };
      }),
    },
    {
      title: "Community",
      links: [
        {
          href: footer?.discordLink,
          label: "Discord",
        },
        {
          href: footer?.githubLink,
          label: "Github",
        },
        {
          href: footer?.youtubeLink,
          label: "Youtube",
        },
        {
          href: footer?.instagramLink,
          label: "Instagram",
        },
        {
          href: footer?.twitterLink,
          label: "Twitter",
        },
      ],
    },
    {
      title: "About ",
      links: [
        {
          arialLabel: "link for story page",

          href: "/story",
          label: "The Story",
        },
        {
          arialLabel: "link for team page",

          href: "#",
          label: "Team",
        },
        {
          arialLabel: "link for contact page",

          href: "/contact-us",
          label: "Contact Us",
        },
      ],
    },
    {
      title: "Legal",
      links: [
        {
          arialLabel: "link for terms & conditions page",

          href: "/terms-and-conditions",
          label: "Terms & Conditions",
        },
        {
          arialLabel: "link for privacy page",

          href: "/privacy-policy",
          label: "Privacy Policy",
        },
        {
          arialLabel: "link for refund policy page",
          href: "/terms-and-conditions/#refund",
          label: "Refund & Cancellation Policy",
        },
      ],
    },
  ];

  return (
    <section className={styles.footerContainer}>
      <footer>
        <div>
          <Link href={"/landing-page"}>
            <Flex align="center" gap={5}>
              <Image src={`${brand?.logo}`} height={40} width={40} alt={"logo"} loading="lazy" />
              <h1 className="font-brand">{brand?.name}</h1>
            </Flex>
          </Link>
          <p>{footer?.tagLine}</p>
        </div>

        <div>
          <div className={styles.linkWrapper}>
            {footerContent.map((content, i) => {
              return (
                <div key={i} className={styles.linkList}>
                  <h4 className={styles.title}>{content.title}</h4>
                  <ul>
                    {content?.links?.map((link, i) => {
                      return (
                        <li key={i} style={{ display: !link.href ? "none" : "block" }}>
                          <Link href={`${link.href}`}> {link.label}</Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </footer>
    </section>
  );
};

export default Footer;
