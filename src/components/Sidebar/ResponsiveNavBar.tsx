import { FC } from "react";
import styles from "@/styles/Layout2.module.scss";
import { IResponsiveNavMenu, useAppContext } from "../ContextApi/AppContext";
import { Badge, Flex } from "antd";
import Link from "next/link";

const ResponsiveNavBar: FC<{
  items: {
    title: string;
    icon: React.JSX.Element;
    link: string;
    key: string;
  }[];
}> = ({ items }) => {
  const { globalState, dispatch } = useAppContext();
  return (
    <>
      <div className={styles.responsiveNavContainer}>
        {items.map((nav, i) => {
          return (
            <div key={i}>
              {nav.title === "Notifications" ? (
                <Badge
                  key={i}
                  color="blue"
                  classNames={{ indicator: styles.badgeIndicator }}
                  count={globalState.notifications && globalState.notifications > 0 ? globalState.notifications : 0}
                  style={{ fontSize: 8, paddingTop: 1.5 }}
                  size="small"
                >
                  <div
                    className={globalState.selectedResponsiveMenu === nav.link ? styles.selectedNavBar : styles.navBar}
                    onClick={() => dispatch({ type: "SET_NAVBAR_MENU", payload: nav.link as IResponsiveNavMenu })}
                  >
                    <Link href={`/${nav.link}`}>
                      <span></span>
                      <Flex vertical align="center" gap={5} justify="space-between">
                        <i>{nav.icon}</i>
                        <div className={styles.navTitle}>{nav.title}</div>
                      </Flex>
                    </Link>
                  </div>
                </Badge>
              ) : (
                <div
                  className={globalState.selectedResponsiveMenu === nav.key ? styles.selectedNavBar : styles.navBar}
                  onClick={() => dispatch({ type: "SET_NAVBAR_MENU", payload: nav.key as IResponsiveNavMenu })}
                >
                  <Link href={`/${nav.link}`}>
                    <span></span>
                    <Flex vertical align="center" gap={5} justify="space-between">
                      <i>{nav.icon}</i>
                      <div className={styles.navTitle}>{nav.title}</div>
                    </Flex>
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};
export default ResponsiveNavBar;
