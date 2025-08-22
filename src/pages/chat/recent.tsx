import { GetServerSidePropsContext, NextPage } from "next";
import { useRouter } from "next/router";

import MarketingAppLayout from "@/components/Layouts/MarketingAppLayout";
import { useSession } from "next-auth/react";
import { User } from "@prisma/client";
import { getSiteConfig } from "@/services/getSiteConfig";
import { PageSiteConfig } from "@/services/siteConstant";
import ChatHistory from "@/components/AIConversation/History/ChatHistory";
const ChatHistoryPage: NextPage<{ siteConfig: PageSiteConfig; user: any }> = ({ siteConfig }) => {
  const router = useRouter();
  const { data: user } = useSession();
  return (
    <>
      <MarketingAppLayout
        user={{ ...user, role: user?.role } as User}
        mobileHeroMinHeight={60}
        showFooter={false}
        siteConfig={siteConfig}
      >
        <div>
          <ChatHistory userRole={user?.tenant?.role} />
        </div>
      </MarketingAppLayout>
    </>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { res, req } = ctx;

  const domain = ctx.req.headers.host || "";
  const { site } = await getSiteConfig(res, domain);
  const siteConfig = site;

  return {
    props: {
      siteConfig,
    },
  };
};

export default ChatHistoryPage;
