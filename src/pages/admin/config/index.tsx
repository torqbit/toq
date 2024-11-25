import Layout2 from "@/components/Layouts/Layout2";
import { Input, Tabs, TabsProps } from "antd";

import { NextPage } from "next";

import ContentManagementSystem from "@/components/Configuration/Cms/ContentManagementSystem";

const ConfigurationPage: NextPage = () => {
  const items: TabsProps["items"] = [
    {
      key: "CMS",
      label: "Content Management System",
      children: <ContentManagementSystem />,
    },
  ];
  return (
    <Layout2>
      <div style={{ padding: "20px 40px" }}>
        <Tabs
          tabBarGutter={60}
          tabBarStyle={{
            borderColor: "gray",
          }}
          defaultActiveKey={"CMS"}
          items={items}
        />
      </div>
    </Layout2>
  );
};

export default ConfigurationPage;
