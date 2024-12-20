import SvgIcons from "@/components/SvgIcons";
import { convertSecToHourandMin } from "@/pages/admin/content";
import styles from "@/styles/Marketing/CoursePreview/CoursePreview.module.scss";
import { Button, Collapse, Divider, Flex, Form, Input, Space, Tag, message } from "antd";
import { FC, ReactNode, useEffect, useState } from "react";
import MarketingSvgIcons from "../MarketingSvgIcons";
import { CourseLessons, ICoursePriviewInfo } from "@/types/courses/Course";
import {
  $Enums,
  CourseState,
  CourseType,
  orderStatus,
  ResourceContentType,
  Role,
  StateType,
  User,
} from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import NotificationService from "@/services/NotificationService";
import { useSession } from "next-auth/react";
import { Router, useRouter } from "next/router";

const Label: FC<{
  title: string;
  time: string;
  keyValue: string;
  resourceId?: number;
  isCompleted?: boolean;
  icon: ReactNode;
  contentType?: ResourceContentType;
}> = ({ title, time, keyValue, icon, isCompleted, resourceId, contentType }) => {
  return (
    <div className={styles.labelContainer}>
      <Flex justify="space-between" align="center">
        <div>
          <Flex gap={10} align="center">
            {isCompleted ? SvgIcons.check : icon}
            <div>{title}</div>
          </Flex>
        </div>
        <div>{<Tag className={styles.time_tag}>{time}</Tag>}</div>
      </Flex>
    </div>
  );
};
const CoursePreview: FC<{
  user?: User;
  courseId: number;
  nextLessonId?: number;
  courseDetails: ICoursePriviewInfo;
  chapters: CourseLessons[];
  paymentDisable: boolean;
  loading?: boolean;
  paymentStatus?: orderStatus;
  onEnrollCourse: () => void;
  userRole?: Role;
}> = ({
  user,
  courseId,
  courseDetails,
  nextLessonId,
  chapters,
  loading,
  paymentDisable,
  paymentStatus,
  userRole,
  onEnrollCourse,
}) => {
  const { data: session, status } = useSession();
  const [notificationLoading, setNotificationLoading] = useState<boolean>(false);
  const [isNotified, setNotified] = useState<boolean>(false);
  const [form] = Form.useForm();
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const courseListDetail = {
    course: {
      name: courseDetails.name,
      description: courseDetails.description,
      courseTrailer: courseDetails.courseTrailer,
      difficulty: courseDetails.difficultyLevel,
    },

    chapters: chapters.map((chapter) => {
      return {
        chapterSeq: chapter.chapterSeq,
        chapterName: chapter.chapterName,

        lessons: chapter.lessons.map((r) => {
          return {
            title: r.title,
            videoDuration:
              r.contentType === ResourceContentType.Assignment ? Number(r.estimatedDuration) * 60 : r.videoDuration,
            lessonId: r.lessonId,
            contentType: r.contentType,
          };
        }),
      };
    }),
  };

  const items = courseListDetail.chapters.map((content, i) => {
    let totalTime = 0;
    content.lessons.forEach((data) => {
      if (data.videoDuration) {
        totalTime = totalTime + data.videoDuration;
      }
    });
    const duration = convertSecToHourandMin(totalTime);
    return {
      key: `${i + 1}`,
      label: <Label title={content.chapterName} icon={SvgIcons.folder} time={duration} keyValue={`${i + 1}`} />,
      children: content.lessons.map((res: any, i: any) => {
        const duration = convertSecToHourandMin(res.videoDuration);
        return (
          <div className={styles.resContainer}>
            <Label
              title={res.title}
              icon={res.contentType === $Enums.ResourceContentType.Video ? SvgIcons.playBtn : SvgIcons.file}
              time={duration}
              isCompleted={res.isWatched}
              resourceId={res.videoId}
              keyValue={`${i + 1}`}
              contentType={res.contentType}
            />
          </div>
        );
      }),
      showArrow: false,
    };
  });
  const [activeCollapseKey, setActiveCollapseKey] = useState<string[]>(items ? items.map((item, i) => `${i + 1}`) : []);
  let duration: number = 0;

  chapters.forEach((chapter) => {
    chapter.lessons.forEach((r) => {
      duration =
        r.contentType === ResourceContentType.Assignment
          ? duration + Number(r.estimatedDuration) * 60
          : duration + r.videoDuration;
    });
  });

  const totalDuration = convertSecToHourandMin(duration);

  const courseFeatures = courseDetails && [
    {
      icon: MarketingSvgIcons.info,
      label: courseDetails.courseState === "ACTIVE" ? "Available for all" : "Launching soon ",
    },
    {
      icon: MarketingSvgIcons.courseLevel,
      label: courseDetails.difficultyLevel,
    },
    {
      icon: MarketingSvgIcons.megaPhone,
      label: "English",
    },

    {
      icon: MarketingSvgIcons.clock,
      label: courseDetails.courseState === "ACTIVE" ? totalDuration : "N/A",
    },
    {
      icon: MarketingSvgIcons.certificate,
      label: "Certificate on course completion",
    },
  ];

  const previewCourseFeatures = courseDetails && [
    {
      icon: MarketingSvgIcons.info,
      label: courseDetails.courseState === "ACTIVE" ? "Available for all" : "Launching soon ",
    },
    {
      icon: MarketingSvgIcons.courseLevel,
      label: courseDetails.difficultyLevel,
    },
    {
      icon: MarketingSvgIcons.megaPhone,
      label: "English",
    },

    {
      icon: MarketingSvgIcons.clock,
      label: courseDetails.courseState === "ACTIVE" ? `${totalDuration} of content` : "N/A",
    },
  ];

  const onCreateNotification = (isEmailVerified: boolean, email: string) => {
    setNotificationLoading(true);
    NotificationService.createCourseNotification(
      courseId,
      email,
      isEmailVerified,
      (result) => {
        message.success(result.message);
        setNotified(true);
        setEmail("");
        setNotificationLoading(false);
      },
      (error) => {
        message.success(error);
        setNotificationLoading(false);
      }
    );
  };

  const onChange = (key: string | string[]) => {
    setActiveCollapseKey(key as string[]);
  };

  useEffect(() => {
    if (user) {
      NotificationService.checkCourseNotifications(
        courseId,
        (result) => {
          setNotified(result.mailSent);
          setNotificationLoading(false);
        },
        (error) => {
          setNotificationLoading(false);
        }
      );
    }
  }, [user]);

  const showFeatures = courseDetails.previewMode ? previewCourseFeatures : courseFeatures;

  return (
    <section
      className={`${styles.coursePreview} ${
        userRole ? styles.logged__in__coursePreview : styles.logged__out__coursePreview
      }`}
    >
      <div className={styles.coursePreviewContainer}>
        <div className={styles.courseInfoWrapper}>
          <Space direction="vertical">
            <div>
              <div className={styles.descriptionWrapper}>
                <h2>Description</h2>
                <p>{courseDetails.description}</p>
              </div>
            </div>
            {chapters.length > 0 && (
              <div className={styles.chapter_list}>
                <h1>Chapters</h1>

                <Collapse
                  onChange={onChange}
                  activeKey={activeCollapseKey}
                  size="small"
                  defaultActiveKey={activeCollapseKey}
                  accordion={false}
                  items={
                    items &&
                    items.map((item) => {
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
            )}
          </Space>

          <div>
            <div className={styles.courseEnrollmentCard}>
              <div className={styles.cardWrapper}>
                <Image src={courseDetails.thumbnail} height={375} width={375} alt="" loading="lazy" />
                <div className={styles.cardDetail}>
                  <div>
                    <Flex align="center" justify="space-between">
                      <span>Details</span>
                      {courseDetails.previewMode ? (
                        "Free to preview"
                      ) : (
                        <>
                          {courseDetails.courseType === CourseType.PAID ? (
                            <Flex align="center" gap={5}>
                              {SvgIcons.rupees} <span>{courseDetails.coursePrice}</span>
                            </Flex>
                          ) : (
                            "Free"
                          )}
                        </>
                      )}
                    </Flex>
                  </div>
                  <div>
                    {showFeatures &&
                      showFeatures.length > 0 &&
                      showFeatures.map((c, i) => {
                        return (
                          <Flex key={i} align="center" gap={10}>
                            <i>{c.icon}</i>
                            <div>{c.label}</div>
                          </Flex>
                        );
                      })}
                  </div>
                </div>
                <Divider />
                {courseDetails.courseState === StateType.ACTIVE ? (
                  <>
                    {(courseDetails.userRole === Role.ADMIN || courseDetails.userRole === Role.AUTHOR) &&
                      status === "authenticated" && (
                        <Link
                          className={styles.buttonWrapper}
                          href={`/courses/${router.query.slug}/lesson/${nextLessonId}`}
                        >
                          <Button type="primary">View Course</Button>
                        </Link>
                      )}
                    {courseDetails.userRole === Role.STUDENT && status === "authenticated" && (
                      <>
                        {courseDetails.userStatus === CourseState.COMPLETED ? (
                          <Link
                            className={styles.buttonWrapper}
                            href={`/courses/${router.query.slug}/lesson/${nextLessonId}`}
                          >
                            <Button type="primary">Rewatch</Button>
                          </Link>
                        ) : (
                          <>
                            {courseDetails.progress > 0 ? (
                              <Link
                                className={styles.buttonWrapper}
                                href={`/courses/${router.query.slug}/lesson/${nextLessonId}`}
                              >
                                <Button type="primary">Resume</Button>
                              </Link>
                            ) : (
                              <Link
                                className={styles.buttonWrapper}
                                href={`/courses/${router.query.slug}/lesson/${nextLessonId}`}
                              >
                                <Button type="primary">Start Course</Button>
                              </Link>
                            )}
                          </>
                        )}
                      </>
                    )}

                    {courseDetails.userRole === "NOT_ENROLLED" && status === "authenticated" && (
                      <div className={styles.buttonWrapper}>
                        {courseDetails.courseType === CourseType.PAID ? (
                          <Button
                            loading={loading}
                            className={styles.save_btn}
                            disabled={paymentDisable}
                            type="primary"
                            onClick={onEnrollCourse}
                          >
                            {paymentDisable ? (
                              "Payment  in Progress"
                            ) : (
                              <>
                                {paymentStatus === orderStatus.PENDING ? (
                                  "Complete the payment"
                                ) : (
                                  <>
                                    {courseDetails.courseType === CourseType.PAID && (
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
                          <Button loading={loading} className={styles.save_btn} type="primary" onClick={onEnrollCourse}>
                            <Flex align="center" gap={10}>
                              {courseDetails.previewMode ? " Preview Course" : " Enroll Course"}
                              {SvgIcons.arrowRight}
                            </Flex>
                          </Button>
                        )}
                      </div>
                    )}
                    {(courseDetails.userRole === Role.NA || status === "unauthenticated") && (
                      <Link href={`/login?redirect=courses/${router.query.slug}`} className={styles.buttonWrapper}>
                        <Button type="primary">Login to Continue</Button>
                      </Link>
                    )}
                  </>
                ) : (
                  <Form
                    form={form}
                    onFinish={() => {
                      user ? onCreateNotification(true, String(user.email)) : onCreateNotification(false, email);
                    }}
                  >
                    <Flex vertical className={styles.buttonWrapper} gap={10}>
                      {!user && (
                        <Form.Item name={"email"} noStyle rules={[{ required: true, message: "Enter your email" }]}>
                          <Input
                            type="email"
                            placeholder="Enter your email"
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </Form.Item>
                      )}
                      <Button loading={notificationLoading} disabled={isNotified} htmlType="submit" type="primary">
                        Notify on launch
                      </Button>
                    </Flex>
                  </Form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoursePreview;
