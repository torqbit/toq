import { IResponse, postFetch } from "@/services/request";
import { Button, Form, FormInstance, InputNumber, message, Modal } from "antd";
import { useSession } from "next-auth/react";
import { FC, useState } from "react";
import { useAppContext } from "../ContextApi/AppContext";
import ProgramService from "@/services/ProgramService";

const AddPhone: FC<{
  title: string;
  open: boolean;
  onCloseModal: () => void;
}> = ({ title, onCloseModal, open }) => {
  const { data: user, update } = useSession();
  const { globalState, dispatch } = useAppContext();
  const [loading, setLoading] = useState<boolean>(false);

  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const addPhone = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append(
      "userInfo",
      JSON.stringify({ name: user?.user?.name, phone: form.getFieldsValue().phone, image: user?.user?.image })
    );
    ProgramService.updateProfile(
      formData,
      (result) => {
        update({
          phone: form.getFieldsValue().phone,
        });
        dispatch({ type: "SET_USER", payload: { ...globalState.session, phone: form.getFieldsValue().phone } });
        onCloseModal();
        setLoading(false);

        messageApi.success(result.message);
      },
      (error) => {
        setLoading(false);

        messageApi.error(error);
      }
    );
  };
  return (
    <Modal title={<div>{title}</div>} open={open} footer={null} onCancel={onCloseModal}>
      {contextHolder}
      <Form
        layout="vertical"
        form={form}
        onFinish={addPhone}
        initialValues={{
          phone: Number(user?.phone),
        }}
      >
        <Form.Item
          label="Enter your phone number"
          name="phone"
          rules={[
            { required: true, message: "Please enter phone" },
            { type: "number", min: 1000000000, max: 9999999999, message: "Invalid phone number" },
          ]}
        >
          <InputNumber addonBefore="+91" placeholder="9999000099" />
        </Form.Item>
        <Button loading={loading} htmlType="submit" type="primary">
          Submit
        </Button>
      </Form>
    </Modal>
  );
};
export default AddPhone;
