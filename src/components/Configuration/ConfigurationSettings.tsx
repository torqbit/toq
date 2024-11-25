import AppLayout from "@/components/Layouts/AppLayout";
import { Tabs, TabsProps } from "antd";

import ContentManagementSystem from "@/components/Configuration/CMS/ContentManagementSystem";

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
    <AppLayout>
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
    </AppLayout>
  );
};

export default ConfigurationSettings;
