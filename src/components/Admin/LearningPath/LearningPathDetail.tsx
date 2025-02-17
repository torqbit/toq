import SvgIcons from "@/components/SvgIcons";
import { themeColors } from "@/services/darkThemeConfig";
import styles from "./LearningPath.module.scss";
import { ILearningCourseDetail, ILearningPreviewDetail } from "@/types/learingPath";
import { Role } from "@prisma/client";
import { Avatar, Button, Flex, Skeleton, Tabs } from "antd";

import { CSSProperties, FC } from "react";
import { useMediaQuery } from "react-responsive";
import { UserOutlined } from "@ant-design/icons";
import Link from "next/link";

const CourseList: FC<{ courses: ILearningCourseDetail[] }> = ({ courses }) => {
  return (
    <Flex vertical gap={20} className={styles.course__list__card}>
      {courses.map((c, i) => {
        return (
          <Flex gap={20} key={i} className={styles.card}>
            {c.banner != null ? (
              <object
                type="image/png"
                data={c.banner}
                className={styles.card__img}
                aria-label={`thumbnail of ${c.title}`}
              >
                <div className={styles.invalid__img}>
                  <i>{SvgIcons.academicCap}</i>
                </div>
              </object>
            ) : (
              <div className={styles.invalid__img}>
                <i>{SvgIcons.academicCap}</i>
              </div>
            )}
            <div>
              <Link href={`/courses/${c.slug}`}>
                {" "}
                <h4 style={{ cursor: "pointer" }}>{c.title}</h4>
              </Link>

              <p>{c.description}</p>
            </div>
          </Flex>
        );
      })}
    </Flex>
  );
};

const LearningPathDetail: FC<{
  loading: boolean;
  detail: ILearningPreviewDetail;
  previewMode: boolean;
  handlePurchase: (pathId: number) => void;
  handleLessonRedirection: (courseId: number) => void;
  paymentCallback?: boolean;
  extraStyle?: CSSProperties;
}> = ({ detail, previewMode, loading, handlePurchase, handleLessonRedirection, paymentCallback, extraStyle }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 435px)" });

  return (
    <section className={styles.preview_container} style={extraStyle}>
      <div style={{ marginBottom: 20 }}>
        <h4>{detail.title}</h4>
        <p>
          A learning path by <strong>{detail.author.name} </strong>, a course instructor at OpenAI
        </p>
      </div>
      <Flex align="flex-start" justify="space-between" vertical={isMobile} gap={20}>
        <div>
          <div className={styles.video_container}>
            <object
              type="image/png"
              data={detail.banner}
              className={styles.video_container}
              aria-label={`banner of ${detail.title}`}
            >
              <Flex align="center" justify="center">
                <Skeleton.Image
                  style={{ width: !isMobile ? 800 : "calc(100vw - 40px)", height: !isMobile ? 450 : "auto" }}
                />
              </Flex>
            </object>
          </div>
          <div>
            <Tabs
              className={styles.course__details}
              tabBarGutter={40}
              items={[
                {
                  key: "1",
                  label: "Overview",
                  children: <div>{detail.description}</div>,
                },
                {
                  key: "2",
                  label: "Courses",
                  children: <CourseList courses={detail.learningPathCourses} />,
                },
              ]}
            />
          </div>
        </div>
        <div className={styles.course__offerings}>
          {/* component for price display */}
          <div className={styles.item__price}>
            {/* Display the price and button for the preview mode */}
            {previewMode && (
              <>
                {detail.price == 0 && (
                  <>
                    <h2>FREE</h2>
                    <Button onClick={() => handlePurchase(detail.id)} type="primary" style={{ width: 200 }}>
                      Enroll for free
                    </Button>
                  </>
                )}
                {detail.price > 0 && (
                  <>
                    <Flex gap={10} align="center" justify="center">
                      <div className={styles.pricing__currency}>{detail.currency}</div>
                      <h2>{detail.price}</h2>
                    </Flex>
                    <Button type="primary" size="large" style={{ width: 200 }}>
                      Buy Now
                    </Button>
                  </>
                )}
              </>
            )}

            {/* Display the price and button for the non-preview mode */}
            {!previewMode && (
              <>
                {detail.role === Role.NOT_ENROLLED && (
                  <>
                    <Flex gap={10} align="center" justify="center">
                      {detail.price > 0 && <div className={styles.pricing__currency}>{detail.price}</div>}
                      <h2>{detail.price == 0 ? "Free" : detail.price}</h2>
                    </Flex>
                    <Button
                      loading={loading}
                      type="primary"
                      size="large"
                      style={{ width: 200 }}
                      onClick={(e) => handlePurchase(detail.id)}
                    >
                      {detail.price == 0 ? "Enroll Now" : "Buy Course"}
                    </Button>
                  </>
                )}
                {(detail.role === Role.ADMIN || detail.role === Role.AUTHOR) && (
                  <>
                    <Flex gap={10} align="center" justify="center">
                      {detail.price > 0 && <div className={styles.pricing__currency}>{detail.currency}</div>}
                      <h2>{detail.price == 0 ? "Free" : detail.price}</h2>
                    </Flex>
                    <Button
                      loading={loading}
                      type="primary"
                      size="large"
                      style={{ width: 200 }}
                      onClick={(e) => handleLessonRedirection(detail.id)}
                    >
                      Start Learning
                    </Button>
                  </>
                )}
                {detail.role === Role.STUDENT && (
                  <>
                    <Flex gap={10} align="center" vertical justify="center">
                      {paymentCallback && paymentCallback && (
                        <>
                          <i style={{ fontSize: "3.5rem", lineHeight: 0, color: themeColors.commons.success }}>
                            {SvgIcons.checkBadgeFilled}
                          </i>
                          <h4>
                            You have successfully <br />
                            purchased this learning path
                          </h4>
                        </>
                      )}
                      {!paymentCallback && (
                        <>
                          <i style={{ fontSize: "3.5rem", lineHeight: 0, color: themeColors.commons.success }}>
                            {SvgIcons.checkBadgeFilled}
                          </i>
                          <h4>You have already purchased this learning path </h4>
                        </>
                      )}
                    </Flex>
                    <Button
                      loading={loading}
                      type="primary"
                      size="large"
                      style={{ width: 200 }}
                      onClick={(e) => handleLessonRedirection(detail.id)}
                    >
                      Start Learning
                    </Button>
                  </>
                )}
              </>
            )}
          </div>

          {/* component for price display */}
          <div className={styles.offering__highlights}>
            <p>
              <b>This learning path includes</b>
            </p>
            <Flex gap={10} align="center">
              <i>{SvgIcons.courses}</i>
              <div>{detail.learningPathCourses.length} courses </div>
            </Flex>
            <Flex gap={10} align="center">
              <i>{SvgIcons.playFilled}</i>
              <div>{detail.contentDurationInHrs} hours of content</div>
            </Flex>
            <Flex gap={10} align="center">
              <i>{SvgIcons.bookOpenFilled}</i>
              <div>{detail.assignmentsCount} assignments</div>
            </Flex>
            <Flex gap={10} align="center">
              <i>{SvgIcons.clockFilled}</i>
              <div>Unlimited access</div>
            </Flex>
            <Flex gap={10} align="center">
              <i>{SvgIcons.checkBadgeFilled}</i>
              <div>Certificate on completion</div>
            </Flex>
            <Flex gap={10} align="center">
              <i>{SvgIcons.calendarDaysFilled}</i>
              <div>Free access to workshops</div>
            </Flex>
          </div>

          <div className={styles.course__author}>
            <p>
              <b>Courses Instructors</b>
            </p>
            <Flex gap={0}>
              {detail.instructors.length > 0 &&
                detail.instructors.map((img, i) => {
                  return (
                    <Avatar
                      key={i}
                      style={{ marginLeft: i !== 0 ? -25 : 0, border: "4px solid var(--bg-segment)" }}
                      size={isMobile ? 40 : 60}
                      src={img}
                      icon={<UserOutlined />}
                      alt="Profile"
                    />
                  );
                })}
            </Flex>
          </div>
        </div>
      </Flex>
    </section>
  );
};

export default LearningPathDetail;
