import { useAppContext } from "@/components/ContextApi/AppContext";
import BasicInfo from "@/components/OnBoarding/BasicInfo/BasicInfo";
import antThemeConfig from "@/services/antThemeConfig";
import AuthService from "@/services/auth/AuthService";
import darkThemeConfig from "@/services/darkThemeConfig";
import { getSiteConfig } from "@/services/getSiteConfig";
import { PageSiteConfig } from "@/services/siteConstant";
import { Theme } from "@/types/theme";
import { LoadingOutlined } from "@ant-design/icons";
import { TenantRole } from "@prisma/client";
import { ConfigProvider, Spin } from "antd";
import { GetServerSidePropsContext, NextPage } from "next";
import { getServerSession } from "next-auth";
import { useEffect } from "react";
import { authOptions } from "./api/auth/[...nextauth]";

const OnboardPage: NextPage<{ siteConfig: PageSiteConfig }> = ({ siteConfig }) => {
  const { globalState, dispatch } = useAppContext();

  const setGlobalTheme = (theme: Theme) => {
    dispatch({
      type: "SWITCH_THEME",
      payload: theme,
    });
  };
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
    setGlobalTheme(localStorage.getItem("theme") as Theme);
    if (localStorage.getItem("theme")) {
      dispatch({
        type: "SET_LOADER",
        payload: false,
      });
    }
  };
  useEffect(() => {
    onCheckTheme();
  }, []);
  return (
    <ConfigProvider theme={globalState.theme == "dark" ? darkThemeConfig(siteConfig) : antThemeConfig(siteConfig)}>
      <Spin spinning={globalState.pageLoading} indicator={<LoadingOutlined spin />} fullscreen size="large" />

      {!globalState.pageLoading && (
        <BasicInfo
          title={"Set up your Workspace"}
          description={"Don't worry, you can always change this later."}
          siteConfig={siteConfig}
        />
      )}
    </ConfigProvider>
  );
};

export default OnboardPage;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req, res } = ctx;

  const domain = req.headers.host || "..";

  const { site } = await getSiteConfig(res, domain);

  const siteConfig = site;
  const token = await getServerSession(req, res, await authOptions(req));
  const tenants = await AuthService.getTenantsByUserId(token?.id || "", TenantRole.OWNER);
  const tenantsWithOwnerRole = tenants.find((tenant) => !process.env.NEXTAUTH_URL?.includes(tenant.tenant.domain));

  if (tenantsWithOwnerRole) {
    return {
      redirect: {
        destination: `/login/sso`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      siteConfig,
    },
  };
};
