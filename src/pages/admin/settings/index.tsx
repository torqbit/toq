import ContentManagementSystem from "@/components/Configuration/CMS/ContentManagementSystem";
import EmailServiceSystem from "@/components/Configuration/Email/EmailServiceSystem";
import PaymentManagementSystem from "@/components/Configuration/Payment/PaymentManagementSystem";
import AppLayout from "@/components/Layouts/AppLayout";
import { getSiteConfig } from "@/services/getSiteConfig";
import { PageSiteConfig } from "@/services/siteConstant";
import { Tabs, TabsProps } from "antd";
import { GetServerSidePropsContext, NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";

const ConfigurationPage: NextPage<{ siteConfig: PageSiteConfig }> = ({ siteConfig }) => {
  const router = useRouter();
  let query = typeof router.query.tab === "string" ? router.query.tab : "CMS";

  const [activeKey, setActiveKey] = useState<string>(query?.toUpperCase());
  const items: TabsProps["items"] = [
    {
      key: "CMS",
      label: "Content Management System",
      children: <ContentManagementSystem active={activeKey === "CMS" || !activeKey} siteConfig={siteConfig} />,
    },
    {
      key: "PMS",
      label: "Payments",
      children: <PaymentManagementSystem active={activeKey === "PMS"} />,
    },
    {
      key: "EMS",
      label: "Email Service",
      children: <EmailServiceSystem active={activeKey === "EMS"} />,
    },
  ];

  const onChange = (key: string) => {
    setActiveKey(key);

    router.push(`/admin/settings?tab=${key.toLowerCase()}`);
  };

  return (
    <AppLayout siteConfig={siteConfig}>
      <div style={{ padding: "20px" }}>
        <Tabs
          tabBarGutter={60}
          tabBarStyle={{
            borderColor: "gray",
          }}
          defaultActiveKey={"CMS"}
          activeKey={activeKey}
          onChange={onChange}
          items={items}
        />
      </div>
    </AppLayout>
  );
};

export default ConfigurationPage;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { query } = ctx;
  const siteConfig = getSiteConfig();
  const { site } = siteConfig;
  if (query.tab) {
    return {
      props: {
        siteConfig: site,
      },
    };
  } else {
    return {
      redirect: {
        permanent: false,

        destination: "/admin/settings?tab=cms",
      },
    };
  }
};
