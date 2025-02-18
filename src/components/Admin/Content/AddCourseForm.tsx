import React, { FC, useEffect, useState } from "react";
import Link from "next/link";
import Setting from "./Setting";
import styles from "@/styles/Dashboard.module.scss";
import { Divider, Dropdown, Form, Tabs, TabsProps, message } from "antd";
import SvgIcons from "@/components/SvgIcons";
import Curriculum from "./Curriculum";
import { useRouter } from "next/router";
import Preview from "./Preview";
import ProgramService from "@/services/ProgramService";
import { CourseData, ICourseDetailView, IVideoLesson, VideoAPIResponse, VideoInfo } from "@/types/courses/Course";
import AddCourseChapter from "@/components/Admin/Content/AddCourseChapter";
import { $Enums, ResourceContentType, StateType, VideoState } from "@prisma/client";
import { ResourceDetails } from "@/lib/types/program";
import { RcFile } from "antd/es/upload";
import { postWithFile } from "@/services/request";

import AddLesson from "./AddLesson";
import { PageSiteConfig } from "@/services/siteConstant";
import { getBase64 } from "@/lib/utils";
import { AssignmentType } from "@/types/courses/assignment";

const AddCourseForm: FC<{ siteConfig: PageSiteConfig }> = ({ siteConfig }) => {
  const [courseTrailerUploading, setCourseTrailerUploading] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [resourceContentType, setContentType] = useState<ResourceContentType>();
  const [refresh, setRefresh] = useState<boolean>(false);
  const [activeKey, setActiveKey] = useState<string>("1");
  const [isEdit, setEdit] = useState<boolean>(false);
  const [isChapterEdit, setChapterEdit] = useState<boolean>(false);
  const [currResId, setResId] = useState<number>();
  const [selectedChapterId, setSelectedChapterId] = useState<number>();
  const [loading, setLoading] = useState<boolean>(false);
  const [tabActive, setTabActive] = useState<boolean>(false);
  const [chapterForm] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [videoForm] = Form.useForm();
  const [settingloading, setSettingloading] = useState<boolean>(false);
  const [checkVideoState, setCheckVideoState] = useState<boolean>(false);
  const [file, setFile] = useState<File>();

  const [selectedCourseType, setSelectedCourseType] = useState<{
    free: boolean;
    paid: boolean;
  }>({
    free: false,
    paid: false,
  });

  const selectCourseType = (courseType: $Enums.CourseType) => {
    courseType === $Enums.CourseType.FREE
      ? setSelectedCourseType({ paid: false, free: true })
      : setSelectedCourseType({ paid: true, free: false });
    onSetCourseData("courseType", courseType);
  };

  const [showResourceDrawer, setResourceDrawer] = useState<boolean>(false);
  const onRefresh = () => {
    setRefresh(!refresh);
    setResId(0);
  };

  const onChange = (key: string) => {
    if (key === "3") {
      onRefresh();
      router.replace(`/academy/course/${router.query.id}/edit`);
      setActiveKey("3");
    }
    setActiveKey(key);
  };

  const [videoLesson, setVideoLesson] = useState<IVideoLesson>({
    title: "Untitled",
    description: "Description about the lesson",
  });

  const router = useRouter();

  const [newTrailerThumbnail, setNewTrailerThumbnail] = useState<string>();

  const [uploadVideo, setUploadVideo] = useState<VideoInfo>();
  const [assignmentType, setAssignmentType] = useState<AssignmentType>(AssignmentType.MCQ);

  const [courseDetails, setCourseDetails] = useState<ICourseDetailView>();

  const [courseData, setCourseData] = useState<CourseData>({
    name: "",
    description: "",
    expiryInDays: 365,
    chapters: [],
    currency: "",
    thumbnail: "",
    courseType: $Enums.CourseType.FREE,
  });

  const onDiscard = () => {
    ProgramService.deleteCourse(
      Number(router.query.id),
      (result) => {
        messageApi.success(result.message);
        router.push(`/courses`);
      },
      (error) => {
        messageApi.error(error);
      }
    );
  };

  const updateCourseData = () => {
    ProgramService.getCourseDetails(
      Number(router.query.id),
      (result) => {
        setCourseData({
          ...courseData,
          expiryInDays: result.courseDetails.expiryInDays,
          name: result.courseDetails.name,
          description: result.courseDetails.description,
          chapters: result.courseDetails.chapters,
          difficultyLevel: result.courseDetails.difficultyLevel,
          state: result?.courseDetails.state,
          coursePrice: result.courseDetails.coursePrice,
          thumbnail: result.courseDetails.thumbnail,
          courseType: result.courseDetails.courseType,
        });
      },
      (err) => {
        message.error(err);
      }
    );
  };

  const onSubmit = () => {
    let courseName = form.getFieldsValue().course_name || courseData?.name;

    if (!courseName || courseName == "Untitled") {
      messageApi.error("Course name is missing");
      return;
    }
    setSettingloading(true);

    let course = {
      name: courseName,
      expiryInDays: Number(courseData?.expiryInDays),
      description: form.getFieldsValue().course_description || courseData.description,
      courseId: Number(router.query.id),
      difficultyLevel: courseData.difficultyLevel,
      certificateTemplate: courseData.certificateTemplate,
      previewMode: form.getFieldsValue().previewMode ? form.getFieldsValue().previewMode : false,
      courseType: Number(courseData.coursePrice) == 0 ? $Enums.CourseType.FREE : $Enums.CourseType.PAID,
      coursePrice: Number(courseData.coursePrice),
      thumbnail: courseData.thumbnail,
    };

    const courseFormData = new FormData();
    file && courseFormData.append("file", file);
    courseFormData.append("course", JSON.stringify(course));

    ProgramService.updateCourse(
      courseFormData,
      (result) => {
        setActiveKey("2");
        form.resetFields();
        setRefresh(!refresh);
        setTabActive(true);
        messageApi.success(result.message);
        setCourseDetails(result.body);
        setSettingloading(false);
      },
      (error) => {
        messageApi.error(error);
        setSettingloading(false);
      }
    );
  };

  const onSetCourseData = (key: string, value: string) => {
    setCourseData({ ...courseData, [key]: value });
  };

  let currentSeqIds = courseData.chapters.map((c) => {
    return c.sequenceId;
  });

  const showChapterDrawer = (value: boolean) => {
    setOpen(value);
  };

  const onDeleteResource = (id: number, isCanceled: boolean) => {
    ProgramService.deleteResource(
      id,
      Number(router.query.id),
      (result) => {
        !isCanceled && messageApi.success(result.message);
        onRefresh();
        updateCourseData();
      },
      (error) => {
        messageApi.error(error);
      }
    );
  };

  const handleNewChapter = () => {
    setChapterEdit(false);
    setOpen(true);
  };

  const handleChapterEdit = async (chapterId: number) => {
    setSelectedChapterId(chapterId);
    ProgramService.getChapter(
      chapterId,
      (result) => {
        chapterForm.setFieldValue("name", result.chapter.name);
        chapterForm.setFieldValue("description", result.chapter.description);
        showChapterDrawer(true);
        setChapterEdit(true);
      },
      (error) => {
        messageApi.error(error);
      }
    );
  };

  const onAddResource = (chapterId: number, content: ResourceContentType, assignType?: AssignmentType) => {
    setEdit(false);
    ProgramService.createResource(
      {
        chapterId: chapterId,
        name: "",
        description: "",
        contentType: content,
      } as ResourceDetails,
      (result) => {
        if (content == ResourceContentType.Video) {
          setVideoLesson({ ...videoLesson, chapterId: chapterId, video: undefined });
        } else if (content == ResourceContentType.Assignment) {
          setAssignmentType(assignType as AssignmentType);
        }

        setResId(result.resource.resourceId);
        setLoading(false);
        !showResourceDrawer && setResourceDrawer(true);
        setContentType(content);

        //update the state for course detail
        updateCourseData();
      },
      (error) => {
        messageApi.error(error);
      }
    );
  };

  const onUploadTrailer = async (file: RcFile, title: string) => {
    setCourseTrailerUploading(true);

    const chunkSize = 2 * 1024 * 1024; // 1MB chunks (adjust as needed)
    const totalChunks = Math.ceil(file.size / chunkSize);
    let start = 0;
    let end = chunkSize;
    const name = title.replace(/\s+/g, "-");

    let courseIdStr = router.query.id?.toString();

    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      const chunk = file.slice(start, end);
      const formData = new FormData();
      formData.append("file", chunk, file.name);
      formData.append("chunkIndex", String(chunkIndex));
      formData.append("totalChunks", String(totalChunks));
      formData.append("title", name);
      formData.append("objectId", courseIdStr || "");
      formData.append("objectType", "course");
      const postRes = await postWithFile(formData, `/api/v1/upload/video/upload`);

      start = end;
      end = start + chunkSize;
      if (!postRes.ok) {
        setLoading(false);
        const response = (await postRes.json()) as VideoAPIResponse;

        messageApi.error(response.message);

        setCourseTrailerUploading(false);
      } else {
        const res = (await postRes.json()) as VideoAPIResponse;

        if (res.success) {
          setUploadVideo({
            ...uploadVideo,
            videoId: res.video.videoId,
            videoUrl: res.video.videoUrl,
            thumbnail: res.video.thumbnail,
            previewUrl: res.video.previewUrl,
            videoDuration: res.video.videoDuration,
            state: res.video.state,
            mediaProviderName: res.video.mediaProviderName,
          });
          messageApi.success("Course trailer video has been uploaded");
          setCourseTrailerUploading(false);
          setCheckVideoState(true);
        }
      }
    }
  };

  const uploadTeaserThumbnail = async (file: any) => {
    if (file) {
      const base64 = await getBase64(file);
      setNewTrailerThumbnail(base64 as string);
      setFile(file);
    }
  };

  const onEditResource = (id: number, content: ResourceContentType) => {
    setResId(id);
    setContentType(content);
    ProgramService.getResource(
      id,
      (result) => {
        videoForm.setFieldValue("name", result.resource?.name);
        videoForm.setFieldValue("description", result.resource?.description);
        videoForm.setFieldValue("videoUrl", result.resource?.video?.videoUrl);
        setVideoLesson({ ...videoLesson, chapterId: result.resource.chapterId, video: result.resource.video });

        setResourceDrawer(true);
        setEdit(true);
      },
      (error) => {
        messageApi.error(error);
      }
    );
  };

  const onPublishCourse = (state: StateType) => {
    const courseActiveLessons = courseData.chapters
      .flatMap((c) => c.resource)
      .filter((lesson) => lesson.state == StateType.ACTIVE);

    if (state == StateType.DRAFT) {
      ProgramService.updateCourseState(
        Number(router.query.id),
        state,
        (result) => {
          message.success(`Your course has been saved as draft`);
        },
        (error) => {
          message.error(error);
        }
      );
    } else if (courseActiveLessons && state == StateType.ACTIVE && courseActiveLessons.length >= 2) {
      ProgramService.updateCourseState(
        Number(router.query.id),
        state,
        (result) => {
          message.success(`Your course has been successfully published.`);
          router.push(`/courses/${result.course.slug}`);
        },
        (error) => {
          message.error(error);
        }
      );
    } else if (courseActiveLessons && state == StateType.ACTIVE && courseActiveLessons.length < 2) {
      message.error("Minimum two published lessons are required to publish the course");
    }
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Settings",
      children: (
        <Setting
          onSetCourseData={onSetCourseData}
          form={form}
          onSubmit={onSubmit}
          onDiscard={onDiscard}
          courseData={courseData}
          onUploadTrailer={onUploadTrailer}
          uploadTeaserThumbnail={uploadTeaserThumbnail}
          uploadVideo={uploadVideo}
          courseTrailerUploading={courseTrailerUploading}
          trailerThumbnail={newTrailerThumbnail}
          settingLoading={settingloading}
        />
      ),
    },
    {
      key: "2",
      label: (
        <span onClick={() => !tabActive && message.error("First fill and  save  the add course form ")}>
          Curriculum
        </span>
      ),
      disabled: !uploadVideo?.videoUrl || !tabActive,

      children: uploadVideo?.videoUrl && (
        <Curriculum
          chapters={courseData.chapters}
          siteConfig={siteConfig}
          onRefresh={onRefresh}
          handleNewChapter={handleNewChapter}
          onAddResource={onAddResource}
          handleEditChapter={handleChapterEdit}
          deleteRes={onDeleteResource}
          onEditResource={onEditResource}
          onSave={onChange}
          onDiscard={onDiscard}
        />
      ),
    },

    {
      key: "3",
      label: (
        <span onClick={() => !tabActive && message.error("First fill and  save  the add course form ")}>Preview</span>
      ),
      disabled: !uploadVideo?.videoUrl || !tabActive,
      children: uploadVideo?.videoUrl && courseDetails && (
        <Preview
          courseDetail={courseDetails}
          previewMode={true}
          handlePurchase={() => {}}
          handleLessonRedirection={() => {}}
        />
      ),
    },
  ];

  const updateCourseDetailedView = () => {
    ProgramService.fetchCourseDetailedView(
      Number(router.query.id),
      (result) => {
        setCourseDetails(result.body);
      },
      (err) => message.error(err)
    );
  };

  useEffect(() => {
    updateCourseDetailedView();
  }, [activeKey]);

  useEffect(() => {
    let intervalId: NodeJS.Timer | undefined;
    if (
      checkVideoState &&
      uploadVideo &&
      uploadVideo.state == VideoState.PROCESSING &&
      typeof intervalId === "undefined"
    ) {
      intervalId = setInterval(() => {
        ProgramService.getCourseDetails(
          Number(router.query.id),
          (result) => {
            setUploadVideo({
              ...uploadVideo,
              previewUrl: "",
              thumbnail: result.courseDetails.tvThumbnail,
              videoId: result.courseDetails.tvProviderId,
              videoUrl: result.courseDetails.tvUrl,
              videoDuration: result.courseDetails.durationInMonths,
              state: result.courseDetails.tvState,
              mediaProviderName: "",
            });
            setCheckVideoState(result.courseDetails.tvState == VideoState.PROCESSING);
          },
          (error) => {
            messageApi.error(error);
          }
        );
      }, 1000 * 5); // in milliseconds
    }
    if (intervalId && uploadVideo && uploadVideo.state == VideoState.READY) {
      clearInterval(Number(intervalId));
    }
    return () => intervalId && clearInterval(Number(intervalId));
  }, [checkVideoState]);

  useEffect(() => {
    setSettingloading(true);

    router.query.id &&
      ProgramService.getCourseDetails(
        Number(router.query.id),
        (result) => {
          setUploadVideo({
            ...uploadVideo,
            previewUrl: "",
            thumbnail: result.courseDetails.tvThumbnail,
            videoId: result.courseDetails.tvProviderId,
            videoUrl: result.courseDetails.tvUrl,
            videoDuration: result.courseDetails.durationInMonths,
            state: result.courseDetails.tvState,
            mediaProviderName: "",
          });
          setCheckVideoState(result.courseDetails.tvState == VideoState.PROCESSING);
          form.setFieldValue("course_name", result.courseDetails.name);
          form.setFieldValue("course_description", result.courseDetails.description);
          form.setFieldValue("course_duration", result.courseDetails.expiryInDays);
          form.setFieldValue("course_difficulty", result.courseDetails.difficultyLevel);
          form.setFieldValue("certificate_template", result.courseDetails.certificateTemplate);
          form.setFieldValue("previewMode", result.courseDetails.previewMode);
          form.setFieldValue("coursePrice", result.courseDetails.coursePrice);
          if (result.courseDetails.chapters.length > 0 || result.courseDetails.tvUrl) {
            setTabActive(true);
          }
          selectCourseType(result.courseDetails.courseType as $Enums.CourseType);
          setCourseData({
            ...courseData,
            expiryInDays: result.courseDetails.expiryInDays,
            name: result.courseDetails.name,
            description: result.courseDetails.description,
            chapters: result.courseDetails.chapters,
            difficultyLevel: result.courseDetails.difficultyLevel,
            state: result?.courseDetails.state,
            coursePrice: result.courseDetails.coursePrice,
            currency: result.currency,
            thumbnail: result.courseDetails.thumbnail,
            courseType: result.courseDetails.courseType,
          });

          setSettingloading(false);
        },
        (error) => {
          messageApi.error(error);
          setSettingloading(false);
        }
      );
  }, [router.query.id, refresh]);
  return (
    <>
      {contextHolder}
      <section className={styles.add_course_page}>
        <div className={styles.add_course_header}>
          <div className={styles.left_icon}>
            <Link href="/academy">{SvgIcons.xMark}</Link>
            <Divider type="vertical" style={{ height: "1.2rem" }} />
            <h4>Edit Course</h4>
          </div>
          <div>
            <Dropdown.Button
              type="default"
              onClick={() => {
                courseData.state === StateType.DRAFT
                  ? onPublishCourse(StateType.ACTIVE)
                  : onPublishCourse(StateType.DRAFT);
              }}
              icon={SvgIcons.chevronDown}
              menu={{
                items: [
                  {
                    key: 1,
                    label: courseData.state === StateType.DRAFT ? "Save and exit" : "Publish Course",
                    onClick: () => {
                      router.push("/academy");
                    },
                  },
                ],
              }}
            >
              {courseData.state === StateType.DRAFT ? "  Publish Course" : "Save as Draft"}
            </Dropdown.Button>
          </div>
        </div>
        <div className={styles.add_course_tabs}>
          <Tabs tabBarGutter={40} activeKey={activeKey} items={items} onChange={onChange} />
        </div>
      </section>
      <AddCourseChapter
        courseId={Number(router.query.id)}
        onRefresh={onRefresh}
        currentSeqIds={currentSeqIds}
        showChapterDrawer={showChapterDrawer}
        loading={loading}
        form={chapterForm}
        chapterLength={courseData.chapters.length}
        open={open}
        chapterId={selectedChapterId}
        edit={isChapterEdit}
        setEdit={setChapterEdit}
      />

      {typeof currResId !== "undefined" && (
        <AddLesson
          showResourceDrawer={showResourceDrawer}
          setVideoLesson={setVideoLesson}
          videoLesson={videoLesson}
          onRefresh={onRefresh}
          setResourceDrawer={setResourceDrawer}
          contentType={resourceContentType as ResourceContentType}
          currResId={currResId}
          onDeleteResource={onDeleteResource}
          form={videoForm}
          isEdit={isEdit}
          setCheckVideoState={setCheckVideoState}
          setEdit={setEdit}
          assignmentType={assignmentType}
        />
      )}
    </>
  );
};

export default AddCourseForm;
