import Layout2 from "@/components/Layouts/Layout2";
import { Tabs, TabsProps } from "antd";

import ContentManagementSystem from "@/components/Configuration/Cmss/ContentManagementSystem";

const ConfigurationSettings = () => {
  const items: TabsProps["items"] = [
    {
      key: "CMS",
      label: "Content Management System",
      children: <ContentManagementSystem />,
    },
    {
      key: "PMS",
      label: "Payment Management System",
      children: (
        <>
          <h3>Payment Management System</h3>
        </>
      ),
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

export default ConfigurationSettings;
