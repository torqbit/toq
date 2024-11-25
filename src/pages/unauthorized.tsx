import AppLayout from "@/components/Layouts/AppLayout";

import SvgIcons from "@/components/SvgIcons";
import { Button, Flex, Space } from "antd";
import { GetServerSidePropsContext, NextPage } from "next";
import { useRouter } from "next/router";
import { useMediaQuery } from "react-responsive";
import { getSiteConfig } from "@/services/getSiteConfig";
import { PageSiteConfig } from "@/services/siteConstant";

const UnAuthorized: NextPage<{ siteConfig: PageSiteConfig }> = ({ siteConfig }) => {
  const router = useRouter();
  const isMobile = useMediaQuery({ query: "(max-width: 435px)" });

  return (
    <AppLayout siteConfig={siteConfig}>
      <section
        style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
      >
        <Space direction="vertical">
          <Flex justify="center" gap={5} vertical={isMobile}>
            <i style={{ textAlign: "center" }}>{SvgIcons.lock}</i>{" "}
            <h1 style={{ textAlign: "center" }}>You are not authorized to view this page</h1>
          </Flex>
          <Flex align="center" justify="center" gap={20}>
            {router.query.from === "lesson" && (
              <Button type="primary" onClick={() => router.push("/courses")}>
                <Flex justify="space-between" gap={10}>
                  Browse Courses {SvgIcons.arrowRight}
                </Flex>{" "}
              </Button>
            )}
            <Button onClick={() => router.push("/dashboard")}>Go Home</Button>
          </Flex>
        </Space>
      </section>
    </AppLayout>
  );
};

export default UnAuthorized;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const siteConfig = getSiteConfig();
  const { site } = siteConfig;
  return {
    props: {
      siteConfig: site,
    },
  };
};
