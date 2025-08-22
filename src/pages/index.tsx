import React, { FC, useEffect } from "react";
import { ActivityType, Role, TenantRole, User } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import { PageSiteConfig } from "@/services/siteConstant";
import { getSiteConfig } from "@/services/getSiteConfig";

import { UpdateActivitiesStats } from "@/actions/updateActivitiesStats";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { useAppContext } from "@/components/ContextApi/AppContext";
import { useSession } from "next-auth/react";
import AppLayout from "@/components/Layouts/AppLayout";
import MarketingAppLayout from "@/components/Layouts/MarketingAppLayout";
import AIChatWidget from "@/components/AIConversation/AIChatWidget";

interface IProps {
  user: User;
  siteConfig: PageSiteConfig;
  tenantRole: TenantRole;
}

const LandingPage: FC<IProps> = ({ user, siteConfig, tenantRole }) => {
  const { dispatch } = useAppContext();
  const { data: session } = useSession();
  useEffect(() => {
    dispatch({
      type: "SET_SITE_CONFIG",
      payload: siteConfig,
    });
    dispatch({
      type: "SET_USER",
      payload: { ...session, role: session?.role, tenantRole: session?.tenant?.role },
    });
  }, []);

  return (
    <>
      {user && user.role == Role.CUSTOMER ? (
        <AppLayout siteConfig={siteConfig} previewMode>
          <AIChatWidget userName={user.name} readOnly={false} />
        </AppLayout>
      ) : (
        <MarketingAppLayout
          siteConfig={siteConfig}
          user={user}
          previewMode={false}
          navBarWidth={"100%"}
          homeLink={"/"}
          heroSection={
            <>
              <AIChatWidget userName={"Guest"} readOnly={false} />
            </>
          }
        ></MarketingAppLayout>
      )}
    </>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { res, req } = ctx;
  const domain = req.headers.host || "";
  const user = await getServerSession(req, res, await authOptions(req));
  const { site } = await getSiteConfig(res, domain);
  const siteConfig = site;

  if (user) {
    return {
      props: {
        user: JSON.parse(JSON.stringify(user)),
        siteConfig,
        tenantRole: user?.tenant?.role || null,
      },
    };
  } else {
    return {
      props: {
        user: null,
        siteConfig,
        tenantRole: null,
      },
    };
  }
};
export default LandingPage;
