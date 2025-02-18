import React, { FC, useState } from "react";
import styles from "@/styles/Dashboard.module.scss";
import {
  Button,
  Flex,
  Form,
  FormInstance,
  Input,
  Popconfirm,
  Radio,
  Segmented,
  Select,
  Space,
  Spin,
  Switch,
  Tooltip,
  Upload,
  UploadProps,
} from "antd";
import SvgIcons from "@/components/SvgIcons";
import { LoadingOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";
import { ChapterDetail, VideoInfo } from "@/types/courses/Course";
import ImgCrop from "antd-img-crop";
import { certificateConfig } from "@/lib/certificatesConfig";

import { $Enums, VideoState } from "@prisma/client";
import ConfigFormLayout from "@/components/Configuration/ConfigFormLayout";
import ConfigForm, { ConfigFormItem } from "@/components/Configuration/ConfigForm";

const { TextArea } = Input;

const CourseSetting: FC<{
  onDiscard: () => void;
  form: FormInstance;
  onSubmit: () => void;
  uploadTeaserThumbnail: (file: any) => void;
  onUploadTrailer: (file: RcFile, title: string) => void;
  courseTrailerUploading: boolean;
  onSetCourseData: (key: string, value: string) => void;
  courseData: {
    name: string;
    description: string;
    expiryInDays: number;
    currency?: string;
    chapters: ChapterDetail[];
    coursePrice?: number;
  };
  trailerThumbnail?: string;
  uploadVideo?: VideoInfo;
  settingLoading?: boolean;
}> = ({
  onSubmit,
  form,
  courseData,
  onUploadTrailer,
  uploadTeaserThumbnail,
  onDiscard,
  courseTrailerUploading,
  uploadVideo,
  onSetCourseData,
  settingLoading,
  trailerThumbnail,
}) => {
  const handleChange: UploadProps["onChange"] = (info) => {
    if (info.file.status === "uploading") {
      return;
    }
    if (info.file.status === "done") {
      // setLoading(false);
    }
  };
  type TeaserInput = "Video" | "Thumbnail";

  const [teaser, setTeaser] = useState<{
    selected: TeaserInput;
    video: {
      state: "empty" | "uploading" | "processing" | "uploaded";
      videoThumbnail?: string;
    };
    thumbnail: {
      state: "empty" | "uploading" | "uploaded";
      url?: string;
    };
  }>({
    selected: "Video",
    video: {
      state: uploadVideo ? "uploaded" : "empty",
      videoThumbnail: uploadVideo?.thumbnail,
    },
    thumbnail: {
      state: uploadVideo?.thumbnail ? "uploaded" : "empty",
      url: trailerThumbnail,
    },
  });

  const courseDifficulty = ["Beginner", "Intermediate", "Advance"];
  return (
    <>
      <Spin spinning={settingLoading} indicator={<LoadingOutlined spin />} size="large">
        <section className={styles.add_course_setting}>
          <Form form={form} onFinish={onSubmit} layout="vertical" requiredMark={false}>
            <div className={styles.setting_header}>
              <h3>Settings</h3>
              <Space>
                <Popconfirm
                  title={`Delete this course`}
                  description={`Are you sure to delete this entire course?`}
                  onConfirm={() => onDiscard()}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button>Discard</Button>
                </Popconfirm>
                <Button
                  type="primary"
                  htmlType="submit"
                  className={styles.save_setting_btn}
                  disabled={
                    courseTrailerUploading || uploadVideo?.state == VideoState.PROCESSING || !uploadVideo?.videoUrl
                  }
                >
                  Save Settings <img style={{ marginLeft: 5 }} src="/img/program/arrow-right.png" alt="arrow" />
                </Button>
              </Space>
            </div>
            <ConfigFormLayout formTitle={"Course Basic Information"}>
              <Form form={form} onFinish={onSubmit} layout="vertical" requiredMark={false}>
                <ConfigFormItem
                  input={
                    <Form.Item name={"course_name"} rules={[{ required: true, message: "Course title is required!" }]}>
                      <Input
                        placeholder="Learn how to build"
                        defaultValue={form.getFieldsValue().course_name}
                        onChange={(e) => {
                          onSetCourseData("name", e.currentTarget.value);
                        }}
                      />
                    </Form.Item>
                  }
                  title={"Course title"}
                  description={"Provide a short title for your course, that will set the expectation of the leaners"}
                  divider={true}
                />
                <ConfigFormItem
                  input={
                    <Form.Item
                      name="course_description"
                      layout="vertical"
                      rules={[{ required: true, message: "Required" }]}
                    >
                      <TextArea
                        onChange={(e) => {
                          onSetCourseData("descripiton", e.currentTarget.value);
                        }}
                        rows={3}
                        placeholder="This course is introduces you to..."
                      />
                    </Form.Item>
                  }
                  title={"Course description"}
                  description={
                    "Provide a brief description about the course, highlighting key objectives, pre-requisistes and outcome"
                  }
                  divider={true}
                  layout="vertical"
                />
                <ConfigFormItem
                  input={
                    <Form.Item
                      name="course_difficulty"
                      rules={[
                        {
                          required: true,
                          message: "Required difficulty level",
                        },
                      ]}
                    >
                      <Select
                        placeholder="Choose Difficulty level"
                        onChange={(e) => {
                          onSetCourseData("difficultyLevel", e);
                        }}
                      >
                        {courseDifficulty.map((difficulty, i) => {
                          return (
                            <Select.Option key={i} value={`${difficulty}`}>
                              {difficulty}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  }
                  title={"Difficulty Level"}
                  description={
                    "Choose the difficulty level appropriately, for the learners to make a better informed decision"
                  }
                  divider={false}
                  layout="horizontal"
                />
                <ConfigFormItem
                  input={
                    <Form.Item
                      name="certificate_template"
                      rules={[
                        {
                          required: true,
                          message: "Required Certificate template level",
                        },
                      ]}
                    >
                      <Select
                        placeholder="Choose Certificate Template"
                        onChange={(e) => {
                          onSetCourseData("certificateTemplate", e);
                        }}
                      >
                        {certificateConfig.map((certificate, i) => {
                          return (
                            <Select.Option key={i} value={`${certificate.id}`}>
                              {certificate.name}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  }
                  title={"Certificate Template"}
                  description={
                    "Choose the certificate template, that will be used for generating certificates on course completion"
                  }
                  divider={true}
                  layout="horizontal"
                />
                <ConfigFormItem
                  input={
                    <Form.Item name={"previewMode"} label={"Preview Mode"}>
                      <Switch value={true} />
                    </Form.Item>
                  }
                  title={"Is Course available for preview?"}
                  description={
                    "Enable this mode if the course is available for early preview for learners. For such courses, no certificate will be generated on course completion"
                  }
                  divider={true}
                  layout="horizontal"
                />
                <ConfigFormItem
                  input={
                    <Form.Item name="expiryInDays" required>
                      <div className={styles.days_left}>
                        <Input
                          placeholder="100"
                          onChange={(e) => {
                            onSetCourseData("expiryInDays", e.currentTarget.value);
                          }}
                          value={courseData.expiryInDays || form.getFieldsValue().expiryInDays}
                          defaultValue={courseData.expiryInDays}
                          suffix={"Days"}
                        />
                      </div>
                    </Form.Item>
                  }
                  title={"Course Validity"}
                  description={"Enter the number of days the course will be valid post enrolment"}
                  divider={true}
                  layout="horizontal"
                />
                <ConfigFormItem
                  input={
                    <Form.Item name="coursePrice" required>
                      <Input
                        placeholder="250"
                        width={100}
                        value={2000}
                        onChange={(e) => {
                          onSetCourseData("coursePrice", e.currentTarget.value);
                        }}
                        defaultValue={courseData.coursePrice}
                        suffix={courseData.currency}
                      />
                    </Form.Item>
                  }
                  title={"Course Price"}
                  description={`Enter the price of the course in ${courseData.currency}`}
                  divider={true}
                  layout="horizontal"
                />
                <ConfigFormItem
                  input={
                    <Flex align="center" gap={10} vertical>
                      <Segmented<string>
                        options={["Video", "Thumbnail"]}
                        defaultValue={teaser.selected}
                        onChange={(value) => {
                          setTeaser({ ...teaser, selected: value as TeaserInput }); // string
                        }}
                        className={styles.setting__video__segment}
                      />
                      {teaser.selected == "Video" && (
                        <Upload
                          name="avatar"
                          className={styles.video_container}
                          disabled={courseTrailerUploading || uploadVideo?.state == VideoState.PROCESSING}
                          showUploadList={false}
                          style={{ width: 300, height: 200 }}
                          beforeUpload={(file) => {
                            onUploadTrailer(file, `${form.getFieldsValue().course_name}`);
                          }}
                          onChange={handleChange}
                        >
                          {uploadVideo?.videoId == null && !courseTrailerUploading && (
                            <Tooltip title="Upload trailer video">
                              <Flex vertical gap={4} align="center">
                                {<i style={{ cursor: "pointer" }}>{SvgIcons.video}</i>}
                                <p>Upload course trailer</p>
                              </Flex>
                            </Tooltip>
                          )}
                          {uploadVideo?.state == VideoState.READY && !courseTrailerUploading && (
                            <Tooltip title="Upload new trailer video">
                              <img
                                src={uploadVideo?.thumbnail}
                                alt=""
                                style={{ cursor: "pointer" }}
                                height={180}
                                className={styles.video_container}
                                width={320}
                              />
                            </Tooltip>
                          )}
                          {(uploadVideo?.state == VideoState.PROCESSING || courseTrailerUploading) && (
                            <div
                              className={`${styles.video_status} ${styles.video_status_loading} ${styles.video_container}`}
                            >
                              <LoadingOutlined />
                              <span style={{ marginLeft: 5 }}>
                                {courseTrailerUploading ? "Uploading" : "Processing"}
                              </span>
                            </div>
                          )}
                        </Upload>
                      )}

                      {teaser.selected == "Thumbnail" && (
                        <Upload
                          name="avatar"
                          className={styles.video_container}
                          accept=".png,.jpeg,.jpg"
                          disabled={
                            uploadVideo?.videoId == null ||
                            uploadVideo?.state == VideoState.PROCESSING ||
                            courseTrailerUploading
                          }
                          showUploadList={false}
                          style={{ width: 118, height: 118 }}
                          beforeUpload={(file) => {
                            uploadTeaserThumbnail(file);
                          }}
                          onChange={handleChange}
                        >
                          <>
                            <Tooltip
                              title={
                                uploadVideo?.videoId == null ||
                                uploadVideo?.state == VideoState.PROCESSING ||
                                courseTrailerUploading
                                  ? "Complete uploading the course trailer"
                                  : "Update the video thumbnail"
                              }
                            >
                              {trailerThumbnail && (
                                <img
                                  style={{ borderRadius: 4, objectFit: "cover", width: 318, height: 178 }}
                                  src={trailerThumbnail}
                                />
                              )}
                              {!trailerThumbnail && (
                                <Flex vertical gap={4} align="center">
                                  {<i style={{ cursor: "pointer" }}>{SvgIcons.camera}</i>}
                                  <p>Upload thumbnail</p>
                                </Flex>
                              )}
                            </Tooltip>
                          </>
                        </Upload>
                      )}
                    </Flex>
                  }
                  title={"Course Trailer"}
                  description={
                    "Upload the trailer video that can would introduce the course to the end users, and optionally update the thumbnail for the trailer"
                  }
                  divider={false}
                  layout="horizontal"
                />
              </Form>
            </ConfigFormLayout>
          </Form>
        </section>
      </Spin>
    </>
  );
};

export default CourseSetting;
