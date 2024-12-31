import SpinLoader from "@/components/SpinLoader/SpinLoader";
import SvgIcons from "@/components/SvgIcons";

import { convertSecToHourandMin } from "@/pages/admin/content";
import ProgramService from "@/services/ProgramService";
import styles from "@/styles/Preview.module.scss";
import { CourseLessonAPIResponse, ICourseDetailView, VideoLesson } from "@/types/courses/Course";
import { $Enums, CourseState, CourseType, orderStatus, ResourceContentType, Role } from "@prisma/client";
import { Breadcrumb, Button, Collapse, Flex, Space, Tag } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";

import { FC, ReactNode, useState } from "react";

const Label: FC<{
  title: string;
  time: string;
  keyValue: string;
  resourceId?: number;
  isCompleted?: boolean;
  icon: ReactNode;
  contentType: ResourceContentType;
}> = ({ title, time, keyValue, icon, isCompleted, resourceId, contentType }) => {
  return (
    <div className={styles.labelContainer}>
      <Flex justify="space-between" align="center">
        <div>
          <Flex gap={10} align="center">
            <i>{isCompleted ? SvgIcons.check : icon}</i>
            <div>{title}</div>
          </Flex>
        </div>
        <div>
          <Tag className={styles.time_tag}>{time}</Tag>
        </div>
      </Flex>
    </div>
  );
};

const Preview: FC<{
  courseDetail?: ICourseDetailView;
  addContentPreview?: boolean;
  videoUrl?: string;
  onEnrollCourse?: () => void;
  paymentDisable?: boolean;
  paymentStatusLoading?: boolean;
  loading?: boolean;
  paymentStatus?: orderStatus;
}> = ({
  addContentPreview,
  videoUrl,
  paymentStatusLoading,
  paymentDisable,
  onEnrollCourse,
  courseDetail,
  loading,
  paymentStatus,
}) => {
  const router = useRouter();
  let isCourseCompleted = courseDetail?.course.userStatus === CourseState.COMPLETED;
  console.log(courseDetail);

  const items = courseDetail?.lessons.map((content, i) => {
    let totalTime = 0;
    content.lessons.forEach((data) => {
      if (data && data.videoDuration) {
        totalTime = totalTime + data.videoDuration;
      } else if (data && data.estimatedDuration) {
        totalTime = totalTime + data.estimatedDuration * 60;
      }
    });
    const duration = convertSecToHourandMin(totalTime);
    return {
      key: `${i + 1}`,
      label: (
        <Label
          title={content.chapterName}
          icon={SvgIcons.folder}
          time={duration}
          keyValue={`${i + 1}`}
          contentType={$Enums.ResourceContentType.Video}
        />
      ),
      children: content.lessons.map((res: VideoLesson, i: any) => {
        if (res) {
          const duration = addContentPreview
            ? convertSecToHourandMin(res.videoDuration)
            : convertSecToHourandMin(
                res.contentType === ResourceContentType.Video ? res.videoDuration : Number(res.estimatedDuration) * 60
              );
          return (
            <div className={styles.resContainer}>
              <Label
                title={res.title}
                icon={res.contentType === $Enums.ResourceContentType.Assignment ? SvgIcons.file : SvgIcons.playBtn}
                time={duration}
                isCompleted={res.isWatched}
                resourceId={res.videoId}
                keyValue={`${i + 1}`}
                contentType={res.contentType as ResourceContentType}
              />
            </div>
          );
        }
      }),
      showArrow: false,
    };
  });
  const [activeCollapseKey, setActiveCollapseKey] = useState<string[]>(items ? items.map((item, i) => `${i + 1}`) : []);

  const onChange = (key: string | string[]) => {
    setActiveCollapseKey(key as string[]);
  };

  const onViewCertificate = () => {
    ProgramService.getCertificateByCourseId(
      Number(router.query.courseId),
      (result) => {
        const id = String(result.certificateId);
        router.push(`/courses/${router.query.slug}/certificate/${id}`);
      },
      (error) => {}
    );
  };
  return (
    <section className={addContentPreview ? styles.add_preview_container : styles.preview_container}>
      <h4>{courseDetail?.course.name}</h4>
      <p>A course by {courseDetail?.course.authorName}</p>
      <Flex align="baseline" justify="flex-start" gap={20}>
        <div>
          <div className={styles.video_container}>
            <Flex className={styles.spin_wrapper} align="center" justify="center">
              <SpinLoader className="preview_loader" />
            </Flex>
            {
              <iframe
                allowFullScreen
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  outline: "none",
                  border: "none",
                }}
                src={videoUrl}
              ></iframe>
            }
          </div>
        </div>
        <div className={styles.course__offerings}>
          {/* component for price display */}
          <div>
            {courseDetail?.course.courseType == CourseType.FREE && <h2>FREE</h2>}
            {courseDetail?.course.courseType == CourseType.PAID && (
              <Space>
                <div>{courseDetail?.course.currency}</div>
                <div>{courseDetail?.course.coursePrice}</div>
              </Space>
            )}
          </div>
        </div>
      </Flex>
      <Space direction="vertical">
        <div style={{ fontSize: 20 }} className={styles.coursehHeaderLinks}>
          {courseDetail && !addContentPreview && (
            <Breadcrumb
              items={[
                {
                  title: <a href="/courses"> Courses</a>,
                },
                {
                  title: `${courseDetail.course.name}`,
                  className: styles.courseName,
                },
              ]}
            />
          )}
        </div>

        <div className={styles.course__info}>
          <Flex vertical gap={8}>
            {courseDetail?.course.courseType === $Enums.CourseType.PAID &&
              courseDetail.course.userRole !== Role.STUDENT && (
                <Flex className={styles.coursePrice} align="center" gap={2}>
                  <i> {SvgIcons.rupees}</i>
                  {courseDetail.course.coursePrice}
                </Flex>
              )}
            {courseDetail?.course.userRole === Role.STUDENT && (
              <>
                {isCourseCompleted ? (
                  <Flex align="center" gap={10}>
                    {!courseDetail?.course.previewMode && <Button onClick={onViewCertificate}>View Certificate</Button>}
                    <Link href={`/courses/${router.query.slug}/lesson/${courseDetail?.lessons[0].lessons[0].lessonId}`}>
                      <Button type="primary">Rewatch</Button>
                    </Link>
                  </Flex>
                ) : (
                  <Button
                    loading={loading}
                    className={styles.save_btn}
                    type="primary"
                    onClick={() => {
                      !addContentPreview && onEnrollCourse && onEnrollCourse();
                    }}
                  >
                    {courseDetail && courseDetail?.course.progress > 0 ? "Resume" : "Start Course"}
                    {SvgIcons.arrowRight}
                  </Button>
                )}
              </>
            )}

            {(courseDetail?.course.userRole === Role.ADMIN || courseDetail?.course.userRole === Role.AUTHOR) && (
              <Link href={`/courses/${router.query.courseId}/lesson/${courseDetail?.lessons[0].lessons[0].lessonId}`}>
                <Button type="primary">View Course</Button>
              </Link>
            )}
            {courseDetail?.course.userRole === "NOT_ENROLLED" && (
              <>
                {courseDetail.course.courseType === CourseType.PAID ? (
                  <Button
                    loading={loading}
                    className={styles.save_btn}
                    disabled={paymentDisable}
                    type="primary"
                    onClick={() => {
                      !addContentPreview && onEnrollCourse && onEnrollCourse();
                    }}
                  >
                    {paymentDisable ? (
                      "Payment  in Progress"
                    ) : (
                      <>
                        {paymentStatus === orderStatus.PENDING ? (
                          "Complete the payment"
                        ) : (
                          <>
                            {courseDetail?.course.courseType === $Enums.CourseType.PAID && (
                              <Flex align="center" gap={10}>
                                <i className={styles.lockIcon}>{SvgIcons.lock}</i>
                                <div> Buy Course</div>
                              </Flex>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    loading={loading}
                    className={styles.save_btn}
                    type="primary"
                    onClick={() => {
                      !addContentPreview && onEnrollCourse && onEnrollCourse();
                    }}
                  >
                    <Flex align="center" gap={10}>
                      {courseDetail?.course.previewMode ? " Preview Course" : " Enroll Course"}
                      {SvgIcons.arrowRight}
                    </Flex>
                  </Button>
                )}
              </>
            )}
            {courseDetail?.course.userRole === "NA" && (
              <Link href={`/login?redirect=/course/${router.query.courseId}`}>
                <Button type="primary">Login</Button>
              </Link>
            )}
          </Flex>
        </div>

        <h4>Table of Contents</h4>
        <div>
          <div className={styles.chapter_list}>
            <Collapse
              onChange={onChange}
              activeKey={activeCollapseKey}
              size="small"
              accordion={false}
              items={
                items &&
                items.map((item, i) => {
                  return {
                    key: item.key,
                    label: item.label,
                    children: item.children,
                    showArrow: false,
                  };
                })
              }
            />
          </div>
        </div>
      </Space>
    </section>
  );
};

export default Preview;
