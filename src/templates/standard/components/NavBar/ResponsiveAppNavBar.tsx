import { FC, useEffect } from "react";
import styles from "./NavBar.module.scss";
import { Badge, Flex } from "antd";
import { IResponsiveNavMenu, useAppContext } from "@/components/ContextApi/AppContext";
import Link from "next/link";
import { useRouter } from "next/router";
import { Role } from "@prisma/client";

const ResponsiveAppNavBar: FC<{
  menuItems: {
    title: string;
    icon: React.JSX.Element;
    link: string;
    key: string;
  }[];
  userRole: Role;
}> = ({ menuItems, userRole }) => {
  const { globalState, dispatch } = useAppContext();
  const router = useRouter();

  const onChangeSelectedNavBar = () => {
    let selectedMenu = router.pathname.split("/")[1];
    if (selectedMenu == "admin" && userRole !== Role.STUDENT) {
      if (router.pathname.split("/")[3] === "path") {
        selectedMenu = "academy";
      } else {
        selectedMenu = router.pathname.split("/")[2];
      }
      selectedMenu = router.pathname.split("/")[2];
    }
    if (userRole == Role.STUDENT && router.pathname == "/") {
      selectedMenu = "dashboard";
    }
    if (
      router.pathname.startsWith("/academy") ||
      router.pathname.startsWith("/path") ||
      router.pathname.startsWith("/courses")
    ) {
      selectedMenu = "academy";
    }

    dispatch({ type: "SET_NAVBAR_MENU", payload: selectedMenu as IResponsiveNavMenu });
  };
  useEffect(() => {
    onChangeSelectedNavBar();
  }, []);
  return (
    <div className={styles.responsiveNavContainer}>
      {menuItems.map((nav, i) => {
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
                  key={i}
                  className={globalState.selectedResponsiveMenu === nav.link ? styles.selectedNavBar : styles.navBar}
                  onClick={() => dispatch({ type: "SET_NAVBAR_MENU", payload: nav.link as IResponsiveNavMenu })}
                >
                  <Link key={i} href={`/${nav.link}`}>
                    <span></span>
                    <Flex vertical align="center" gap={5} justify="space-between">
                      <i style={{ fontSize: 18, lineHeight: 0, color: "var(--font-secondary)" }}>{nav.icon}</i>
                      <div className={styles.navTitle}>{nav.title}</div>
                    </Flex>
                  </Link>
                </div>
              </Badge>
            ) : (
              <div
                key={i}
                className={globalState.selectedResponsiveMenu === nav.key ? styles.selectedNavBar : styles.navBar}
                onClick={() => dispatch({ type: "SET_NAVBAR_MENU", payload: nav.key as IResponsiveNavMenu })}
              >
                <Link key={i} href={`/${nav.link}`}>
                  <span></span>
                  <Flex vertical align="center" gap={5} justify="space-between">
                    <i style={{ fontSize: 18, lineHeight: 0, color: "var(--font-secondary)" }}>{nav.icon}</i>
                    <div className={styles.navTitle}>{nav.title}</div>
                  </Flex>
                </Link>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ResponsiveAppNavBar;
