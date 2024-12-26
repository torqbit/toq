import React, { FC } from "react";
import styles from "@/styles/Dashboard.module.scss";

import {
  Button,
  Flex,
  Form,
  FormInstance,
  Input,
  Popconfirm,
  Radio,
  Select,
  Space,
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
import SpinLoader from "@/components/SpinLoader/SpinLoader";
import { $Enums, VideoState } from "@prisma/client";
import ConfigFormLayout from "@/components/Configuration/ConfigFormLayout";
import ConfigForm, { ConfigFormItem } from "@/components/Configuration/ConfigForm";

const { TextArea } = Input;

const CourseSetting: FC<{
  onDiscard: () => void;
  form: FormInstance;
  onSubmit: () => void;
  uploadFile: (file: any, title: string) => void;
  onUploadTrailer: (file: RcFile, title: string) => void;
  courseBannerUploading: boolean;
  courseTrailerUploading: boolean;
  onSetCourseData: (key: string, value: string) => void;
  courseData: {
    name: string;
    description: string;
    expiryInDays: number;
    chapters: ChapterDetail[];
    coursePrice?: number;
  };
  courseBanner?: string;
  uploadVideo?: VideoInfo;
  settingLoading?: boolean;
  selectedCourseType: { free: boolean; paid: boolean };
  selectCourseType: (courseType: $Enums.CourseType) => void;
}> = ({
  onSubmit,
  form,
  courseData,
  onUploadTrailer,
  uploadFile,
  onDiscard,
  courseBannerUploading,
  courseTrailerUploading,
  uploadVideo,
  onSetCourseData,
  courseBanner,
  settingLoading,
  selectedCourseType,
  selectCourseType,
}) => {
  const handleChange: UploadProps["onChange"] = (info) => {
    if (info.file.status === "uploading") {
      return;
    }
    if (info.file.status === "done") {
      // setLoading(false);
    }
  };

  const courseDifficulty = ["Beginner", "Intermediate", "Advance"];

  return (
    <>
      {settingLoading ? (
        <>
          <SpinLoader />
        </>
      ) : (
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
                    courseTrailerUploading ||
                    uploadVideo?.state == VideoState.PROCESSING ||
                    !uploadVideo?.videoUrl ||
                    !courseBanner
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
                      {
                        <Input
                          placeholder="Learn how to build"
                          defaultValue={form.getFieldsValue().course_name}
                          onChange={(e) => {
                            onSetCourseData("name", e.currentTarget.value);
                          }}
                        />
                      }
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
                          disabled={selectedCourseType.paid}
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
                    <Form.Item name="expiryInDays" required>
                      <Input
                        placeholder="25"
                        width={100}
                        onChange={(e) => {
                          onSetCourseData("coursePrice", e.currentTarget.value);
                        }}
                        defaultValue={courseData.coursePrice}
                        suffix={"USD"}
                      />
                    </Form.Item>
                  }
                  title={"Course Price"}
                  description={"Enter the price of the course"}
                  divider={true}
                  layout="horizontal"
                />
              </Form>
            </ConfigFormLayout>
            <div className={styles.course_thumbnails}>
              <h4>Trailer and thumbnail images</h4>
              <div className={styles.row_1}>
                <div>
                  <h5>Course trailer video</h5>
                  <p>Upload a video of upto 30 sec duration in 16:9 aspect ratio</p>
                </div>
                <div className={styles.video_container}>
                  <Upload
                    name="avatar"
                    listType="picture-card"
                    className={styles.upload__trailer}
                    disabled={courseTrailerUploading || uploadVideo?.state == VideoState.PROCESSING}
                    showUploadList={false}
                    beforeUpload={(file) => {
                      onUploadTrailer(file, `${form.getFieldsValue().course_name}`);
                    }}
                    onChange={handleChange}
                  >
                    {uploadVideo?.state == VideoState.READY && !courseTrailerUploading && (
                      <Tooltip title="Upload new trailer video">
                        <img
                          src={uploadVideo?.thumbnail}
                          alt=""
                          height={180}
                          className={styles.video_container}
                          width={320}
                        />
                        <div
                          style={{ height: 50, width: 50, fontSize: "1.4rem" }}
                          className={`${styles.video_status} ${styles.video_status_ready}`}
                        >
                          {SvgIcons.video}
                        </div>
                      </Tooltip>
                    )}
                    {(uploadVideo?.state == VideoState.PROCESSING || courseTrailerUploading) && (
                      <div
                        style={{ height: 50, width: 80 }}
                        className={`${styles.video_status} ${styles.video_status_loading}`}
                      >
                        <LoadingOutlined />
                        <span>{courseTrailerUploading ? "Uploading" : "Processing"}</span>
                      </div>
                    )}
                    {!uploadVideo?.state && !courseTrailerUploading && (
                      <div
                        style={{ height: 50, width: 150 }}
                        className={`${styles.video_status} ${styles.video_status_loading}`}
                      >
                        <i style={{ display: "block" }}>{SvgIcons.video}</i>
                        <span>Upload Video</span>
                      </div>
                    )}
                  </Upload>
                </div>
              </div>
              <div className={styles.row_2}>
                <div>
                  <h4>Course thumbnail image</h4>
                  <p>Upload a photo of 256px x 256px </p>
                </div>
                <div className={styles.video_container}>
                  <ImgCrop rotationSlider>
                    <Upload
                      name="avatar"
                      listType="picture-card"
                      className={styles.upload__thumbnail}
                      disabled={courseTrailerUploading}
                      showUploadList={false}
                      style={{ width: 118, height: 118 }}
                      beforeUpload={(file) => {
                        uploadFile(file, `${form.getFieldsValue().course_name}_banner`);
                      }}
                      onChange={handleChange}
                    >
                      {courseBanner ? (
                        <>
                          <img
                            style={{ borderRadius: 4, objectFit: "cover", width: 148, height: 148 }}
                            src={courseBanner}
                          />
                          <Tooltip title="Upload course thumbnail">
                            <div className={styles.camera_btn_img}>
                              {courseBannerUploading && courseBanner ? <LoadingOutlined /> : SvgIcons.camera}
                            </div>
                          </Tooltip>
                          <div className={styles.bannerStatus}>{courseBannerUploading && "Uploading"}</div>
                        </>
                      ) : (
                        <button
                          className={styles.upload_img_button}
                          style={{ border: 0, background: "none", width: 150, height: 150 }}
                          type="button"
                        >
                          {courseBannerUploading ? <LoadingOutlined /> : SvgIcons.uploadIcon}
                          {!courseBannerUploading ? (
                            <div style={{ marginTop: 8 }}>Upload Image</div>
                          ) : (
                            <div style={{ color: "#000" }}>{courseBannerUploading && "Uploading"}</div>
                          )}
                        </button>
                      )}
                    </Upload>
                  </ImgCrop>
                </div>
              </div>
            </div>
            <div className={styles.course_pricing}>
              <h4>Pricing</h4>
              <p>Displayed on the Course listing and landing page</p>
              <div className={styles.course_payment_type}>
                <div className={styles.free_course}>
                  <Radio checked={selectedCourseType.free} onClick={() => selectCourseType($Enums.CourseType.FREE)}>
                    Free
                  </Radio>
                  <p>Free content for the specified duration </p>
                  <p>Days until expiry</p>
                  <Form.Item name="expiryInDays">
                    <div className={styles.days_left}>
                      <Input
                        disabled={selectedCourseType.paid}
                        placeholder="days left"
                        onChange={(e) => {
                          onSetCourseData("expiryInDays", e.currentTarget.value);
                        }}
                        value={courseData.expiryInDays || form.getFieldsValue().expiryInDays}
                        defaultValue={courseData.expiryInDays}
                      />

                      <div>Days</div>
                    </div>
                  </Form.Item>
                </div>
                <div className={styles.paid_course}>
                  <Radio checked={selectedCourseType.paid} onClick={() => selectCourseType($Enums.CourseType.PAID)}>
                    One time Payment
                  </Radio>
                  <p>Paid content for the specified duration </p>

                  <div className={styles.paid_overview}>
                    <div>
                      <p className={styles.expiry_para}> {`Price (in USD)`}</p>
                      <div className={styles.days_left}>
                        <Input
                          disabled={selectedCourseType.free}
                          placeholder="add price"
                          onChange={(e) => {
                            onSetCourseData("coursePrice", e.currentTarget.value);
                          }}
                          defaultValue={selectedCourseType.free ? 0 : courseData.coursePrice}
                        />

                        <div>Price</div>
                      </div>
                    </div>
                    <div>
                      <p className={styles.expiry_para}>Days until expiry</p>
                      <div className={styles.days_left}>
                        <Input
                          disabled={selectedCourseType.free}
                          placeholder="days left"
                          onChange={(e) => {
                            onSetCourseData("expiryInDays", e.currentTarget.value);
                          }}
                          value={courseData.expiryInDays || form.getFieldsValue().expiryInDays}
                          defaultValue={courseData.expiryInDays}
                        />

                        <div>Days</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </section>
      )}
    </>
  );
};

export default CourseSetting;
