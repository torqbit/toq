import React, { FC, useEffect, useState } from "react";
import styleLayout from "@/styles/Dashboard.module.scss";
import styles from "@/styles/Profile.module.scss";
import { useSession } from "next-auth/react";
import "flag-icons/css/flag-icons.min.css";
import { Button, Form, Input, Tabs, TabsProps, message, Tooltip, Upload, Spin, Flex, Select, Space } from "antd";
import { GetServerSidePropsContext, NextPage } from "next";
import { getServerSession, Session } from "next-auth";

import { useAppContext } from "@/components/ContextApi/AppContext";
import { LoadingOutlined, UserOutlined } from "@ant-design/icons";
import SvgIcons from "@/components/SvgIcons";
import ImgCrop from "antd-img-crop";
import AppLayout from "@/components/Layouts/AppLayout";
import { getSiteConfig } from "@/services/getSiteConfig";
import { PageSiteConfig } from "@/services/siteConstant";
import { getBase64 } from "@/lib/utils";
import { useRouter } from "next/router";
import { useMediaQuery } from "react-responsive";
import { Role, TenantRole, User } from "@prisma/client";

import MarketingAppLayout from "@/components/Layouts/MarketingAppLayout";
import { truncateString } from "@/services/helper";
import { authOptions } from "../api/auth/[...nextauth]";
import { getCountryCodeFromPhone } from "@/lib/utils";
import SupportClientService from "@/services/client/tenant/SupportClientService";

export const flags: Array<{ flag: React.ReactNode; code: string; country: string }> = [
  { flag: <span className="fi fi-cn"></span>, code: "+86", country: "China" }, // China
  { flag: <span className="fi fi-in"></span>, code: "+91", country: "India" }, // India
  { flag: <span className="fi fi-us"></span>, code: "+1", country: "United States" }, // United States
  { flag: <span className="fi fi-ca"></span>, code: "+1", country: "Canada" }, // Canada
  { flag: <span className="fi fi-gb"></span>, code: "+44", country: "United Kingdom" }, // United Kingdom
  { flag: <span className="fi fi-au"></span>, code: "+61", country: "Australia" }, // Australia
  { flag: <span className="fi fi-kr"></span>, code: "+82", country: "South Korea" }, // South Korea
  { flag: <span className="fi fi-il"></span>, code: "+972", country: "Israel" }, // Israel
  { flag: <span className="fi fi-sg"></span>, code: "+65", country: "Singapore" }, // Singapore
  { flag: <span className="fi fi-se"></span>, code: "+46", country: "Sweden" }, // Sweden
  { flag: <span className="fi fi-fi"></span>, code: "+358", country: "Finland" }, // Finland
  { flag: <span className="fi fi-ch"></span>, code: "+41", country: "Switzerland" }, // Switzerland
  { flag: <span className="fi fi-fr"></span>, code: "+33", country: "France" }, // France
  { flag: <span className="fi fi-nl"></span>, code: "+31", country: "Netherlands" }, // Netherlands
  { flag: <span className="fi fi-id"></span>, code: "+62", country: "Indonesia" }, // Indonesia
  { flag: <span className="fi fi-pk"></span>, code: "+92", country: "Pakistan" }, // Pakistan
  { flag: <span className="fi fi-br"></span>, code: "+55", country: "Brazil" }, // Brazil
  { flag: <span className="fi fi-ng"></span>, code: "+234", country: "Nigeria" }, // Nigeria
  { flag: <span className="fi fi-bd"></span>, code: "+880", country: "Bangladesh" }, // Bangladesh
  { flag: <span className="fi fi-ru"></span>, code: "+7", country: "Russia" }, // Russia
  { flag: <span className="fi fi-mx"></span>, code: "+52", country: "Mexico" }, // Mexico
  { flag: <span className="fi fi-jp"></span>, code: "+81", country: "Japan" }, // Japan
  { flag: <span className="fi fi-et"></span>, code: "+251", country: "Ethiopia" }, // Ethiopia
  { flag: <span className="fi fi-ph"></span>, code: "+63", country: "Philippines" }, // Philippines
  { flag: <span className="fi fi-eg"></span>, code: "+20", country: "Egypt" }, // Egypt
  { flag: <span className="fi fi-vn"></span>, code: "+84", country: "Vietnam" }, // Vietnam
  { flag: <span className="fi fi-cd"></span>, code: "+243", country: "DR Congo" }, // DR Congo
  { flag: <span className="fi fi-tr"></span>, code: "+90", country: "Turkey" }, // Turkey
  { flag: <span className="fi fi-ir"></span>, code: "+98", country: "Iran" }, // Iran
  { flag: <span className="fi fi-de"></span>, code: "+49", country: "Germany" }, // Germany
  { flag: <span className="fi fi-th"></span>, code: "+66", country: "Thailand" }, // Thailand
];
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
  const [selectedPhoneCode, setSelectedPhoneCode] = useState<string>(
    user.phone && user.phone.includes("-") ? getCountryCodeFromPhone(user.phone).code : "+91"
  );
  const [phone, setPhone] = useState<string>(user.phone || "");

  const [userProfileUploading, setuserProfileUploading] = useState<boolean>(false);

  const uploadFile = async (file: any, title: string) => {
    if (file) {
      const base64 = await getBase64(file);
      console.log(truncateString(`${base64}`, 20));
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

  const selectBefore = (
    <Select
      defaultValue={selectedPhoneCode}
      style={{ width: 100 }}
      onChange={(e) => {
        setSelectedPhoneCode(e);
      }}
    >
      {flags.map((c, i) => {
        return (
          <Select.Option key={i} value={c.code}>
            <Flex align="center" gap={5}>
              <Space>
                <Tooltip title={c.country}>{c.flag}</Tooltip>
                {c.code}
              </Space>
            </Flex>
          </Select.Option>
        );
      })}
    </Select>
  );
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
                    disabled
                  >
                    {userProfile !== "NULL" ? (
                      <>
                        {userProfile.includes("base64") ? (
                          <img height={100} width={100} src={userProfile} alt="image" />
                        ) : (
                          <object
                            type="image/png"
                            data={String(userProfile)}
                            style={{
                              height: "100%",
                              width: "100%",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            aria-label={`profile`}
                          >
                            <div className={styles.invalid__img}>
                              <UserOutlined size={100} style={{ fontSize: 100 }} />
                            </div>
                          </object>
                        )}

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
                  phone:
                    user.phone &&
                    (user.phone.includes("-") ? getCountryCodeFromPhone(user.phone).phone : Number(user?.phone)),
                }}
                onFinish={(v) => {
                  onUpdateProfile({ ...v, phone: phone !== "" ? `${selectedPhoneCode}-${v.phone}` : null });
                }}
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
                    { required: phone !== "" },
                    {
                      validator: (_, value) => {
                        if (value == "" || Number.isNaN(value) || typeof value == "object") {
                          return Promise.resolve();
                        } else {
                          return value && value > 1000000000 && value < 9999999999
                            ? Promise.resolve()
                            : Promise.reject(new Error("Invalid phone number"));
                        }
                      },
                    },
                  ]}
                >
                  <Input
                    max={9999999999}
                    min={1000000000}
                    type="number"
                    addonBefore={selectBefore}
                    onChange={(e) => setPhone(e.currentTarget.value)}
                    placeholder="9999000099"
                  />
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

const Setting: NextPage<{ siteConfig: PageSiteConfig; tenantRole: TenantRole }> = ({ siteConfig, tenantRole }) => {
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
        return router.push(`/settings?tab=${key}`);
      case "payment":
        setActiveKey("payment");
        return router.push(`/settings?tab=${key}`);
      default:
        return setActiveKey("profile");
    }
  };
  const onUpdateProfile = async (info: { name: string; phone: string; image: string }) => {
    setUpdateLoading(true);
    const formData = new FormData();
    formData.append("userInfo", JSON.stringify({ name: info.name, phone: info.phone, image: user?.user?.image }));
    file && formData.append("file", file);

    SupportClientService.updateProfile(
      formData,
      (result: any) => {
        update({
          ...info,
          image: result.created.image,
          user: {
            ...user?.user,
            name: info.name,
            phone: info.phone,
            image: result.created.image,
          },
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
  ];

  useEffect(() => {
    onChange(router.query.tab as string);
  }, []);

  return (
    <>
      {user && (user.role == Role.CUSTOMER || tenantRole === TenantRole.OWNER) && (
        <AppLayout siteConfig={siteConfig}>
          {contextMessageHolder}

          <section className={styleLayout.setting_content}>
            <h3>Settings</h3>
            <Tabs activeKey={activeKey} className="content_tab" items={items} onChange={onChange} />
          </section>
        </AppLayout>
      )}
      {user && user.role === Role.MEMBER && tenantRole === TenantRole.MEMBER && (
        <MarketingAppLayout
          mobileHeroMinHeight={60}
          showFooter={!isMobile}
          siteConfig={siteConfig}
          user={{ id: user.id, name: user.user?.name || "", role: Role.STUDENT, email: user.user?.email } as User}
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
        </MarketingAppLayout>
      )}
    </>
  );
};

export default Setting;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { res, req } = ctx;
  const domain = ctx.req.headers.host || "";
  const { site } = await getSiteConfig(res, domain);
  const user = await getServerSession(req, res, await authOptions(req));
  if (!user) {
    return { notFound: true };
  }

  return {
    props: {
      siteConfig: site,
      tenantRole: user?.tenant?.role || null,
    },
  };
};
