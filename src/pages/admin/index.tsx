import styles from "@/styles/AdminDashboard.module.scss";

import { Button, DatePicker, Form, Input, Modal, Select, Space, Switch, Table, Tabs, Tag, message } from "antd";
import React, { FC, useState } from "react";
import { IResponse, getFetch, postFetch } from "@/services/request";
import { Role, User } from "@prisma/client";
import { EditOutlined } from "@ant-design/icons";
import moment from "moment";
import appConstant from "@/services/appConstant";
import { GetServerSidePropsContext, NextPage } from "next";
import type { DatePickerProps, RangePickerProps } from "antd/es/date-picker";
import AppLayout from "@/components/Layouts/AppLayout";
import { getSiteConfig } from "@/services/getSiteConfig";
import { PageSiteConfig } from "@/services/siteConstant";

type FieldType = {
  name?: string;
  email?: string;
  image?: string;
  isActive?: Boolean;
  role?: Role;
};

const UserTab: FC = () => {
  const [form] = Form.useForm();

  const [data, setData] = React.useState<{
    updateLoading: boolean;
    loading: boolean;
    isModalOpen: boolean;
    storeDate: { startDate: string; endDate: string };
    selectedUserId: string;
  }>({
    updateLoading: false,
    loading: false,
    isModalOpen: false,
    storeDate: { startDate: "", endDate: "" },
    selectedUserId: "0",
  });

  const [allUsers, setAllUsers] = React.useState<User[]>([]);

  const getAllUser = async () => {
    setData({ ...data, loading: true });

    const res = await getFetch("/api/user/get-all");
    const result = (await res.json()) as IResponse;

    if (res.ok && result.success) {
      setAllUsers(result.allUsers);
    } else {
      message.error(result.error);
    }
    setData({ ...data, loading: false, isModalOpen: false });
  };
  React.useEffect(() => {
    getAllUser();
  }, []);

  const onModalClose = () => {
    setData({ ...data, isModalOpen: false, selectedUserId: "0" });

    form.resetFields(["name", "role", "isActive"]);
  };

  const onClickToEditUser = (user: User) => {
    form.setFieldValue("name", user.name);
    form.setFieldValue("role", user.role);
    form.setFieldValue("isActive", user.isActive);
    setData({ ...data, selectedUserId: user.id, isModalOpen: true });
  };

  const onUpdateUser = async (u: any) => {
    setData({ ...data, updateLoading: true });
    const updateUserRes = await postFetch({ userId: data.selectedUserId, ...u }, "/api/user/update");
    const result = (await updateUserRes.json()) as IResponse;

    if (updateUserRes.ok && result.success) {
      onModalClose();

      getAllUser();
      message.success(result.message);
    } else {
      message.error(result.error);
    }
    setData({ ...data, updateLoading: false });
  };

  const { RangePicker } = DatePicker;

  const onChange = async (
    value: DatePickerProps["value"] | RangePickerProps["value"],
    dateString: [string, string] | string
  ) => {
    setData({
      ...data,
      storeDate: { startDate: dateString[0], endDate: dateString[1] },
    });
  };

  const onOk = async (value: DatePickerProps["value"] | RangePickerProps["value"]) => {};

  const columns: any[] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      render: (u: User) => {
        if (u.role === "AUTHOR" || u.role === "ADMIN") {
          return <Tag color="orange">{u.role}</Tag>;
        } else {
          return <Tag>{u.role}</Tag>;
        }
      },
      key: "role",
    },
    {
      title: "Date Joined",
      render: (u: User) => {
        return <span>{moment(u.dateJoined).format("MMM-DD-YY  hh:mm a")}</span>;
      },
      filters: [
        {
          text: <RangePicker onChange={onChange} onOk={onOk} />,
          value: data.storeDate,
        },
      ],
      onFilter: (value: { startDate: string; endDate: string }, record: { dateJoined: string }) =>
        record.dateJoined >= value.startDate && record.dateJoined <= value.endDate,
    },
    {
      title: "Status",
      render: (u: User) => {
        if (u.isActive) {
          return <Tag color="#87d068">Active</Tag>;
        } else {
          return <Tag color="#f50">In-Active</Tag>;
        }
      },
      key: "status",
    },
    {
      title: "Action",
      align: "center",
      render: (u: User) => {
        return (
          <EditOutlined
            style={{ color: "#ff0000", cursor: "pointer" }}
            onClick={() => onClickToEditUser(u)}
            rev={undefined}
          />
        );
      },
      key: "action",
    },
  ];

  return (
    <section className={styles.user_tab}>
      <Table dataSource={allUsers} columns={columns} loading={data.loading} />
      <Modal open={data.isModalOpen} footer={null} onCancel={onModalClose}>
        <Form
          form={form}
          className={styles.user_update_form}
          layout="vertical"
          onFinish={onUpdateUser}
          requiredMark={false}
        >
          <Form.Item label="Name" name="name" rules={[{ required: true, message: "Required Name" }]}>
            <Input placeholder="Name" />
          </Form.Item>
          <Form.Item label="Role" name="role">
            <Select
              style={{ width: "100%" }}
              placeholder="Select Role"
              options={[
                {
                  label: appConstant.userRole.AUTHOR,
                  value: appConstant.userRole.AUTHOR,
                },
                {
                  label: appConstant.userRole.STUDENT,
                  value: appConstant.userRole.STUDENT,
                },
                {
                  label: appConstant.userRole.TA,
                  value: appConstant.userRole.TA,
                },
              ]}
            />
          </Form.Item>
          <Form.Item label="Status" name="isActive" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item noStyle>
            <Space style={{ width: "100%", justifyContent: "flex-end" }} className={"actionBtn"}>
              <Button danger onClick={onModalClose}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={data.updateLoading}>
                Update
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </section>
  );
};

const AdminDashboard: NextPage<{ siteConfig: PageSiteConfig }> = ({ siteConfig }) => {
  const [onModal, setModal] = useState(false);
  const [modal, contextholder] = Modal.useModal();
  const [loading, setLoading] = useState<boolean>(false);

  const showDrawer = () => {
    setModal(true);
  };

  const onClose = () => {
    setModal(false);
  };

  const [form] = Form.useForm();

  const onFinish = async () => {
    setLoading(true);
    const res = await fetch(`api/user/add-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form.getFieldsValue()),
    });
    const result = await res.json();
    if (res.ok) {
      form.resetFields();
      onClose();
      setLoading(false);
      modal.info({
        title: "Add User",
        content: result.message,
      });
    } else {
      setLoading(false);
    }
  };

  return (
    <AppLayout siteConfig={siteConfig} className={styles.admin_dashboard_page}>
      <div className={styles.center_content} style={{ padding: 40 }}>
        {contextholder}
        <div className={styles.adminHeader}>
          <h2>Admin Dashboard</h2>
          <Button type="primary" onClick={showDrawer}>
            Add User
          </Button>

          <Modal title={<div>Add User</div>} open={onModal} footer={null} onCancel={onClose}>
            <Form
              className={styles.userForm}
              name="data"
              onFinish={onFinish}
              initialValues={{ remember: true }}
              form={form}
              autoComplete="off"
            >
              <h3>Email</h3>
              <Form.Item<FieldType> name="email" rules={[{ required: true, message: "Please input your Email" }]}>
                <Input type="email" placeholder="Email" />
              </Form.Item>
              <Space>
                <Button loading={loading} type="primary" htmlType="submit">
                  Submit
                </Button>
                <Button
                  onClick={() => {
                    onClose();
                  }}
                >
                  Cancel
                </Button>
              </Space>
            </Form>
          </Modal>
        </div>

        <Tabs
          className={styles.admin_dashboard_tabs}
          defaultActiveKey="1"
          items={[
            {
              label: "Users",
              key: "1",
              children: <UserTab />,
            },
          ]}
        />
      </div>
    </AppLayout>
  );
};

export default AdminDashboard;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const siteConfig = getSiteConfig();
  const { site } = siteConfig;
  return {
    props: {
      siteConfig: site,
    },
  };
};
