import React, { FC, useState } from "react";

import {
  Button,
  Dropdown,
  Flex,
  Form,
  FormInstance,
  Input,
  message,
  Popconfirm,
  Select,
  Space,
  Tag,
  Tooltip,
  Upload,
} from "antd";
import SvgIcons from "@/components/SvgIcons";
import { LoadingOutlined } from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import ConfigFormLayout from "@/components/Configuration/ConfigFormLayout";
import { ConfigFormItem } from "@/components/Configuration/ConfigForm";
import { getBase64 } from "@/lib/utils";
import { useRouter } from "next/router";
import { ILearningCourseList } from "@/types/learingPath";
import { StateType } from "@prisma/client";
import styles from "./LearningPath.module.scss";
import CourseSelectForm from "./CourseSelectForm";
import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import LearningPathSerivices from "@/services/learningPath/LearningPathSerivices";
import Link from "next/link";
const { TextArea } = Input;

const LearningPathForm: FC<{
  loading: boolean;
  onSubmit: (state: StateType, courses: ILearningCourseList[], file?: File) => void;
  form: FormInstance;
  pathId?: number;
  currentState: StateType;
  courseList: ILearningCourseList[];
  title: string;

  initialValue?: {
    title: string;
    description: string;
    courses: ILearningCourseList[];
    banner: string;
  };
}> = ({ pathId, loading, form, onSubmit, currentState, courseList, title, initialValue }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [bannerUploading, setBannerUploading] = useState<boolean>(false);
  const [banner, setBanner] = useState<string>(initialValue?.banner || "");
  const [file, setFile] = useState<File>();
  const router = useRouter();
  const [state, setState] = useState<StateType>(currentState);
  const [items, setItems] = useState<ILearningCourseList[]>(initialValue?.courses || []);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setItems((prevItems) => {
        const oldIndex = prevItems.indexOf(prevItems.find((f) => f.courseId === active.id) as any);
        const newIndex = prevItems.indexOf(prevItems.find((f) => f.courseId === over?.id) as any);
        let newArray = arrayMove(prevItems, oldIndex, newIndex);

        return newArray;
      });
    }
  };

  const uploadFile = async (file: any) => {
    if (file) {
      setBannerUploading(true);
      const base64 = await getBase64(file);
      setBanner(base64 as string);
      setFile(file);
      setBannerUploading(false);
    }
  };

  const onDiscard = (pathId: number) => {
    LearningPathSerivices.delete(
      pathId,
      (result) => {
        messageApi.success(result.message);
        router.push("/academy");
      },
      (error) => {
        messageApi.error(error);
      }
    );
  };
  const onRemove = (id: number) => {
    setItems((prevItems) => {
      let newArray = prevItems.filter((f) => f.courseId !== id);
      return newArray;
    });
  };

  const onSelect = (value: string) => {
    const isExist = items.find((l) => l.courseId === Number(value));
    if (!isExist) {
      setItems([...items, courseList.find((l) => l.courseId == Number(value))] as ILearningCourseList[]);
    }
    form.resetFields(["courses"]);
  };

  return (
    <>
      {contextHolder}
      <section className={styles.add__learing__path__wrapper}>
        <Form
          form={form}
          onFinish={() => {
            onSubmit(state, items, file);
          }}
          style={{ maxWidth: "80vw" }}
          layout="vertical"
          requiredMark={false}
          initialValues={initialValue}
        >
          <Flex justify="space-between" align="center" className={styles.setting_header}>
            <Flex gap={10} align="center">
              <Link href={"/academy"} style={{ lineHeight: 0 }}>
                <i style={{ lineHeight: 0, fontSize: 18 }}>{SvgIcons.arrowLeft}</i>
              </Link>
              <h3 style={{ margin: 0 }}>{title}</h3>
            </Flex>
            <Flex gap={20}>
              {pathId && (
                <Popconfirm
                  title={`Delete the learning Path`}
                  description={`Are you sure you want to  delete this entire learning path?`}
                  onConfirm={() => (pathId ? onDiscard(pathId) : router.push("/academy"))}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button>Discard</Button>
                </Popconfirm>
              )}

              <Dropdown.Button
                disabled={courseList.length < 2}
                loading={loading}
                type="primary"
                htmlType="submit"
                onClick={() => {
                  setState(currentState === StateType.DRAFT ? StateType.ACTIVE : StateType.DRAFT);
                }}
                icon={SvgIcons.chevronDown}
                menu={{
                  items: [
                    {
                      key: 1,

                      label: currentState === StateType.DRAFT ? "Save" : "Publish ",
                      onClick: () => {
                        setState(currentState === StateType.DRAFT ? StateType.DRAFT : StateType.ACTIVE);
                        form.submit();
                      },
                    },
                  ],
                }}
              >
                {currentState === StateType.DRAFT ? "Publish " : "Save as Draft"}
              </Dropdown.Button>
            </Flex>
          </Flex>
          <ConfigFormLayout
            formTitle={"Basic Information"}
            extraContent={
              <Tag
                color={courseList.length > 1 ? "warning" : "volcano"}
                style={{
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  padding: "0px 15px",
                  gap: 5,
                  marginInlineEnd: 0,
                }}
              >
                <i style={{ fontSize: 18, lineHeight: 0, color: "inherit" }}>{SvgIcons.info}</i>
                <div>Currently, only free courses can be added to the learning path.</div>
              </Tag>
            }
            isCollapsible={false}
          >
            <ConfigFormItem
              input={
                <Form.Item name={"title"} rules={[{ required: true, message: "Learning path title is required!" }]}>
                  {<Input style={{ width: 350 }} placeholder="Learn how to build" />}
                </Form.Item>
              }
              title={"Title"}
              description={"Provide a short title for your learning path, that will set the expectation of the leaners"}
              divider={true}
            />
            <ConfigFormItem
              input={
                <Form.Item name="description" layout="vertical" rules={[{ required: true, message: "Required" }]}>
                  <TextArea rows={3} placeholder="This learning path is introduces you to..." />
                </Form.Item>
              }
              title={"Description"}
              description={
                "Provide a brief description about the learning path, highlighting key objectives, pre-requisistes and outcome"
              }
              divider={true}
              layout="vertical"
            />
            <ConfigFormItem
              input={
                <Form.Item
                  name="courses"
                  rules={[
                    {
                      required: items.length < 2,
                      message: "Select atleast 2 courses ",
                    },
                  ]}
                >
                  <CourseSelectForm
                    onRemove={onRemove}
                    courseList={courseList}
                    items={items}
                    onSelect={onSelect}
                    handleDragEnd={handleDragEnd}
                  />
                </Form.Item>
              }
              title={"Select Courses"}
              description={"Add publish courses that would be  part of your learning path"}
              divider={true}
              layout="horizontal"
            />

            <ConfigFormItem
              input={
                <div style={{ width: 350, height: 196, position: "relative" }}>
                  <ImgCrop fillColor={"transparent"} rotationSlider aspect={16 / 9}>
                    <Upload
                      name="avatar"
                      listType="text"
                      showUploadList={false}
                      className={styles.upload__learning__banner}
                      beforeUpload={(file) => {
                        uploadFile(file);
                      }}
                      onChange={() => {}}
                    >
                      {banner ? (
                        <div
                          style={{
                            border: "1px dotted var(--border-color)",
                            borderRadius: 4,
                          }}
                        >
                          <img
                            style={{ borderRadius: 4, objectFit: "cover", width: 350, height: "auto" }}
                            src={banner}
                          />
                          <Tooltip title={`Upload  banner`}>
                            <div className={styles.camera_btn_img}>
                              {bannerUploading && banner ? <LoadingOutlined /> : <i>{SvgIcons.camera}</i>}
                            </div>
                          </Tooltip>

                          <div className={styles.bannerStatus}>{bannerUploading && "Uploading"}</div>
                        </div>
                      ) : (
                        <button
                          style={{
                            border: "1px dotted var(--border-color)",
                            background: "none",
                            cursor: "pointer",
                            borderRadius: 4,
                            width: "350px",
                            height: 196,
                          }}
                          type="button"
                        >
                          {bannerUploading ? <LoadingOutlined /> : SvgIcons.uploadIcon}
                          {!bannerUploading ? (
                            <div style={{ marginTop: 8 }}>Upload banner</div>
                          ) : (
                            <div style={{ color: "#000" }}>{bannerUploading && "Uploading"}</div>
                          )}
                        </button>
                      )}
                    </Upload>
                  </ImgCrop>
                </div>
              }
              title={"Upload Banner"}
              description={"Upload the banner for the learning path"}
              divider={false}
              layout="horizontal"
            />
          </ConfigFormLayout>
        </Form>
      </section>
    </>
  );
};

export default LearningPathForm;
