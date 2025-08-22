import { DEFAULT_THEME, PageSiteConfig } from "@/services/siteConstant";
import { FC } from "react";
import { useAppContext } from "../ContextApi/AppContext";
import { useRouter } from "next/router";
import { Button, Card, Flex } from "antd";

const NotFound: FC<{ siteConfig: PageSiteConfig; title?: string }> = ({ siteConfig, title }) => {
  const { globalState } = useAppContext();
  const router = useRouter();
  return (
    <section
      style={{
        height: "calc(100vh - 250px)",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card style={{ width: "40vw" }}>
        <Flex vertical gap={0} align="center" justify="center">
          <Flex align="center" gap={5}>
            <img
              src={globalState.theme === "dark" ? `${DEFAULT_THEME?.brand?.darkLogo}` : `${DEFAULT_THEME?.brand?.logo}`}
              height={40}
              width={"auto"}
              alt={"logo"}
              loading="lazy"
            />
          </Flex>
          <Flex align="center" gap={10}>
            <div>
              <Flex gap={0} vertical align="center">
                <h1 style={{ margin: 0 }}>404</h1>
                <h2>{title ? title : "Page Not Found"}</h2>
              </Flex>
            </div>
          </Flex>
          <Button
            onClick={() => {
              router.push(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/`);
            }}
            type="primary"
          >
            Go Home
          </Button>
        </Flex>
      </Card>
    </section>
  );
};

export default NotFound;
