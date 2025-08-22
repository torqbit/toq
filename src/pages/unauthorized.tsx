import AppLayout from "@/components/Layouts/AppLayout";

import SvgIcons from "@/components/SvgIcons";
import { Button, Flex, Space } from "antd";
import { GetServerSidePropsContext, NextPage } from "next";
import { useRouter } from "next/router";
import { useMediaQuery } from "react-responsive";
import { getSiteConfig } from "@/services/getSiteConfig";
import { PageSiteConfig } from "@/services/siteConstant";
import { getCookieName } from "@/lib/utils";
import { Role, TenantRole, User } from "@prisma/client";
import MarketingLayout from "@/components/Layouts/MarketingLayout";
import { useSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

const UnAuthorized: NextPage<{ siteConfig: PageSiteConfig; userRole: Role }> = ({ siteConfig, userRole }) => {
  const router = useRouter();
  const isMobile = useMediaQuery({ query: "(max-width: 435px)" });
  const { data: user } = useSession();

  return (
    <>
      {userRole == Role.STUDENT ? (
        <MarketingLayout
          mobileHeroMinHeight={60}
          user={
            userRole
              ? ({
                  id: user?.id,
                  name: user?.user?.name || "",
                  email: user?.user?.email || "",
                  phone: user?.phone || "",
                  role: userRole,
                } as User)
              : undefined
          }
          siteConfig={siteConfig}
          homeLink={"/"}
        >
          <section
            style={{
              height: "calc(100vh - 250px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
            }}
          >
            <Space direction="vertical">
              <Flex justify="center" align="center" gap={5} vertical={isMobile}>
                <i style={{ lineHeight: 0, color: "var(--font-primary)", fontSize: 30 }}>{SvgIcons.lock}</i>{" "}
                <h1 style={{ textAlign: "center", margin: 0, fontSize: isMobile ? "2rem" : "2.8rem" }}>
                  You are not authorized to view this page
                </h1>
              </Flex>
              <Flex align="center" justify="center" gap={20}>
                <Button onClick={() => router.push("/dashboard")}>Go Home</Button>
              </Flex>
            </Space>
          </section>
        </MarketingLayout>
      ) : (
        <AppLayout siteConfig={siteConfig}>
          <section
            style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
          >
            <Space direction="vertical">
              <Flex justify="center" align="center" gap={5} vertical={isMobile}>
                <i style={{ lineHeight: 0, color: "var(--font-primary)", fontSize: 30 }}>{SvgIcons.lock}</i>{" "}
                <h1 style={{ textAlign: "center", margin: 0 }}>You are not authorized to view this page</h1>
              </Flex>
              <Flex align="center" justify="center" gap={20}>
                <Button onClick={() => router.push("/dashboard")}>Go Home</Button>
              </Flex>
            </Space>
          </section>
        </AppLayout>
      )}
    </>
  );
};

export default UnAuthorized;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { req, res } = ctx;
  const domain = req.headers.host || "";

  const siteConfig = await getSiteConfig(ctx.res, domain);
  let cookieName = getCookieName();
  const user = await getServerSession(req, res, await authOptions(req));

  const { site } = siteConfig;
  let userRole = user?.role;
  if (user?.role == Role.CUSTOMER && user.tenant?.role == TenantRole.OWNER) {
    userRole = Role.AUTHOR;
  }
  if (user?.role == Role.CUSTOMER && user.tenant?.role == TenantRole.MEMBER) {
    userRole = Role.STUDENT;
  }

  return {
    props: {
      siteConfig: site,
      userRole,
    },
  };
};
