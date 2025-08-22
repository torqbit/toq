import React, { FC, useState } from "react";
import Link from "next/link";
import { Avatar, Button, Drawer, Dropdown, Flex, MenuProps } from "antd";
import styles from "./NavBar.module.scss";
import { INavBarProps } from "@/types/landing/navbar";
import ThemeSwitch from "@/components/ThemeSwitch/ThemeSwitch";
import Hamburger from "hamburger-react";
import { Role } from "@prisma/client";
import SvgIcons from "@/components/SvgIcons";
import ResponsiveAppNavBar from "./ResponsiveAppNavBar";
import DOMPurify from "isomorphic-dompurify";
import { Theme } from "@/types/theme";
import { isValidImagePath } from "@/lib/utils";
import appConstant from "@/services/appConstant";
import ResponsiveNavBar from "@/components/Sidebar/ResponsiveNavBar";
import { getSiderMenu } from "@/components/Layouts/NavigationItems";
import { useAppContext } from "@/components/ContextApi/AppContext";
import { UserOutlined } from "@ant-design/icons";
import { signOut, useSession } from "next-auth/react";

const authorizedUrls = appConstant.authorizedUrls;

const MobileNav: FC<INavBarProps> = ({ items, showThemeSwitch, activeTheme, brand, previewMode, user, siteConfig }) => {
  const [showSideNav, setSideNav] = useState(false);
  const { globalState, dispatch } = useAppContext();
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const { data: session } = useSession();
  const onAnchorClick = () => {
    dispatch({ type: "SET_RESPONSIVE_SIDE_NAV", payload: false });
  };

  const getLogoSrc = (activeTheme: Theme) => {
    switch (activeTheme) {
      case "dark":
        return isValidImagePath(`${brand?.darkLogo}`) ? DOMPurify.sanitize(`${brand?.darkLogo}`) : "";

      default:
        return isValidImagePath(`${brand?.logo}`) ? DOMPurify.sanitize(`${brand?.logo}`) : "";
    }
  };
  const userDropdownMenu: MenuProps["items"] = [
    {
      icon: (
        <Flex
          align="center"
          justify="center"
          className={styles.invalid__img}
          style={{
            border: "1px solid var(--border-color)",
            borderRadius: "50%",
            padding: 5,
            marginLeft: -5,
          }}
        >
          <UserOutlined size={15} style={{ fontSize: 15 }} />
        </Flex>
      ),
      key: "0",
      onClick: () => {
        setDropdownOpen(false);
      },
      label: <Link href={`/settings`}>View Profile</Link>,
      style: {
        width: 250,
        height: 60,
        paddingLeft: "1rem",
        paddingRight: "1rem",
      },
    },

    {
      icon: <i style={{ lineHeight: 0, fontSize: 25 }}>{SvgIcons.logout}</i>,

      key: "2",
      label: <>Logout</>,
      onClick: async () => {
        setDropdownOpen(false);
        await signOut({
          callbackUrl: `/login`,
        });
      },
      style: {
        width: 250,
        height: 60,
        paddingLeft: "1rem",
        paddingRight: "1rem",
      },
    },
  ];
  return (
    <>
      <>
        <section className={styles.sideNaveContainer}>
          <Drawer
            classNames={{ header: styles.drawerHeader }}
            styles={{ body: { padding: 0 } }}
            title={
              <div className={styles.drawerTitle}>
                <Link href={"/"} aria-label="Go back to landing page">
                  <Flex align="center" gap={5}>
                    {typeof brand?.logo === "string" && typeof brand.darkLogo === "string" ? (
                      <img
                        src={getLogoSrc(activeTheme)}
                        style={{ width: "auto", height: 30 }}
                        alt={`logo of ${brand.name}`}
                      />
                    ) : (
                      brand?.logo
                    )}
                    {!brand?.logo && (
                      <Flex align="center" gap={10}>
                        <img
                          src={isValidImagePath(`${brand?.icon}`) ? DOMPurify.sanitize(`${brand?.icon}`) : ""}
                          style={{ width: "auto", height: 30 }}
                          alt={`logo of ${brand?.name}`}
                        />
                        <h1 className="font-brand">{brand?.name}</h1>
                      </Flex>
                    )}
                  </Flex>
                </Link>
                <Flex align="center" gap={10}>
                  {showSideNav && showThemeSwitch && (
                    <ThemeSwitch activeTheme={activeTheme} previewMode={previewMode} />
                  )}
                  {user && (
                    <Dropdown
                      open={dropdownOpen}
                      onOpenChange={(v) => setDropdownOpen(v)}
                      menu={{ items: userDropdownMenu }}
                      trigger={["click"]}
                      placement="bottomRight"
                      arrow={{ pointAtCenter: true }}
                    >
                      <Flex
                        align="center"
                        gap={5}
                        style={{ cursor: "pointer" }}
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                      >
                        <Avatar src={session?.user?.image} icon={<UserOutlined />} />
                        <i style={{ lineHeight: 0, color: "var(--font-secondary)", fontSize: 20 }}>
                          {SvgIcons.chevronDown}
                        </i>
                      </Flex>
                    </Dropdown>
                  )}
                </Flex>
              </div>
            }
            placement="left"
            width={300}
            closable={false}
            onClose={onAnchorClick}
            open={globalState.responsiveSideNav}
          >
            <ResponsiveNavBar
              user={user}
              menu={getSiderMenu(
                siteConfig,
                globalState.chatList,
                previewMode ? undefined : user?.tenant?.role,
                previewMode
              )}
            />
          </Drawer>
        </section>
        <div className={styles.responsive__header}>
          {!user && (
            <Link href={`${previewMode ? "#" : "/login"}`} aria-label="Get started">
              <Button type="primary">Login</Button>
            </Link>
          )}
          <Link href={"/"}>
            <Flex align="center" gap={5}>
              {typeof brand?.logo === "string" && typeof brand.darkLogo === "string" ? (
                <img
                  src={activeTheme == "dark" ? DOMPurify.sanitize(brand?.darkLogo) : DOMPurify.sanitize(brand?.logo)}
                  style={{ width: "auto", height: 30 }}
                  alt={`logo of ${brand.name}`}
                />
              ) : (
                brand?.logo
              )}
              {!brand?.logo && (
                <Flex align="center" gap={10}>
                  <img
                    src={isValidImagePath(`${brand?.icon}`) ? DOMPurify.sanitize(`${brand?.icon}`) : ""}
                    style={{ width: "auto", height: 30 }}
                    alt={`logo of ${brand?.name}`}
                  />
                  <h1 className="font-brand">{brand?.name}</h1>
                </Flex>
              )}
            </Flex>
          </Link>
          <div role="button" style={{ color: "var(--font-primary)" }} aria-label="Toggle menu">
            <Hamburger
              rounded
              direction="left"
              color="var(--font-primary)"
              toggled={showSideNav}
              onToggle={(toggle: boolean | ((prevState: boolean) => boolean)) => {
                dispatch({ type: "SET_RESPONSIVE_SIDE_NAV", payload: toggle as any });
              }}
            />
          </div>
        </div>
      </>
    </>
  );
};

export default MobileNav;
