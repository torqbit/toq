import appConstant from "@/services/appConstant";
import styles from "@/styles/Marketing/LandingPage/LandingPage.module.scss";

import { Flex } from "antd";
import Link from "next/link";
import Image from "next/image";
import SvgIcons from "@/components/SvgIcons";

const Footer = () => {
  const footerContent = [
    {
      title: "Resources",
      links: [
        {
          arialLabel: "link for updates page",
          href: "/updates",
          label: "Updates",
        },
        {
          arialLabel: "link for blogs page",

          href: "/blog",
          label: "Blog",
        },
        {
          arialLabel: "link for event page",

          href: "/events",
          label: "Events",
        },
      ],
    },
    {
      title: "More",
      links: [
        {
          arialLabel: "link for discord page",

          href: "https://discord.gg/DHU38pGw7C",
          label: "Discord",
        },
        {
          arialLabel: "link for Github page",

          href: "https://github.com/torqbit",
          label: "Github",
        },
        {
          arialLabel: "link for youtube ",

          href: "https://www.youtube.com/@torqbit",
          label: "Youtube",
        },
      ],
    },
    {
      title: "About Torqbit",
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
      arialLabel: "link to discord",

      icon: SvgIcons.discord,
      href: "https://discord.gg/NserMXcx",
    },
    {
      arialLabel: "link to github",

      icon: SvgIcons.github,
      href: "https://github.com/torqbit",
    },
    {
      arialLabel: "link to youtube",

      icon: SvgIcons.youtube,
      href: "https://www.youtube.com/@torqbit",
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
            {socialLinks.map((link, i) => {
              return (
                <Link key={i} href={link.href} aria-label={link.arialLabel}>
                  <i> {link.icon}</i>
                </Link>
              );
            })}
          </div>
        </div>

        <div>
          <div className={styles.linkWrapper}>
            {" "}
            {footerContent.map((content, i) => {
              return (
                <div key={i} className={styles.linkList}>
                  <div className={styles.title}>{content.title}</div>
                  <ul>
                    {content.links.map((link, i) => {
                      return (
                        <li key={i}>
                          <Link href={link.href} aria-label={link.arialLabel}>
                            {" "}
                            {link.label}
                          </Link>
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
