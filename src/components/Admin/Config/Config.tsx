import React, { FC, useEffect, useState } from "react";

import AppLayout from "@/components/Layouts/AppLayout";

import styles from "@/styles/Config.module.scss";

import { Breadcrumb, Form, Tabs, TabsProps, message } from "antd";
import MediaStorage from "./MediaStorage";
import ProgramService from "@/services/ProgramService";
import CertificateTemplates from "./Certificate";

const Config: FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingBtn, setLoadingBtn] = useState<boolean>(false);

  const [refresh, setRefresh] = useState<boolean>(false);
  const [activeKey, setActiveKey] = useState<string>("1");
  const [activeTab, setActiveTab] = useState<string>("Configurations");

  const onRefresh = () => {
    setRefresh(!refresh);
  };
  const [form] = Form.useForm();
  const onFinish = () => {
    setLoadingBtn(true);
    ProgramService.addServiceProvider(
      "bunny",
      "media",
      form.getFieldsValue(),
      (result) => {
        message.success(result.message);

        setLoadingBtn(false);
      },
      (error) => {
        message.error(error);
        setLoadingBtn(false);
      }
    );
  };

  const onChange = (key: string) => {
    if (key === "3") {
      onRefresh();

      setActiveKey("3");
    }
    setActiveKey(key);
    key === "1" && setActiveTab("Configurations");
    key === "2" && setActiveTab("Certificates");
  };

  useEffect(() => {
    setLoading(true);
    ProgramService.getCredentials(
      "media",
      (result) => {
        if (result.credentials.providerDetail) {
          form.setFieldValue("accessKey", result.credentials.providerDetail.accessKey);
          form.setFieldValue("libraryId", result.credentials.providerDetail.libraryId);
          form.setFieldValue("storageZone", result.credentials.providerDetail.storageZone);
          form.setFieldValue("mediaPath", result.credentials.providerDetail.mediaPath);
          form.setFieldValue("storagePassword", result.credentials.providerDetail.storagePassword);
          form.setFieldValue("connectedCDNHostname", result.credentials.providerDetail.connectedCDNHostname);
          form.setFieldValue("streamCDNHostname", result.credentials.providerDetail.streamCDNHostname);
        }
        setLoading(false);
      },

      (error) => {
        setLoading(false);
      }
    );
  }, []);

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Media Storage",
      children: <MediaStorage form={form} onFinish={onFinish} loading={loading} loadingBtn={loadingBtn} />,
    },
    {
      key: "2",
      label: "Certificate templates",

      children: <CertificateTemplates />,
    },
  ];

  return (
    <AppLayout>
      <section className={styles.config_page}>
        <h3>{activeTab}</h3>

        <Tabs
          tabBarGutter={40}
          activeKey={activeKey}
          className={styles.add_course_tabs}
          items={items}
          onChange={onChange}
        />
      </section>
    </AppLayout>
  );
};

export default Config;
