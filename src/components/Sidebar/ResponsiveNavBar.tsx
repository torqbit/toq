import { FC, useEffect, useState } from "react";
import styles from "@/styles/Layout2.module.scss";
import { IResponsiveNavMenu, ISiderMenu, useAppContext } from "../ContextApi/AppContext";
import { Badge, Flex, Menu, MenuProps } from "antd";
import { TenantRole, User } from "@prisma/client";
import { useRouter } from "next/router";

const ResponsiveNavBar: FC<{
  user?: any;
  menu: MenuProps["items"];
}> = ({ menu, user }) => {
  const { globalState, dispatch } = useAppContext();
  const router = useRouter();
  let defaultOpenKeys = menu?.filter((m: any) => m.children && m.children.length > 0).map((m) => m?.key);
  const [openKeys, setOpenKeys] = useState<string[]>(defaultOpenKeys as string[]);
  useEffect(() => {
    if (globalState.chatList.length > 0 && !openKeys.includes("group-3")) {
      setOpenKeys([...openKeys, "group-3"]);
    }
  }, [globalState.chatList]);

  const getDefaultSelectedSideMenu = () => {
    switch (user?.tenant?.role) {
      case TenantRole.ADMIN:
        return "dashboard";

      case TenantRole.OWNER:
        return router.pathname == "/" ? "home" : "dashboard";

      case TenantRole.MEMBER:
        return "home";

      default:
        return "home";
    }
  };
  return (
    <>
      <Menu
        mode="inline"
        rootClassName={styles.content__menu__wrapper}
        onSelect={(value) => dispatch({ type: "SET_SELECTED_SIDER_MENU", payload: value.key as ISiderMenu })}
        defaultSelectedKeys={[getDefaultSelectedSideMenu()]}
        openKeys={openKeys}
        onOpenChange={(e) => {
          setOpenKeys(e);
        }}
        onClick={(v) => {
          dispatch({ type: "SET_RESPONSIVE_SIDE_NAV", payload: false });
        }}
        className={styles.menu}
        selectedKeys={[globalState.selectedSiderMenu]}
        style={{ width: "100%", borderInlineEnd: "none" }}
        items={menu}
      />
    </>
  );
};
export default ResponsiveNavBar;
