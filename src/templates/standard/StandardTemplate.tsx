import MarketingLayout from "@/components/Layouts/MarketingLayout";
import { DEFAULT_THEME, PageSiteConfig } from "@/services/siteConstant";
import { TenantRole, User } from "@prisma/client";
import { FC, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { IBlogCard } from "@/types/landing/blog";
import styles from "./StandardTemplate.module.scss";
import AIChatWidget from "@/components/AIConversation/AIChatWidget";
import MarketingAppLayout from "@/components/Layouts/MarketingAppLayout";
import AppLayout from "@/components/Layouts/AppLayout";
import MarketingHero from "./components/Hero/Hero";
import { useSession } from "next-auth/react";
import { CollapseProps, Flex } from "antd";

interface IStandardTemplateProps {
  user: User;
  siteConfig: PageSiteConfig;
  previewMode?: boolean;
  tenantRole?: TenantRole;
}

const StandardTemplate: FC<IStandardTemplateProps> = ({ user, siteConfig, previewMode, tenantRole }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 435px)" });
  const [items, setItems] = useState<CollapseProps["items"]>([]);

  useEffect(() => {
    const items: CollapseProps["items"] = siteConfig.sections?.faq?.items.map((faq, i) => {
      return {
        key: i,

        label: (
          <h4 className={styles.list__bar__para__wrapper} style={{ margin: 0 }}>
            {" "}
            {faq?.question}
          </h4>
        ),
        children: <p>{faq?.answer}</p>,
        showArrow: false,
      };
    });
    setItems(items);
  }, [siteConfig.sections?.faq]);

  return user && tenantRole == TenantRole.OWNER ? (
    <AppLayout siteConfig={siteConfig} previewMode>
      {/* <AIChatWidget userName={user.name} readOnly={previewMode} /> */}
      <>
        <MarketingHero isMobile={isMobile} user={user} siteConfig={siteConfig} />
      </>
    </AppLayout>
  ) : (
    <MarketingAppLayout
      siteConfig={siteConfig}
      user={previewMode ? undefined : user}
      previewMode={previewMode}
      navBarWidth={"100%"}
      homeLink={previewMode ? "#" : "/"}
      heroSection={
        <>
          <MarketingHero isMobile={isMobile} user={user} siteConfig={siteConfig} />
        </>
      }
    ></MarketingAppLayout>
  );
};

export default StandardTemplate;
