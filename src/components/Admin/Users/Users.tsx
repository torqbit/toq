import React, { FC, useState } from "react";
import styles from "@/styles/Dashboard.module.scss";
import {
  Button,
  Dropdown,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Switch,
  Table,
  Tabs,
  TabsProps,
  Tag,
  message,
} from "antd";
import SvgIcons from "@/components/SvgIcons";
import Layout2 from "@/components/Layouts/Layout2";
import { useSession } from "next-auth/react";
import { IResponse, getFetch, postFetch } from "@/services/request";
import { User } from "@prisma/client";
import moment from "moment";
import appConstant from "@/services/appConstant";

const UserList: FC = () => {
  const [allUsers, setAllUsers] = React.useState<User[]>([]);
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

  const onUpdateUser = async (u: User) => {
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

  const dropDownMenu = (user: User) => {
    return [
      {
        key: "1",
        label: "Edit",
        onClick: () => onClickToEditUser(user),
      },
      {
        key: "2",
        label: "Block",
      },
      {
        key: "3",
        label: "Delete",
      },
    ];
  };

  const columns: any = [
    {
      title: "NAME",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "EMAIL",
      dataIndex: "email",
      key: "email",
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
      title: "DATE JOINED",
      align: "center",
      dataIndex: "dateJoined",
      render: (u: User) => {
        return <span>{moment(u as any).format("MMM-DD-YY  hh:mm a")}</span>;
      },
      key: "dateJoined",
    },
    {
      title: "LAST ACTIVITY",
      align: "center",
      dataIndex: "lastActivity",
      key: "activity",
    },
    {
      title: "ACTIONS",
      align: "center",
      dataIndex: "actions",
      render: (_: any, user: User) => (
        <>
          <Dropdown menu={{ items: dropDownMenu(user) }} placement="bottomRight" arrow={{ pointAtCenter: true }}>
            {SvgIcons.threeDots}
          </Dropdown>
        </>
      ),
      key: "actions",
    },
  ];

  return (
    <>
      <Table size="small" loading={data.loading} className="users_table" columns={columns} dataSource={allUsers} />

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
    </>
  );
};

const Users: FC = () => {
  const { data: user } = useSession();
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

  const onChange = (key: string) => {};

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Active Users",
      children: <UserList />,
    },
    {
      key: "2",
      label: "Inactive Users",
      children: "Content of Tab Pane 2",
    },
    {
      key: "3",
      label: "Banned Users",
      children: "Content of Tab Pane 3",
    },
  ];

  const onAddUser = async () => {
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
    <Layout2>
      <section className={styles.dashboard_content}>
        <h2>Hello {user?.user?.name}</h2>
        <h3>Users</h3>
        <Tabs
          tabBarGutter={60}
          tabBarStyle={{
            borderColor: "gray",
          }}
          tabBarExtraContent={
            <Button type="primary" onClick={showDrawer} className={styles.add_user_btn}>
              <span>Add User</span>
              {SvgIcons.arrowRight}
            </Button>
          }
          defaultActiveKey="1"
          items={items}
          onChange={onChange}
        />

        <Modal title={<div>Add User</div>} open={onModal} footer={null} onCancel={onClose}>
          <Form
            className={styles.userForm}
            name="data"
            onFinish={onAddUser}
            initialValues={{ remember: true }}
            form={form}
            autoComplete="off"
          >
            <h3 style={{ color: "#666" }}>Email</h3>
            <Form.Item name="email" rules={[{ required: true, message: "Please input your Email" }]}>
              <Input type="email" placeholder="Email" />
            </Form.Item>
            <Space>
              <Button loading={loading} type="primary" htmlType="submit">
                Submit
              </Button>
              <Button
                danger
                onClick={() => {
                  onClose();
                }}
              >
                Cancel
              </Button>
            </Space>
          </Form>
        </Modal>
      </section>
    </Layout2>
  );
};

export default Users;
