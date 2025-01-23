import React, { FC, useState } from "react";

import { Button, Dropdown, Flex, Form, FormInstance, Input, Popconfirm, Select, Space, Tooltip, Upload } from "antd";
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
const { TextArea } = Input;

const LearningPathForm: FC<{
  loading: boolean;
  onSubmit: (state: StateType, file?: File) => void;
  form: FormInstance;
  pathId?: number;
  currentState: StateType;
  courseList: ILearningCourseList[];
  title: string;

  initialValue?: {
    title: string;
    description: string;
    courses: string[];
    banner: string;
  };
}> = ({ pathId, loading, form, onSubmit, currentState, courseList, title, initialValue }) => {
  const [bannerUploading, setBannerUploading] = useState<boolean>(false);
  const [banner, setBanner] = useState<string>(initialValue?.banner || "");
  const [file, setFile] = useState<File>();
  const router = useRouter();
  const [state, setState] = useState<StateType>(currentState);

  const uploadFile = async (file: any) => {
    if (file) {
      setBannerUploading(true);
      const base64 = await getBase64(file);
      setBanner(base64 as string);
      setFile(file);
      setBannerUploading(false);
    }
  };

  const onDiscard = (pathId: number) => {};

  return (
    <>
      <section className={styles.add__learing__path__wrapper}>
        <Form
          form={form}
          onFinish={() => {
            onSubmit(state, file);
          }}
          style={{ maxWidth: "80vw" }}
          layout="vertical"
          requiredMark={false}
          initialValues={initialValue}
        >
          <Flex justify="space-between" align="center" className={styles.setting_header}>
            <h3>{title}</h3>
            <Flex gap={20}>
              <Popconfirm
                title={`${pathId ? "Delete" : "Discard"} the learningPath`}
                description={`Are you sure to ${pathId ? "Delete" : "Discard"} this entire learningPath?`}
                onConfirm={() => (pathId ? onDiscard(pathId) : router.push("/dashboard"))}
                okText="Yes"
                cancelText="No"
              >
                <Button>Discard</Button>
              </Popconfirm>
              <Dropdown.Button
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
          <ConfigFormLayout formTitle={"Basic Information"} isCollapsible={false}>
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
                      required: true,
                      message: "Required courses ",
                    },
                  ]}
                >
                  <Select
                    style={{ width: 350 }}
                    onChange={(v) => {
                      return v.map((opt: string) => {
                        if (
                          courseList.find((cl) => {
                            cl.name === opt;
                          })
                        ) {
                          return courseList.find((l) => l.name == opt)?.courseId;
                        } else {
                          return opt;
                        }
                      });
                    }}
                    placeholder="Choose Courses"
                    mode="multiple"
                  >
                    {courseList.map((c, i) => {
                      return (
                        <Select.Option key={i} value={`${c.courseId}`}>
                          {c.name}
                        </Select.Option>
                      );
                    })}
                  </Select>
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
