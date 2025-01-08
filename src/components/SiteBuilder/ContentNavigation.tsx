import { FC } from "react";
import SvgIcons from "../SvgIcons";
import styles from "@/components/Layouts/SiteBuilder.module.scss";
import { Menu } from "antd";
import { useRouter } from "next/router";

const ContentNavigation: FC<{ activeMenu: string }> = ({ activeMenu }) => {
  const router = useRouter();
  return (
    <Menu
      mode="inline"
      onSelect={({ key }) => router.push(`/admin/site/content/${key}`)}
      defaultSelectedKeys={["blogs"]}
      rootClassName={styles.content__menu__wrapper}
      selectedKeys={[activeMenu]}
      style={{ width: "100%", borderInlineEnd: "none" }}
      items={[
        {
          label: "Blogs",
          key: "blogs",
          icon: (
            <i
              style={{ fontSize: 18 }}
              className={activeMenu === "blogs" ? styles.selected__menu__icon : styles.content__menu__icon}
            >
              {SvgIcons.newsPaper}
            </i>
          ),
        },
        {
          label: "Updates",
          key: "updates",
          icon: (
            <i
              style={{ fontSize: 18 }}
              className={activeMenu === "updates" ? styles.selected__menu__icon : styles.content__menu__icon}
            >
              {SvgIcons.update}
            </i>
          ),
        },
        {
          label: "Features",
          key: "features",
          icon: (
            <i
              style={{ fontSize: 18 }}
              className={activeMenu === "features" ? styles.selected__menu__icon : styles.content__menu__icon}
            >
              {SvgIcons.features}
            </i>
          ),
        },
        {
          label: "FAQ",
          key: "faq",
          icon: (
            <i
              style={{ fontSize: 18 }}
              className={activeMenu === "faq" ? styles.selected__menu__icon : styles.content__menu__icon}
            >
              {SvgIcons.faq}
            </i>
          ),
        },
        {
          label: "Testimonials",
          key: "testimonials",
          icon: (
            <i
              style={{ fontSize: 18 }}
              className={activeMenu === "testimonials" ? styles.selected__menu__icon : styles.content__menu__icon}
            >
              {SvgIcons.testimonials}
            </i>
          ),
        },
      ]}
    />
  );
};

export default ContentNavigation;
