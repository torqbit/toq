import { Button, Drawer, Form, FormInstance, Input, Upload, Space, Tooltip, message, Progress } from "antd";
import { FC, useEffect, useState } from "react";
import styles from "@/styles/AddCourse.module.scss";
import { CloseOutlined, LoadingOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";
import SvgIcons from "../../SvgIcons";
import { IVideoLesson, VideoAPIResponse } from "@/types/courses/Course";
import { $Enums, ResourceContentType, VideoState } from "@prisma/client";
import ProgramService from "@/services/ProgramService";
import { postWithFile } from "@/services/request";
import { getChunkPercentage } from "@/lib/utils";
import ImgCrop from "antd-img-crop";
import appConstant from "@/services/appConstant";
import ConfigFormItem from "@/components/Configuration/ConfigForm";

const AddVideoLesson: FC<{
  isEdit: boolean;
  videoLesson: IVideoLesson;
  setVideoLesson: (lesson: IVideoLesson) => void;
  onRefresh: () => void;
  setResourceDrawer: (value: boolean) => void;
  showResourceDrawer: boolean;
  onDeleteResource: (id: number, isCanceled: boolean) => void;
  contentType?: $Enums.ResourceContentType;
  currResId?: number;
  setEdit: (value: boolean) => void;
  form: FormInstance;
}> = ({
  setResourceDrawer,
  showResourceDrawer,
  onRefresh,
  form,
  isEdit,
  onDeleteResource,
  videoLesson,
  setVideoLesson,
  currResId,
  contentType,
  setEdit,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [resourceVideoUploading, setResourceVideoUploading] = useState<boolean>(false);
  const [thumbnailUploading, setThumbnailUploading] = useState<boolean>(false);
  const [hoverCamera, setHoverCamera] = useState<boolean>(false);
  const [preventThumbnailUpload, setPreventThumbnailUpload] = useState<boolean>(false);

  const [checkLessonVideoState, setCheckLessonVideoState] = useState<boolean>();
  const [uploadedChunkPercentage, setUplaodedChunksPercentage] = useState<number>(0);
  const onUploadVideo = async (file: RcFile, resourceId: number) => {
    let title = `${resourceId}-${new Date().getTime()}`;
    setResourceVideoUploading(true);
    const chunkSize = 2 * 1024 * 1024;
    const totalChunks = Math.ceil(file.size / chunkSize);
    let start = 0;
    let end = chunkSize;

    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      const chunk = file.slice(start, end);
      const formData = new FormData();
      formData.append("file", chunk, file.name);
      formData.append("chunkIndex", String(chunkIndex));
      formData.append("totalChunks", String(totalChunks));
      formData.append("title", title);
      formData.append("objectId", resourceId.toString());
      formData.append("objectType", "lesson");

      const postRes = await postWithFile(formData, `/api/v1/upload/video/upload`);
      setUplaodedChunksPercentage(getChunkPercentage(chunkIndex + 1, totalChunks));

      start = end;
      end = start + chunkSize;
      if (!postRes.ok) {
        setResourceVideoUploading(false);
      }

      videoLesson.video?.thumbnail && formData.append("existingFilePath", videoLesson.video.thumbnail);

      const res = (await postRes.json()) as VideoAPIResponse;

      if (res.success) {
        setVideoLesson({
          ...videoLesson,
          video: {
            id: Number(res.video?.id),
            providerVideoId: res.video.videoId,
            videoUrl: res.video.videoUrl,
            thumbnail: res.video.thumbnail,
            resourceId: currResId || 0,
            state: res.video.state,
            mediaProvider: res.video.mediaProviderName,
            videoDuration: res.video.videoDuration,
          },
        });
        setCheckLessonVideoState(true);
        setUplaodedChunksPercentage(0);

        setResourceVideoUploading(false);
      }
    }
  };

  const onFindResource = (chapterId: number, content: ResourceContentType) => {
    setEdit(false);
    ProgramService.getResources(
      chapterId,
      (result) => {
        form.resetFields();
        setLoading(false);
        !showResourceDrawer && setResourceDrawer(true);
        setVideoLesson({ ...videoLesson, chapterId: chapterId });
      },
      (error) => {
        messageApi.error(error);
      }
    );
  };

  const onUpdateVideoLesson = async () => {
    setLoading(true);

    let resData = {
      name: form.getFieldsValue().name,
      resourceId: currResId,
      description: form.getFieldsValue().description,
    };

    ProgramService.updateResource(
      resData,
      (result) => {
        messageApi.success(result.message);
        videoLesson.chapterId && onFindResource(videoLesson.chapterId, "Video");
        form.resetFields();
        setLoading(false);
        form.setFieldValue("contentType", "Video");
        setTimeout(() => {
          setResourceDrawer(false);
        }, 300);

        onRefresh();
        if (isEdit) {
          setEdit(true);
        } else {
          setResourceDrawer(false);
          onRefresh();
        }
      },
      (error) => {
        onRefresh();
        messageApi.error(error);
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    let intervalId: NodeJS.Timer | undefined;
    if (
      checkLessonVideoState &&
      videoLesson &&
      videoLesson.video &&
      videoLesson.video.state == VideoState.PROCESSING &&
      typeof intervalId === "undefined"
    ) {
      intervalId = setInterval(() => {
        ProgramService.getResource(
          Number(currResId),
          (result) => {
            setVideoLesson({
              ...videoLesson,
              video: {
                id: result.resource.video.id,
                providerVideoId: result.resource.video.providerVideoId,
                videoUrl: result.resource.video.videoUrl,
                thumbnail: result.resource.video.thumbnail,
                resourceId: currResId || 0,
                state: result.resource.video.state,
                mediaProvider: result.resource.video.mediaProvider,
                videoDuration: result.resource.video.videoDuration,
              },
            });

            setCheckLessonVideoState(result.resource.video.state == VideoState.PROCESSING);
          },
          (error) => {
            messageApi.error(error);
          }
        );
      }, 1000 * 5); // in milliseconds
    }
    if (intervalId && videoLesson && videoLesson.video && videoLesson.video.state == VideoState.READY) {
      clearInterval(Number(intervalId));
    }
    return () => {
      intervalId && clearInterval(Number(intervalId));
    };
  }, [checkLessonVideoState]);

  const uploadFile = async (file: any, title: string) => {
    if (file) {
      setThumbnailUploading(true);
      const name = title.replace(/\s+/g, "-");
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", name);
      formData.append("fileType", "thumbnail");
      formData.append("dir", appConstant.thumbnailCdnPath);

      videoLesson.video?.thumbnail && formData.append("existingFilePath", videoLesson.video.thumbnail);

      formData.append("providerVideoId", String(videoLesson.video?.providerVideoId));
      formData.append("videoId", String(videoLesson.video?.id));

      const postRes = await postWithFile(formData, `/api/v1/upload/file/upload`);
      if (!postRes.ok) {
        setThumbnailUploading(false);
        messageApi.error(`Failed to upload the thumbnail`);
      }
      const res = await postRes.json();

      if (res.success) {
        messageApi.success(res.message);
        res.fileCDNPath &&
          setVideoLesson({
            ...videoLesson,
            video: {
              ...videoLesson.video,
              thumbnail: String(res.fileCDNPath),
              state: res.videoState ? res.videoState : videoLesson.video?.state,
            },
          } as IVideoLesson);

        setThumbnailUploading(false);
      }
    }
  };

  return (
    <>
      {contextHolder}

      <Drawer
        classNames={{ header: styles.headerWrapper, body: styles.body, footer: styles.footer }}
        width={400}
        maskClosable={false}
        closeIcon={true}
        onClose={() => {
          if (resourceVideoUploading) {
            message.info(`Wait for the video to completely upload`);
          } else {
            currResId && !isEdit && onDeleteResource(currResId, true);
            setResourceDrawer(false);
            form.resetFields();
            onRefresh();
          }
        }}
        className={styles.newResDetails}
        title={isEdit ? `Update ${contentType} Details` : `New ${contentType} Details`}
        placement="right"
        open={showResourceDrawer}
        footer={
          <Space>
            <Button
              loading={loading}
              type="primary"
              onClick={() => form.submit()}
              disabled={
                (resourceVideoUploading && contentType && contentType === $Enums.ResourceContentType.Video) ||
                (!videoLesson.video && contentType && contentType === $Enums.ResourceContentType.Video)
              }
            >
              {isEdit ? "Update" : "Save Lesson"}
            </Button>
            <Button
              type="default"
              loading={loading}
              onClick={() => {
                if (resourceVideoUploading) {
                  message.info(`Wait for the video to completely upload`);
                } else {
                  setResourceDrawer(false);
                  currResId && !isEdit && onDeleteResource(currResId, true);
                  form.resetFields();
                }
              }}
            >
              Cancel
            </Button>
          </Space>
        }
      >
        <div className={styles.drawerContainer}>
          <Form
            form={form}
            layout="vertical"
            onFinish={() => {
              currResId && onUpdateVideoLesson();
            }}
          >
            <div className={styles.formCourseName}>
              <ConfigFormItem
                layout="vertical"
                input={
                  <Form.Item name="name" rules={[{ required: true, message: "Video title is required" }]}>
                    <Input
                      onChange={(e) => {
                        setVideoLesson({ ...videoLesson, title: e.currentTarget.value });
                      }}
                      value={form.getFieldsValue().name}
                      placeholder="Set the title of the video"
                    />
                  </Form.Item>
                }
                title={"Title"}
                description={"Provide the title of the video"}
                divider={true}
              />

              <ConfigFormItem
                layout="vertical"
                input={
                  <Form.Item
                    name={"description"}
                    rules={[{ required: true, message: "Description about the video lesson required" }]}
                  >
                    <Input.TextArea
                      onChange={(e) => {
                        setVideoLesson({ ...videoLesson, description: e.currentTarget.value });
                      }}
                      rows={4}
                      value={form.getFieldsValue().description}
                      placeholder="Brief description about the video"
                    />
                  </Form.Item>
                }
                title={"Description"}
                description={"Provide a brief description about the video"}
                divider={true}
              />

              <div>
                <div style={{ position: "relative" }}>
                  <Form.Item
                    name="videoUrl"
                    label="Upload Video"
                    rules={[{ required: true, message: "Please upload video" }]}
                  >
                    <Upload
                      name="avatar"
                      disabled={
                        resourceVideoUploading ||
                        videoLesson?.video?.state == VideoState.PROCESSING ||
                        thumbnailUploading
                      }
                      listType="picture-card"
                      className={"resource_video_uploader"}
                      showUploadList={false}
                      beforeUpload={(file) => {
                        currResId && onUploadVideo(file, currResId);
                      }}
                    >
                      {videoLesson?.video?.state == VideoState.READY && !resourceVideoUploading && (
                        <Tooltip title="Upload new lesson video">
                          <img
                            src={videoLesson?.video?.thumbnail}
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
                      {(videoLesson?.video?.state == VideoState.PROCESSING || resourceVideoUploading) && (
                        <div
                          style={{ height: 50, width: 80 }}
                          className={`${styles.video_status} ${styles.video_status_loading}`}
                        >
                          {!resourceVideoUploading && videoLesson?.video?.state == VideoState.PROCESSING ? (
                            <LoadingOutlined />
                          ) : (
                            <Progress type="circle" percent={uploadedChunkPercentage} size={20} />
                          )}
                          <span>{resourceVideoUploading ? "Uploading" : "Processing"}</span>
                        </div>
                      )}
                      {!videoLesson?.video?.state && !resourceVideoUploading && (
                        <div
                          style={{ height: 50, width: 150 }}
                          className={`${styles.video_status} ${styles.video_status_loading}`}
                        >
                          <i style={{ display: "block" }}>{SvgIcons.video}</i>
                          <span>Upload Video</span>
                        </div>
                      )}
                    </Upload>
                  </Form.Item>

                  {!resourceVideoUploading && (
                    <div className={styles.actionDropdown}>
                      <ImgCrop
                        fillColor={"transparent"}
                        rotationSlider
                        aspect={16 / 8}
                        onModalOk={(file) => {
                          !preventThumbnailUpload && uploadFile(file, form.getFieldsValue().name);
                        }}
                        beforeCrop={(file) => {
                          const maxFileSize = 500; // 500 KB in bytes
                          if (Number(file.size) / 1024 > maxFileSize) {
                            messageApi.error("File size exceeds  500 KB");

                            setPreventThumbnailUpload(true);
                            return false;
                          }
                          setPreventThumbnailUpload(false);
                          return true;
                        }}
                      >
                        <Upload
                          name="avatar"
                          className={styles.upload__thumbnail}
                          showUploadList={false}
                          style={{ width: 800, height: 400 }}
                        >
                          {thumbnailUploading ? (
                            <Tooltip open={true} title={"Uploading"}>
                              <LoadingOutlined />
                            </Tooltip>
                          ) : (
                            <Tooltip title={"Upload Thumbnail"}>
                              {hoverCamera ? (
                                <i onMouseOver={() => setHoverCamera(true)} onMouseLeave={() => setHoverCamera(false)}>
                                  {" "}
                                  {SvgIcons.camera}
                                </i>
                              ) : (
                                <i onMouseOver={() => setHoverCamera(true)} onMouseLeave={() => setHoverCamera(false)}>
                                  {" "}
                                  {SvgIcons.cameraOutlined}
                                </i>
                              )}
                            </Tooltip>
                          )}
                        </Upload>
                      </ImgCrop>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Form>
        </div>
      </Drawer>
    </>
  );
};

export default AddVideoLesson;
