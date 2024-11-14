import appConstant from "@/services/appConstant";
import styles from "@/styles/Marketing/LandingPage/LandingPage.module.scss";

import { Flex } from "antd";
import Link from "next/link";
import Image from "next/image";
import SvgIcons from "@/components/SvgIcons";
import { useThemeConfig } from "@/components/ContextApi/ThemeConfigContext";

const Footer = () => {
  const { footer, navBar } = useThemeConfig();
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
  const socialLinks = [
    {
      icon: SvgIcons.discord,
      href: footer?.discordLink,
    },
    {
      icon: SvgIcons.github,
      href: footer?.githubLink,
    },
    {
      icon: SvgIcons.youtube,
      href: footer?.youtubeLink,
    },
    {
      icon: SvgIcons.youtube,
      href: footer?.instagramLink,
    },
    {
      icon: SvgIcons.youtube,
      href: footer?.twitterLink,
    },
  ];
  return (
    <section className={styles.footerContainer}>
      <footer>
        <div>
          <Link href={"/landing-page"}>
            <Flex align="center" gap={5}>
              <Image src={"/icon/torqbit.png"} height={40} width={40} alt={"logo"} loading="lazy" />
              <h1 className="font-brand">{appConstant.platformName.toUpperCase()}</h1>
            </Flex>
          </Link>
          <div className={styles.socialIcons}>
            {socialLinks?.map((social, i) => {
              return (
                <Link key={i} href={`${social.href}`} style={{ display: !social.href ? "none" : "unset" }}>
                  <i> {social.icon}</i>
                </Link>
              );
            })}
          </div>
        </div>

        <div>
          <div className={styles.linkWrapper}>
            {footerContent.map((content, i) => {
              return (
                <div key={i} className={styles.linkList}>
                  <div className={styles.title}>{content.title}</div>
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
