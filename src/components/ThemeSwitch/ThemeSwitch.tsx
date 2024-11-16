import { onChangeTheme } from "@/lib/utils";
import { Button, Tooltip } from "antd";
import { FC } from "react";
import styles from "@/components/Marketing/LandingPage/NavBar/NavBar.module.scss";
import { useAppContext } from "../ContextApi/AppContext";
import { Theme } from "@prisma/client";
import SvgIcons from "../SvgIcons";

const ThemeSwitch: FC<{ activeTheme: Theme }> = ({ activeTheme }) => {
  const { dispatch } = useAppContext();
  return (
    <>
      <Tooltip title={"Switch Theme"}>
        <Button
          type="default"
          name="theme button"
          aria-label="Theme Switch"
          className={styles.switchBtn}
          shape="circle"
          onClick={() => {
            onChangeTheme(dispatch, true);
          }}
          icon={activeTheme == "dark" ? SvgIcons.sun : SvgIcons.moon}
        />
      </Tooltip>
    </>
  );
};

export default ThemeSwitch;
