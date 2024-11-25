import { Button, Collapse, Flex, Skeleton, Space, Spin, Tabs, TabsProps, Tag, message } from "antd";

import styles from "@/styles/LearnCourses.module.scss";
import { FC, ReactNode, useEffect, useState } from "react";
import SvgIcons from "../SvgIcons";
import { useRouter } from "next/router";
import ProgramService from "@/services/ProgramService";
import { ChapterDetail } from "@/types/courses/Course";
import { IResourceDetail } from "@/lib/types/learn";

import Link from "next/link";

import { useSession } from "next-auth/react";
import { IResponse, getFetch, postFetch } from "@/services/request";
import appConstant from "@/services/appConstant";
import { convertSecToHourandMin } from "@/pages/admin/content";
import QADiscssionTab from "./AboutCourse/CourseDiscussion/CourseDiscussion";
import SpinLoader from "../SpinLoader/SpinLoader";
import AppLayout from "../Layouts/AppLayout";

const Label: FC<{
  title: string;
  time: string;
  keyValue: string;
  selectedLesson: IResourceDetail | undefined;
  onSelectResource: (resourceId: number) => void;
  setChapterId: (value: number) => void;
  resourceId: number;
  loading: boolean;
  chapterId: number;
  refresh: boolean;
  currentLessonId?: number;
  icon: ReactNode;
}> = ({
  title,
  time,
  onSelectResource,
  loading,
  refresh,
  selectedLesson,
  setChapterId,
  currentLessonId,
  keyValue,
  icon,
  resourceId,
  chapterId,
}) => {
  const [completed, setCompleted] = useState<boolean>();
  const [checkLockLoading, setCheckLockLoading] = useState<boolean>();

  const checkIsCompleted = async () => {
    setCheckLockLoading(true);
    const res = await getFetch(`/api/progress/get/${resourceId}/checkStatus`);
    const result = (await res.json()) as IResponse;

    if (res.ok && result.success) {
      setCompleted(result.isCompleted);
    }
    setCheckLockLoading(false);
  };
  useEffect(() => {
    checkIsCompleted();
  }, [refresh]);
  return (
    <>
      {loading ? (
        <Skeleton.Button />
      ) : (
        <div
          style={{
            padding: resourceId > 0 ? "5px 0px" : 0,
            paddingLeft: resourceId > 0 ? "20px" : 0,
          }}
          className={`${selectedLesson && resourceId === selectedLesson.resourceId && styles.selectedLable} ${
            resourceId > 0 ? styles.lessonLabelContainer : styles.labelContainer
          }`}
          onClick={() => {
            onSelectResource(resourceId);
          }}
        >
          <Flex justify="space-between" align="center">
            <div className={styles.title_container}>
              <Flex gap={10} align="center" onClick={() => setChapterId(chapterId)}>
                {completed ? SvgIcons.check : icon}
                <div style={{ cursor: "pointer" }}>{title}</div>
              </Flex>
            </div>
            <div className={styles.timeContainer}>
              <Tag className={styles.time_tag}>{time}</Tag>
            </div>
          </Flex>
          <div className={styles.selected_bar}></div>
        </div>
      )}
    </>
  );
};

const LearnCourse: FC<{}> = () => {
  const [messageApi, contextMessageHolder] = message.useMessage();

  const [courseData, setCourseData] = useState<{
    name: string;
    description: string;
    expiryInDays: number;
    authorName: string;
    chapters: ChapterDetail[];
    certificateId: string;
  }>({
    name: "",
    description: "",
    expiryInDays: 365,
    authorName: "",
    chapters: [],
    certificateId: "",
  });

  const [selectedLesson, setSelectedLesson] = useState<IResourceDetail>();

  const [chapterId, setChapterId] = useState<number>();
  const [currentLessonId, serCurrentLessonId] = useState<number>();

  const [loading, setLoading] = useState<boolean>(false);

  const [loadingLesson, setLessonLoading] = useState<boolean>(false);
  const [certificateLoading, setcertificateLoading] = useState<boolean>(false);

  const { data: session } = useSession();

  const router = useRouter();

  const [isCompleted, setCompleted] = useState<boolean>();
  const [isCourseCompleted, setCourseCompleted] = useState<boolean>();

  const [loadingBtn, setLoadingBtn] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);

  const checkIsCompleted = async (resourceId: number) => {
    setLoadingBtn(true);
    const res = await getFetch(`/api/progress/get/${resourceId}/checkStatus`);
    const result = (await res.json()) as IResponse;

    if (res.ok && result.success) {
      setCompleted(result.isCompleted);
    }
    ProgramService.getProgress(
      Number(router.query.courseId),

      (result) => {
        serCurrentLessonId(result.latestProgress.nextLesson?.resourceId);
      },
      (error) => {}
    );
    setLoadingBtn(false);

    return result.isCompleted;
  };

  useEffect(() => {
    if (selectedLesson?.resourceId) {
      checkIsCompleted(selectedLesson?.resourceId);
    }
  }, [selectedLesson, refresh]);

  const onMarkAsCompleted = async () => {
    try {
      if (isCompleted) return;

      const res = await postFetch(
        {
          chapterId: selectedLesson?.chapterId,
          courseId: Number(router.query.courseId),
          sequenceId: selectedLesson?.sequenceId,
          resourceId: selectedLesson?.resourceId,
        },
        `/api/progress/create`
      );
      const result = (await res.json()) as IResponse;
      if (res.ok && result.success) {
        messageApi.success(result.message);
        setRefresh(!refresh);
        getProgressDetail();
        ProgramService.getProgress(
          Number(router.query.courseId),
          async (result) => {
            setCourseCompleted(result.latestProgress.completed);

            if (result.latestProgress.completed) {
              setcertificateLoading(true);

              setcertificateLoading(false);
            }
          },
          (error) => {}
        );
      } else {
        messageApi.error(result.error);
      }
    } catch (err) {
      messageApi.error(appConstant.cmnErrorMsg);
    }
  };
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "About",
      children: selectedLesson?.description,
    },
    {
      key: "discussions",
      label: "Discussions",

      children: session && selectedLesson && (
        <QADiscssionTab loading={loading} resourceId={selectedLesson?.resourceId} userId={session?.id} />
      ),
    },
  ];

  const selectResource = (resourceId: number) => {
    setSelectedLesson(
      courseData.chapters
        .find((chapter) => chapter.chapterId === chapterId)
        ?.resource.find((data) => data.resourceId === resourceId)
    );
  };

  const onSelectResource = async (resourceId: number) => {
    const isCompleted = await checkIsCompleted(resourceId);

    if (selectedLesson?.resourceId === resourceId) {
      setLessonLoading(true);

      selectResource(resourceId);
      setLessonLoading(false);
    } else {
      if (isCompleted) {
        setLessonLoading(true);

        selectResource(resourceId);
        setLessonLoading(false);
      } else if (!isCompleted) {
        getProgressDetail();

        currentLessonId !== resourceId && messageApi.error("First complete the previous lessons");
        // getProgressDetail();
      }
    }
    setLessonLoading(false);
  };

  const lessonItems = courseData.chapters?.map((content, i) => {
    let totalTime = 0;
    content.resource.forEach((data) => {
      totalTime = totalTime + data.video?.videoDuration;
    });
    const duration = convertSecToHourandMin(totalTime);
    return {
      key: `${content.chapterId}`,
      label: (
        <Label
          title={content.name}
          icon={SvgIcons.folder}
          time={duration}
          onSelectResource={() => {}}
          loading={loading}
          resourceId={0}
          chapterId={content.chapterId}
          setChapterId={setChapterId}
          selectedLesson={undefined}
          keyValue={`${content.chapterId}`}
          refresh={refresh}
        />
      ),
      children: content.resource
        .filter((r) => r.state === "ACTIVE")
        .map((res: IResourceDetail, i: any) => {
          return (
            <div className={styles.resContainer}>
              <Label
                title={res.name}
                icon={res.contentType === "Video" ? SvgIcons.playBtn : SvgIcons.file}
                time={convertSecToHourandMin(res.video?.videoDuration)}
                onSelectResource={onSelectResource}
                resourceId={res.resourceId}
                setChapterId={() => {}}
                selectedLesson={selectedLesson}
                currentLessonId={currentLessonId}
                loading={loading}
                chapterId={0}
                keyValue={`${i + 1}`}
                refresh={refresh}
              />
            </div>
          );
        }),
      showArrow: false,
    };
  });

  const getProgressDetail = () => {
    ProgramService.getProgress(
      Number(router.query.courseId),
      (result) => {
        setSelectedLesson(result.latestProgress.nextLesson);
        setChapterId(result.latestProgress.nextLesson?.chapterId);
        serCurrentLessonId(result.latestProgress.nextLesson?.resourceId);
        setRefresh(!refresh);
      },
      (error) => {}
    );
  };

  const onViewCertificate = () => {
    ProgramService.getCertificateByCourseId(
      Number(router.query.courseId),
      (result) => {
        const id = String(result?.certificateId);
        router.push(`/courses/${router.query.courseId}/certificate/${id}`);
      },
      (error) => {}
    );
  };

  useEffect(() => {
    setLoading(true);
    router.query.courseId &&
      ProgramService.getCourseDetails(
        Number(router.query.courseId),
        (result) => {
          if (result.courseDetails?.chapters.filter((c) => c.state === "ACTIVE").length === 0) {
            router.push("/courses");
          }

          setCourseData({
            ...courseData,
            name: result.courseDetails?.name,
            expiryInDays: result.courseDetails?.expiryInDays,
            chapters: result.courseDetails?.chapters.filter((c) => c.state === "ACTIVE"),
            authorName: result.courseDetails.user.name,
            certificateId: result.courseDetails.certificateTemplate,
          });
          getProgressDetail();

          setLoading(false);
        },
        (error) => {
          setLoading(false);
        }
      );
  }, [router.query.courseId]);
  return (
    <AppLayout>
      {contextMessageHolder}
      {!loading ? (
        <section className={styles.learn_course_page}>
          <div className={styles.learn_breadcrumb}>
            <Flex style={{ fontSize: 20 }}>
              <Link href={"/courses"}>Courses</Link> <div style={{ marginTop: 3 }}>{SvgIcons.chevronRight} </div>{" "}
              <Link href={`/courses/${router.query.courseId}`}> {courseData.name}</Link>
              <div style={{ marginTop: 3 }}>{SvgIcons.chevronRight} </div> Play
            </Flex>
          </div>

          <Flex align="start" justify="space-between">
            <div className={styles.lessons_video_player_wrapper}>
              <div className={styles.video_container}>
                {selectedLesson?.video?.videoUrl && !loadingLesson ? (
                  <>
                    {isCourseCompleted ? (
                      <div
                        className={styles.video_completed_screen}
                        style={{
                          position: "absolute",
                          width: 800,
                          height: 450,
                          outline: "none",
                          border: "none",
                        }}
                      >
                        <div>Congratulations! You have successfully completed the course</div>
                        <Space>
                          <Button loading={certificateLoading} onClick={() => onViewCertificate()}>
                            View Certificate
                          </Button>
                        </Space>
                      </div>
                    ) : (
                      <iframe
                        allowFullScreen
                        style={{
                          position: "absolute",

                          width: 800,
                          height: 450,
                          outline: "none",
                          border: "none",
                        }}
                        src={selectedLesson.video.videoUrl}
                      ></iframe>
                    )}
                  </>
                ) : (
                  <Skeleton.Image
                    style={{
                      position: "absolute",
                      width: 800,
                      height: 450,
                      top: 0,
                    }}
                  />
                )}
              </div>

              <Tabs
                style={{
                  padding: "0px 20px 10px",
                  maxWidth: "800px",
                }}
                tabBarExtraContent={
                  <>
                    {!loadingBtn && isCompleted !== undefined ? (
                      <>
                        {isCompleted && (
                          <Button>
                            <Flex gap={5}>{SvgIcons.check} Completed </Flex>
                          </Button>
                        )}
                        {!isCompleted && (
                          <Button loading={loadingBtn} type="primary" onClick={onMarkAsCompleted}>
                            Mark as Completed
                          </Button>
                        )}
                      </>
                    ) : (
                      <Skeleton.Button />
                    )}
                  </>
                }
                tabBarGutter={40}
                className={styles.add_course_tabs}
                items={items}
              />
            </div>
            <div className={styles.lessons_container}>
              {lessonItems?.map((item, i) => {
                return (
                  <div key={i} className={styles.lessons_list_wrapper}>
                    <Collapse
                      defaultActiveKey={"1"}
                      size="small"
                      accordion={false}
                      activeKey={chapterId}
                      items={[
                        {
                          key: item.key,
                          label: item.label,
                          children: item.children,
                          showArrow: false,
                        },
                      ]}
                    />
                  </div>
                );
              })}
            </div>
          </Flex>
        </section>
      ) : (
        <SpinLoader />
      )}
    </AppLayout>
  );
};

export default LearnCourse;
