import { FC } from "react";
import { Modal } from "antd";

interface DeleteContentProps {
  title: string;
  description: string;
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteContent: FC<DeleteContentProps> = ({ title, description, open, onCancel, onConfirm }) => {
  return (
    <Modal
      title={title}
      open={open}
      onOk={onConfirm}
      onCancel={onCancel}
      okText="Delete"
      okButtonProps={{ danger: true }}
      cancelText="Cancel"
    >
      <p>{description}</p>
    </Modal>
  );
};

export default DeleteContent;
