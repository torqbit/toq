import AppLayoutfrom "@/components/Layouts/Layout2";
import SvgIcons from "@/components/SvgIcons";
import { Button, Flex, Space } from "antd";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useMediaQuery } from "react-responsive";

const UnAuthorized: NextPage = () => {
  const router = useRouter();
  const isMobile = useMediaQuery({ query: "(max-width: 435px)" });

  return (
    <Layout2>
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
    </Layout2>
  );
};

export default UnAuthorized;
