import AppLayout from "@/components/Layouts/AppLayout";
import { Tabs, TabsProps } from "antd";

import ContentManagementSystem from "@/components/Configuration/CMS/ContentManagementSystem";
import { FC, useEffect, useState } from "react";
import { PageSiteConfig } from "@/services/siteConstant";
import PaymentManagementSystem from "./Payment/PaymentManagementSystem";
import EmailServiceSystem from "./Email/EmailServiceSystem";
import { useRouter } from "next/router";

const ConfigurationSettings: FC<{ siteConfig: PageSiteConfig }> = ({ siteConfig }) => {
  const router = useRouter();
  const [activeKey, setActiveKey] = useState<string>("CMS");
  const items: TabsProps["items"] = [
    {
      key: "CMS",
      label: "Content Management System",
      children: <ContentManagementSystem siteConfig={siteConfig} />,
    },
    {
      key: "PMS",
      label: "Payments",
      children: <PaymentManagementSystem />,
    },
    {
      key: "EMS",
      label: "Email Service",
      children: <EmailServiceSystem />,
    },
  ];

  const onChange = (key: string) => {
    setActiveKey(key);

    router.push(`/admin/settings?tab=${key.toLowerCase()}`);
  };
  useEffect(() => {
    if (router.query.tab && typeof router.query.tab === "string") {
      setActiveKey(router.query.tab.toUpperCase());
    }
  }, []);
  return (
    <AppLayout siteConfig={siteConfig}>
      <div style={{ padding: "20px 40px" }}>
        <Tabs
          tabBarGutter={60}
          tabBarStyle={{
            borderColor: "gray",
          }}
          defaultActiveKey={activeKey}
          onChange={onChange}
          items={items}
        />
      </div>
    </AppLayout>
  );
};

export default ConfigurationSettings;
