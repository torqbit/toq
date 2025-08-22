import AIChatWidget from "@/components/AIConversation/AIChatWidget";
import { useAppContext } from "@/components/ContextApi/AppContext";
import antThemeConfig from "@/services/antThemeConfig";
import darkThemeConfig from "@/services/darkThemeConfig";
import { PageSiteConfig } from "@/services/siteConstant";
import { Theme } from "@/types/theme";
import { ConfigProvider } from "antd";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FC, useEffect } from "react";

const ChatEmbedWidget: FC<{ siteConfig: PageSiteConfig; theme: Theme }> = ({ siteConfig, theme }) => {
  const { dispatch, globalState } = useAppContext();
  const { data: user, status } = useSession();
  const router = useRouter();
  useEffect(() => {
    onCheckTheme();
  }, [theme]);
  const onCheckTheme = () => {
    const currentTheme = localStorage.getItem("theme");

    if (siteConfig.brand?.themeSwitch && currentTheme) {
      localStorage.setItem("theme", currentTheme);
    } else {
      if (siteConfig.brand?.defaultTheme) {
        localStorage.setItem("theme", siteConfig.brand?.defaultTheme);
      } else {
        localStorage.setItem("theme", "light");
      }
    }
    dispatch({
      type: "SWITCH_THEME",
      payload: localStorage.getItem("theme") as Theme,
    });

    dispatch({
      type: "SET_SITE_CONFIG",
      payload: siteConfig,
    });

    if (localStorage.getItem("theme")) {
      if (!globalState.appLoaded) {
        dispatch({ type: "SET_APP_LOADED", payload: true });
      }

      dispatch({
        type: "SET_LOADER",
        payload: false,
      });
    }
  };

  return (
    <ConfigProvider theme={theme == "dark" ? darkThemeConfig(siteConfig) : antThemeConfig(siteConfig)}>
      <div style={{ padding: 20 }}>
        <AIChatWidget
          agentId={(router.query.agentId as string) || undefined}
          showPoweredBy
          userName={user?.user?.name || "Guest"}
          previewMode
          readOnly={false}
        />
      </div>
    </ConfigProvider>
  );
};
export default ChatEmbedWidget;
