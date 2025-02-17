import SvgIcons from "@/components/SvgIcons";
import { themeColors } from "@/services/darkThemeConfig";
import styles from "@/styles/Preview.module.scss";
import { IChapterView, ICourseDetailView } from "@/types/courses/Course";
import { LoadingOutlined, UserOutlined } from "@ant-design/icons";
import { ResourceContentType, Role } from "@prisma/client";
import { Avatar, Button, Collapse, CollapseProps, Flex, Spin, Tabs } from "antd";
import { useRouter } from "next/router";

import { CSSProperties, FC } from "react";
import { useMediaQuery } from "react-responsive";

const CurriculumList: FC<{ chapters: IChapterView[] }> = ({ chapters }) => {
  const collapsibleItems: CollapseProps["items"] = chapters.map((c, index) => {
    const lessonItems = c.lessons.map((l) => {
      return (
        <div>
          <Flex gap={10} align="center" style={{ marginLeft: 10, marginBottom: 10 }}>
            <>
              {l.lessonType === ResourceContentType.Assignment && <i>{SvgIcons.bookOpenFilled}</i>}
              {l.lessonType === ResourceContentType.Video && <i>{SvgIcons.playFilled}</i>}
              <p>{l.name}</p>
            </>
          </Flex>
        </div>
      );
    });

    return {
      key: index,
      label: c.name,
      children: lessonItems,
    };
  });

  return <Collapse className={styles.curriculum} bordered={true} accordion items={collapsibleItems} />;
};

const Preview: FC<{
  courseDetail: ICourseDetailView;
  previewMode: boolean;
  handlePurchase: (courseId: number) => void;
  handleLessonRedirection: (courseId: number) => void;
  paymentCallback?: boolean;
  extraStyle?: CSSProperties;
  loading?: boolean;
}> = ({ courseDetail, previewMode, handlePurchase, handleLessonRedirection, paymentCallback, extraStyle, loading }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 435px)" });
  const router = useRouter();
  return (
    <section className={styles.preview_container} style={extraStyle}>
      <h4>{courseDetail.name}</h4>
      <p>
        A course by {courseDetail.author.name}, {courseDetail.author.designation}
      </p>
      <Flex align="flex-start" justify="flex-start" vertical={isMobile} gap={20}>
        <div>
          <div className={styles.video_container}>
            <Flex style={{ height: "100%", width: "100%", position: "absolute" }} align="center" justify="center">
              <Spin indicator={<LoadingOutlined spin />} size="large" />
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
                src={courseDetail.trailerEmbedUrl}
              ></iframe>
            }
          </div>
          <div>
            <Tabs
              className={styles.course__details}
              tabBarGutter={40}
              tabBarExtraContent={
                <>
                  {courseDetail.certificateId && (
                    <Button
                      onClick={() =>
                        router.push(`/courses/${router.query.slug}/certificate/${courseDetail?.certificateId}`)
                      }
                      type="primary"
                    >
                      View Certitificate
                    </Button>
                  )}
                </>
              }
              items={[
                {
                  key: "1",
                  label: "Overview",
                  children: <div>{courseDetail.description}</div>,
                },
                {
                  key: "2",
                  label: "Curriculum",
                  children: <CurriculumList chapters={courseDetail.chapters} />,
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
                {courseDetail.pricing.amount == 0 && (
                  <>
                    <h2>FREE</h2>
                    <Button type="primary" style={{ width: 200 }}>
                      Enroll for free
                    </Button>
                  </>
                )}
                {courseDetail.pricing.amount > 0 && (
                  <>
                    <Flex gap={10} align="center" justify="center">
                      <div className={styles.pricing__currency}>{courseDetail.pricing.currency}</div>
                      <h2>{courseDetail.pricing.amount}</h2>
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
                {courseDetail.role === Role.NOT_ENROLLED && (
                  <>
                    <Flex gap={10} align="center" justify="center">
                      {courseDetail.pricing.amount > 0 && (
                        <div className={styles.pricing__currency}>{courseDetail.pricing.currency}</div>
                      )}
                      <h2>{courseDetail.pricing.amount == 0 ? "Free" : courseDetail.pricing.amount}</h2>
                    </Flex>
                    <Button
                      loading={loading}
                      type="primary"
                      size="large"
                      style={{ width: 200 }}
                      onClick={(e) => handlePurchase(courseDetail.id)}
                    >
                      {courseDetail.pricing.amount == 0 ? "Enroll Now" : "Buy Course"}
                    </Button>
                  </>
                )}
                {(courseDetail.role === Role.ADMIN || courseDetail.role === Role.AUTHOR) && (
                  <>
                    <Flex gap={10} align="center" justify="center">
                      {courseDetail.pricing.amount > 0 && (
                        <div className={styles.pricing__currency}>{courseDetail.pricing.currency}</div>
                      )}
                      <h2>{courseDetail.pricing.amount == 0 ? "Free" : courseDetail.pricing.amount}</h2>
                    </Flex>
                    <Button
                      loading={loading}
                      type="primary"
                      size="large"
                      style={{ width: 200 }}
                      onClick={(e) => handleLessonRedirection(courseDetail.id)}
                    >
                      Go to Course
                    </Button>
                  </>
                )}
                {courseDetail.role === Role.STUDENT && (
                  <>
                    <Flex gap={10} align="center" vertical justify="center">
                      {paymentCallback && paymentCallback && (
                        <>
                          <i style={{ fontSize: "3.5rem", lineHeight: 0, color: themeColors.commons.success }}>
                            {SvgIcons.checkBadgeFilled}
                          </i>
                          <h4>
                            You have successfully <br />
                            purchased this course
                          </h4>
                        </>
                      )}
                      {!paymentCallback && (
                        <>
                          <i style={{ fontSize: "3.5rem", lineHeight: 0, color: themeColors.commons.success }}>
                            {SvgIcons.checkBadgeFilled}
                          </i>
                          <h4>You have already purchased this course on {courseDetail.enrolmentDate}</h4>
                        </>
                      )}
                    </Flex>
                    <Button
                      type="primary"
                      loading={loading}
                      size="large"
                      style={{ width: 200 }}
                      onClick={(e) => handleLessonRedirection(courseDetail.id)}
                    >
                      Go to Course
                    </Button>
                  </>
                )}
              </>
            )}
          </div>

          {/* component for price display */}
          <div className={styles.offering__highlights}>
            <p>
              <b>This course includes</b>
            </p>
            <Flex gap={10} align="center">
              <i>{SvgIcons.playFilled}</i>
              <div>{courseDetail.contentDurationInHrs} hours of content</div>
            </Flex>
            <Flex gap={10} align="center">
              <i>{SvgIcons.bookOpenFilled}</i>
              <div>{courseDetail.assignmentsCount} assignments</div>
            </Flex>
            <Flex gap={10} align="center">
              <i>{SvgIcons.clockFilled}</i>
              {courseDetail.remainingDays ? (
                <>
                  {courseDetail.role === Role.STUDENT && (
                    <div>{courseDetail.remainingDays} days of access remaining</div>
                  )}
                  {courseDetail.role !== Role.STUDENT && <div>{courseDetail.expiryInDays} days of access</div>}
                </>
              ) : (
                <>Life time access</>
              )}
            </Flex>
            <Flex gap={10} align="center">
              <i>{SvgIcons.checkBadgeFilled}</i>
              <div>Certificate on completion</div>
            </Flex>
            <Flex gap={10} align="center">
              <i>{SvgIcons.calendarDaysFilled}</i>
              <div>Free access to workshops</div>
            </Flex>
            <Flex gap={10} align="center">
              <i>{SvgIcons.chatBubbleFilled}</i>
              <div>Access to Discussion</div>
            </Flex>
          </div>

          <div className={styles.course__author}>
            <p>
              <b>About Instructor</b>
            </p>
            <Flex gap={10}>
              <Avatar size={60} src={courseDetail.author.imageUrl} icon={<UserOutlined />} alt="Profile" />
              <div>
                <h4>{courseDetail.author.name}</h4>
                <p>{courseDetail.author.designation}</p>
              </div>
            </Flex>
          </div>
        </div>
      </Flex>
    </section>
  );
};

export default Preview;
