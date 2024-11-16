import { FC, ReactElement, useEffect } from "react";
import Image from "next/image";
import { Button, Flex, Tooltip } from "antd";
import Link from "next/link";
import SvgIcons from "@/components/SvgIcons";
import { useAppContext } from "@/components/ContextApi/AppContext";
import { INavBarProps } from "@/types/courses/navbar";
import { useThemeConfig } from "@/components/ContextApi/ThemeConfigContext";
import styles from "./NavBar.module.scss";
import { onChangeTheme } from "@/lib/utils";
import ThemeSwitch from "@/components/ThemeSwitch/ThemeSwitch";

const NavBar: FC<INavBarProps> = ({ user, items, brand, showThemeSwitch, activeTheme }): ReactElement => {
  const { dispatch } = useAppContext();
  return (
    <div className={styles.navBarContainer}>
      <nav>
        <Link href={"/"} aria-label="Go back to landing page">
          <Flex align="center" gap={5}>
            {typeof brand?.logo === "string" ? (
              <Image src={brand.logo} height={40} width={40} alt={"logo"} />
            ) : (
              brand?.logo
            )}
            <h1 className="font-brand">{brand?.name?.toUpperCase()}</h1>
          </Flex>
        </Link>
        <div className={styles.link_wrapper}>
          {items.length === 0 ? (
            <div></div>
          ) : (
            <ul>
              {items.map((navigation, i) => {
                return (
                  <li key={i}>
                    <Link href={navigation.link} aria-label={`link to ${navigation.title} page`}>
                      {navigation.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
          <Flex align="center" gap={20}>
            {showThemeSwitch && (
              // <Tooltip title={"Switch Theme"}>
              //   <Button
              //     type="default"
              //     name="theme button"
              //     aria-label="Theme Switch"
              //     className={styles.switchBtn}
              //     shape="circle"
              //     onClick={() => {
              //       onChangeTheme(dispatch, showThemeSwitch);
              //     }}
              //     icon={activeTheme == "dark" ? SvgIcons.sun : SvgIcons.moon}
              //   />
              // </Tooltip>
              <ThemeSwitch activeTheme={activeTheme} />
            )}

            <Link href={user ? `/dashboard` : `/login`} aria-label="Get started">
              <Button type="primary">{user ? "Go to Dashboard" : "Get Started"}</Button>
            </Link>
          </Flex>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
