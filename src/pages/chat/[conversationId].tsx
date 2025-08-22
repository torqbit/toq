import { NextPage } from "next";
import React from "react";
import { useRouter } from "next/router";
import { useAppContext } from "@/components/ContextApi/AppContext";
import AIChatWidget from "@/components/AIConversation/AIChatWidget";
import MarketingAppLayout from "@/components/Layouts/MarketingAppLayout";
import { useSession } from "next-auth/react";
import { Role, TenantRole, User } from "@prisma/client";
import { getFetch } from "@/services/request";
import { useEffect, useState } from "react";
import AppLayout from "@/components/Layouts/AppLayout";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const ChatPage: NextPage<{ conversationId: string }> = () => {
  const { data: user } = useSession();
  const { globalState, dispatch } = useAppContext();
  let siteConfig = globalState.siteConfig;
  const [loading, setLoader] = useState<boolean>(false);
  const router = useRouter();
  const { conversationId } = router.query;

  const getSiteConfig = async () => {
    const res = await getFetch("/api/v1/admin/site/site-info/get");
    const result = await res.json();

    if (res.status == 200) {
      dispatch({ type: "SET_SITE_CONFIG", payload: result.siteConfig });
      dispatch({
        type: "SET_USER",
        payload: { ...user, role: user?.role, tenantRole: user?.tenant?.role },
      });
      setLoader(false);
    } else {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (
      globalState.siteConfig.brand?.name == "Torqbit" &&
      typeof window != "undefined" &&
      window.location.origin !== process.env.NEXT_PUBLIC_NEXTAUTH_URL
    ) {
      setLoader(true);
      getSiteConfig();
    }
  }, [conversationId]);

  return (
    <>
      {loading ? (
        <Spin spinning={true} fullscreen indicator={<LoadingOutlined spin />} size="large">
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              minHeight: "100vh",
              backgroundColor: "red",
            }}
          ></div>
        </Spin>
      ) : (
        <>
          {conversationId && (user?.role == Role.ADMIN || user?.tenant?.role === TenantRole.OWNER) ? (
            <AppLayout siteConfig={siteConfig}>
              <div>
                <AIChatWidget
                  conversationId={new String(conversationId).toString()}
                  userName={globalState.session?.name || "Guest"}
                />
              </div>
            </AppLayout>
          ) : (
            <>
              {conversationId && (
                <MarketingAppLayout
                  user={user ? ({ ...user?.user, role: Role.STUDENT } as User) : undefined}
                  mobileHeroMinHeight={60}
                  showFooter={false}
                  siteConfig={siteConfig}
                >
                  <div>
                    <AIChatWidget
                      conversationId={new String(conversationId).toString()}
                      userName={globalState.session?.name || "Guest"}
                    />
                  </div>
                </MarketingAppLayout>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default ChatPage;
