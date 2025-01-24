import { Button, Tooltip } from "antd";
import { FC } from "react";
import styles from "@/templates/standard/components/NavBar/NavBar.module.scss";
import { useAppContext } from "../ContextApi/AppContext";

import SvgIcons from "../SvgIcons";
import { Theme } from "@/types/theme";

const ThemeSwitch: FC<{ activeTheme: Theme; previewMode?: boolean }> = ({ activeTheme, previewMode }) => {
  const { dispatch, globalState } = useAppContext();
  const handleTheme = (theme: Theme) => {
    !previewMode && localStorage.setItem("theme", theme);
    dispatch({
      type: "SWITCH_THEME",
      payload: theme,
    });
  };
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
            handleTheme(globalState.theme === "dark" ? "light" : "dark");
          }}
          icon={
            <i style={{ lineHeight: 0, color: "var(--font-secondary)", fontSize: 20 }}>
              {activeTheme == "dark" ? SvgIcons.sun : SvgIcons.moon}
            </i>
          }
        />
      </Tooltip>
    </>
  );
};

export default ThemeSwitch;
