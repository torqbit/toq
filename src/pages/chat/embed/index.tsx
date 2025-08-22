import ChatEmbedWidget from "@/components/AIConversation/ChatEmbed/ChatEmbedWidget";
import { useAppContext } from "@/components/ContextApi/AppContext";
import { getSiteConfig } from "@/services/getSiteConfig";
import { PageSiteConfig } from "@/services/siteConstant";
import { ConfigProvider } from "antd";
import { GetServerSidePropsContext, NextPage } from "next";
import { useRouter } from "next/router";
import { Theme } from "@/types/theme";

const ChatEmbedPage: NextPage<{ domain: string; siteConfig: PageSiteConfig }> = ({ siteConfig }) => {
  const { globalState } = useAppContext();
  const router = useRouter();
  return (
    <ChatEmbedWidget siteConfig={siteConfig} theme={(router.query.theme as Theme) || globalState.theme || "light"} />
  );
};
export default ChatEmbedPage;
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const domain = ctx.req.headers.host || "";
  const siteConfig = await getSiteConfig(ctx.res, domain);
  const { site } = siteConfig;

  return {
    props: {
      domain,
      siteConfig: site,
    },
  };
};
