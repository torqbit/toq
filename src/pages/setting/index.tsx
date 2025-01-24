import React, { FC, useEffect, useState } from "react";
import styleLayout from "@/styles/Dashboard.module.scss";
import styles from "@/styles/Profile.module.scss";
import { useSession } from "next-auth/react";

import { Button, Form, Input, Tabs, TabsProps, message, Tooltip, Upload, InputNumber, Spin, Flex } from "antd";
import { GetServerSidePropsContext, NextPage } from "next";
import { Session } from "next-auth";

import { IResponsiveNavMenu, useAppContext } from "@/components/ContextApi/AppContext";
import { LoadingOutlined, UserOutlined } from "@ant-design/icons";
import SvgIcons from "@/components/SvgIcons";
import ImgCrop from "antd-img-crop";
import PaymentHistory from "@/components/Admin/Users/PaymentHistory";
import AppLayout from "@/components/Layouts/AppLayout";
import { getSiteConfig } from "@/services/getSiteConfig";
import { PageSiteConfig } from "@/services/siteConstant";
import { getBase64 } from "@/lib/utils";
import ProgramService from "@/services/ProgramService";
import { useRouter } from "next/router";
import { useMediaQuery } from "react-responsive";
import { Role, User } from "@prisma/client";
import MarketingLayout from "@/components/Layouts/MarketingLayout";

const ProfileSetting: FC<{
  user: Session;
  onUpdateProfile: (info: { name: string; phone: string; image: string }) => void;
  setUserProfile: (profile: string) => void;
  setFile: (file: File) => void;
  userProfile: string;
  updateLoading: boolean;
  isMobile: boolean;
  activeTab: string;
}> = ({ user, onUpdateProfile, userProfile, setUserProfile, setFile, activeTab, updateLoading, isMobile }) => {
  const [pageLoading, setPageLoading] = useState<boolean>(false);
  const [userProfileUploading, setuserProfileUploading] = useState<boolean>(false);
  const router = useRouter();
  const uploadFile = async (file: any, title: string) => {
    if (file) {
      const base64 = await getBase64(file);
      setuserProfileUploading(true);
      setUserProfile(base64 as string);
      setFile(file);
      setuserProfileUploading(false);
    }
  };
  useEffect(() => {
    setPageLoading(true);
    if (user && activeTab === "profile") {
      setUserProfile(String(user.user?.image));
      setPageLoading(false);
    }
  }, [activeTab]);

  return (
    <div style={{ position: "relative" }}>
      <Spin spinning={pageLoading} indicator={<LoadingOutlined spin />} size="large">
        <section
          className={styles.user_profile_page}
          style={{ marginBottom: isMobile && user.role == Role.STUDENT ? 60 : 20 }}
        >
          <div className={styles.content_center}>
            <div className={styles.left_content}>
              <Form.Item name="image">
                <ImgCrop fillColor={"transparent"} rotationSlider>
                  <Upload
                    name="avatar"
                    listType="picture-card"
                    className={styles.upload__thumbnail}
                    showUploadList={false}
                    style={{ width: 150, height: 150 }}
                    beforeUpload={(file) => {
                      uploadFile(file, `${user.user?.name}_profile`);
                    }}
                  >
                    {userProfile !== "NULL" ? (
                      <>
                        <img src={userProfile ? userProfile : String(user.user?.image)} />

                        <Tooltip title="Upload Profile image">
                          <div className={styles.camera_btn_img}>
                            {userProfileUploading && userProfile ? <LoadingOutlined /> : SvgIcons.camera}
                          </div>
                        </Tooltip>
                        <div className={styles.bannerStatus}>{userProfileUploading && "Uploading"}</div>
                      </>
                    ) : (
                      <button
                        className={styles.upload_img_button}
                        style={{ border: 0, background: "none", width: 150, height: 150 }}
                        type="button"
                      >
                        {userProfileUploading ? <LoadingOutlined /> : SvgIcons.camera}
                        {!userProfileUploading ? (
                          <div>Upload Image</div>
                        ) : (
                          <div style={{ color: "#000" }}>{userProfileUploading && "Uploading"}</div>
                        )}
                      </button>
                    )}
                  </Upload>
                </ImgCrop>
              </Form.Item>
            </div>
            <div className={styles.right_content}>
              <Form
                className={styles.user_profile_form}
                initialValues={{
                  name: user?.user?.name,
                  email: user?.user?.email,
                  phone: user.phone && Number(user?.phone),
                }}
                onFinish={onUpdateProfile}
                layout="vertical"
                requiredMark={false}
              >
                <Form.Item label="Name" name="name" rules={[{ required: true, message: "Required Name" }]}>
                  <Input placeholder="Name" />
                </Form.Item>
                <Form.Item label="Email" name="email">
                  <Input placeholder="Email" disabled={true} />
                </Form.Item>

                <Form.Item
                  label="Phone"
                  name="phone"
                  rules={[
                    { required: true, message: "Please enter phone" },
                    { type: "number", min: 1000000000, max: 9999999999, message: "Invalid phone number" },
                  ]}
                >
                  <InputNumber addonBefore="+91" placeholder="9999000099" />
                </Form.Item>
                <Form.Item noStyle>
                  <Button loading={updateLoading} type="primary" htmlType="submit">
                    Update
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </section>
      </Spin>
    </div>
  );
};

const Setting: NextPage<{ siteConfig: PageSiteConfig }> = ({ siteConfig }) => {
  const { data: user, update } = useSession();
  const [messageApi, contextMessageHolder] = message.useMessage();
  const [userProfile, setUserProfile] = useState<string>();
  const [activeKey, setActiveKey] = useState<string>("profile");
  const router = useRouter();
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);
  const isMobile = useMediaQuery({ query: "(max-width: 435px)" });

  const [file, setFile] = useState<File>();
  const { dispatch, globalState } = useAppContext();

  const onChange = (key: string) => {
    switch (key) {
      case "profile":
        setActiveKey("profile");
        return router.push(`/setting?tab=${key}`);
      case "payment":
        setActiveKey("payment");
        return router.push(`/setting?tab=${key}`);
      default:
        return setActiveKey("profile");
    }
  };
  const onUpdateProfile = async (info: { name: string; phone: string; image: string }) => {
    setUpdateLoading(true);
    const formData = new FormData();
    formData.append("userInfo", JSON.stringify({ name: info.name, phone: info.phone, image: user?.user?.image }));
    file && formData.append("file", file);

    ProgramService.updateProfile(
      formData,
      (result) => {
        update({
          ...info,
          image: result.fileCDNPath,
        });
        dispatch({ type: "SET_USER", payload: { name: info.name, phone: `${info.phone}` } });
        messageApi.success(result.message);
        setUpdateLoading(false);
      },
      (error) => {
        setUpdateLoading(false);

        messageApi.error(error);
      }
    );
  };

  const items: TabsProps["items"] = [
    {
      key: "profile",
      label: "Profile",
      children: user && (
        <ProfileSetting
          user={user}
          onUpdateProfile={onUpdateProfile}
          userProfile={String(userProfile)}
          setUserProfile={setUserProfile}
          setFile={setFile}
          updateLoading={updateLoading}
          isMobile={isMobile}
          activeTab={activeKey}
        />
      ),
    },
    {
      key: "payment",
      label: "Payment",
      children: user && <PaymentHistory activeTab={activeKey} />,
    },
  ];

  useEffect(() => {
    onChange(router.query.tab as string);
  }, []);

  return (
    <>
      {user && user.role !== Role.STUDENT && (
        <AppLayout siteConfig={siteConfig}>
          {contextMessageHolder}

          <section className={styleLayout.setting_content}>
            <h3>Setting</h3>
            <Tabs activeKey={activeKey} className="content_tab" items={items} onChange={onChange} />
          </section>
        </AppLayout>
      )}
      {user && user.role === Role.STUDENT && (
        <MarketingLayout
          mobileHeroMinHeight={60}
          showFooter={!isMobile}
          siteConfig={siteConfig}
          user={{ id: user.id, name: user.user?.name || "", role: user.role, email: user.user?.email } as User}
        >
          {contextMessageHolder}

          <section
            className={styleLayout.setting_content}
            style={{
              maxWidth: isMobile ? "80vw" : "var(--marketing-container-width)",
              margin: "0 auto",
              padding: "20px 0",
            }}
          >
            <h3>Setting</h3>
            <Tabs activeKey={activeKey} className="content_tab" items={items} onChange={onChange} />
          </section>
        </MarketingLayout>
      )}
    </>
  );
};

export default Setting;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const siteConfig = getSiteConfig();
  const { site } = siteConfig;
  return {
    props: {
      siteConfig: site,
    },
  };
};
