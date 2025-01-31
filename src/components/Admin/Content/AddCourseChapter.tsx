import { Button, Drawer, Form, FormInstance, Input, message, Space } from "antd";
import { FC, useState } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/AddChapterForm.module.scss";
import ProgramService from "@/services/ProgramService";

const AddCourseChapter: FC<{
  showChapterDrawer: (value: boolean) => void;
  edit: boolean;
  loading: boolean | undefined;
  open: boolean;
  courseId: number;
  currentSeqIds: number[];
  form: FormInstance;
  chapterLength: number;
  chapterId?: number;
  onRefresh: () => void;
  setEdit: (value: boolean) => void;
}> = ({
  showChapterDrawer,
  edit,

  onRefresh,

  open,
  chapterLength,
  courseId,
  setEdit,
  currentSeqIds,
  form,
  chapterId,
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const [messageApi, contextHolder] = message.useMessage();

  const router = useRouter();

  const onClose = () => {
    showChapterDrawer(false);
    form.resetFields();
  };

  const createChapter = async (courseId: number) => {
    setLoading(true);
    let chaptereData = {
      name: form.getFieldsValue().name,
      description: form.getFieldsValue().description,
      duration: form.getFieldsValue().duration,
      courseId: courseId,
      sequenceId: Number(chapterLength + 1),
    };

    ProgramService.createChapter(
      chaptereData,
      (result) => {
        setLoading(false);
        messageApi.success(result.message);
        onRefresh();
        showChapterDrawer(false);
        form.resetFields();
      },
      (error) => {
        setLoading(false);
        messageApi.error(error);
      }
    );
  };

  const updateChapter = async (chapterId: number) => {
    setLoading(true);

    ProgramService.updateChapter(
      chapterId,
      form.getFieldsValue().name,
      form.getFieldsValue().description,
      Number(form.getFieldsValue().index),
      (result) => {
        setLoading(false);
        messageApi.info(result.message);
        onRefresh();
        showChapterDrawer(false);
        form.resetFields();
      },
      (error) => {
        setLoading(false);
        setEdit(false);
        messageApi.error(error);
      }
    );
  };

  return (
    <>
      {contextHolder}
      <Drawer
        className={styles.add_chapter_wrapper}
        title={edit ? "Update Chapter" : "New Chapter Details"}
        placement="right"
        classNames={{ header: styles.headerWrapper, body: styles.body, footer: styles.footer }}
        maskClosable={false}
        onClose={() => {
          onClose();
        }}
        open={open}
        footer={
          <Space>
            <Button onClick={() => form.submit()} loading={loading} type="primary">
              {edit ? "Update" : "Save"}
            </Button>
            <Button
              type="default"
              onClick={() => {
                onClose();
                router.query.chapterId && router.replace(`/admin/content`);
              }}
            >
              Cancel
            </Button>
          </Space>
        }
      >
        <Form
          form={form}
          onFinish={() => {
            edit && chapterId ? updateChapter(chapterId) : createChapter(courseId);
          }}
          layout="vertical"
        >
          <div>
            <Form.Item label="Title" name="name" rules={[{ required: true, message: "Please Enter Title" }]}>
              <Input placeholder="Set the title of the chapter" />
            </Form.Item>
            <div>
              <div>
                <Form.Item
                  name="description"
                  label="Description"
                  rules={[{ required: true, message: "Please Enter Description" }]}
                >
                  <Input.TextArea rows={4} placeholder="Brief description about the chapter" />
                </Form.Item>
              </div>
            </div>
          </div>
        </Form>
      </Drawer>
    </>
  );
};

export default AddCourseChapter;
