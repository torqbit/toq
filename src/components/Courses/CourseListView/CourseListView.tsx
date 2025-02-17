import { PageSiteConfig } from "@/services/siteConstant";
import { ICourseListItem } from "@/types/courses/Course";
import { Theme } from "@/types/theme";
import { FC, ReactNode, useEffect, useState } from "react";
import styles from "./CourseListView.module.scss";
import { Button, Card, Flex, Space, Tabs, TabsProps, Tag, Dropdown, MenuProps, Progress, Skeleton } from "antd";
import { Role, StateType } from "@prisma/client";
import { capsToPascalCase, validateImage } from "@/lib/utils";
import { useRouter } from "next/router";
import Link from "next/link";
import SvgIcons from "@/components/SvgIcons";
import { getDummyArray } from "@/lib/dummyData";
import { useMediaQuery } from "react-responsive";
import FallBackImage from "@/templates/standard/components/FallBackImage/FallBackImage";
const { Meta } = Card;
export const CourseViewItem: FC<{ course: ICourseListItem; previewMode?: boolean }> = ({ course, previewMode }) => {
  const router = useRouter();
  const [showDummyPurchase, setDummyBtn] = useState(typeof previewMode !== "undefined" && previewMode);
  const isMobile = useMediaQuery({ query: "(max-width: 435px)" });

  const handleEdit = (id: number) => {
    router.push(`academy/course/${id}/edit`);
  };

  const handleManage = (id: number) => {
    router.push(`academy/course/${id}/manage`);
  };

  const handlePurchase = (slug: string) => {
    router.push(`/courses/${slug}`);
  };

  const items: MenuProps["items"] = [
    {
      label: <Link href={`/courses/${course.slug}`}>View</Link>,
      key: "1",
    },
    {
      label: <Link href={`/academy/course//${course.id}/edit`}>Edit</Link>,
      key: "2",
    },
  ];

  return (
    <Card
      className={styles.course__card}
      cover={
        <FallBackImage
          width={isMobile ? "80vw" : "300px"}
          height={168}
          imageSrc={course.trailerThumbnail}
          ariaLabel={`thumbnail of ${course.title}`}
        />
      }
    >
      <Meta
        className={styles.meta}
        title={
          <>
            <Flex vertical gap={5}>
              <Space>
                <Tag bordered={true} style={{ fontWeight: "normal" }}>
                  {course.difficultyLevel}
                </Tag>
                {course.state === StateType.DRAFT && (
                  <Tag bordered={true} color="warning" style={{ fontWeight: "normal" }}>
                    {capsToPascalCase(StateType.DRAFT)}
                  </Tag>
                )}
              </Space>
            </Flex>

            <h4 style={{ marginTop: 5, marginBottom: 5 }}>{course.title}</h4>
            <p style={{ fontWeight: "normal", marginBottom: 0, fontSize: 14 }}>
              A course by <b>{course.author}</b>
            </p>
          </>
        }
        description={course.description}
      />
      <Flex justify="space-between" align="center" className={styles.card__footer}>
        {course.price > 0 ? (
          <div>
            {course.currency} {course.price}
          </div>
        ) : (
          <div>Free</div>
        )}

        {showDummyPurchase && <Button type="default">Buy Now</Button>}

        {!showDummyPurchase &&
          course.userRole &&
          (course.userRole === Role.AUTHOR || course.userRole === Role.ADMIN) &&
          course.state == StateType.DRAFT && (
            <Button onClick={(e) => handleEdit(course.id)} type="default">
              Edit
            </Button>
          )}
        {!showDummyPurchase &&
          course.userRole &&
          (course.userRole === Role.AUTHOR || course.userRole === Role.ADMIN) &&
          course.state == StateType.ACTIVE && (
            <Dropdown.Button
              type="default"
              trigger={["click"]}
              menu={{ items }}
              onClick={() => handleManage(course.id)}
              style={{ width: "auto" }}
            >
              Manage
            </Dropdown.Button>
          )}
        {!showDummyPurchase && course.userRole && course.userRole === Role.NOT_ENROLLED && (
          <Button type="default" onClick={(e) => handlePurchase(course.slug)}>
            {course.price > 0 ? "Buy Now" : "Enroll Now"}
          </Button>
        )}
        {!showDummyPurchase && course.userRole && course.userRole === Role.STUDENT && (
          <Button type="default" onClick={(e) => handlePurchase(course.slug)}>
            Go to Course
          </Button>
        )}
      </Flex>
    </Card>
  );
};

export const CoursesListView: FC<{
  courses: ICourseListItem[];
  siteConfig: PageSiteConfig;
  currentTheme: Theme;
  handleCourseCreate: () => void;
  emptyView: ReactNode;
  role?: Role;
  loading: boolean;
}> = ({ courses, currentTheme, siteConfig, handleCourseCreate, emptyView, role, loading }) => {
  const [tab, setTab] = useState("1");
  const isMobile = useMediaQuery({ query: "(max-width: 435px)" });

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Courses",
      children: (
        <div className={styles.course__grid}>
          {courses.map((c, index) => (
            <CourseViewItem course={c} key={index} />
          ))}
        </div>
      ),
    },
    {
      key: "2",
      label: "Published Courses",
      children: (
        <div className={styles.course__grid}>
          {courses
            .filter((c) => c.state === StateType.ACTIVE)
            .map((c, index) => (
              <CourseViewItem course={c} key={index} />
            ))}
        </div>
      ),
    },
    {
      key: "3",
      label: `${role == "AUTHOR" ? "Authored Courses" : "All Courses"}`,
      children: (
        <>
          <div className={styles.course__grid}>
            {role == Role.AUTHOR && (
              <>
                {courses
                  .filter((c) => c.userRole && c.userRole === Role.AUTHOR)
                  .map((c, index) => (
                    <CourseViewItem course={c} key={index} />
                  ))}
              </>
            )}
            {role == Role.ADMIN && (
              <>
                {courses.map((c, index) => (
                  <CourseViewItem course={c} key={index} />
                ))}
              </>
            )}
          </div>
        </>
      ),
    },
  ];
  return (
    <div className={styles.courses__list}>
      {loading && (
        <>
          <h4>Courses</h4>
          <div className={styles.course__grid}>
            {getDummyArray(3).map((t, i) => {
              return (
                <Card
                  key={i}
                  className={styles.course__card}
                  cover={
                    <Skeleton.Image style={{ width: isMobile ? "Calc(100vw - 40px)" : "300px", height: "168px" }} />
                  }
                >
                  <Skeleton />
                </Card>
              );
            })}
          </div>
        </>
      )}
      {role && role !== Role.STUDENT && !loading && (
        <>
          <h4>Courses</h4>
          <Tabs
            tabBarGutter={40}
            items={items}
            activeKey={tab}
            onChange={(k) => setTab(k)}
            tabBarExtraContent={
              <Button type="primary" onClick={handleCourseCreate}>
                Add Course
              </Button>
            }
          />
        </>
      )}

      {role && role === Role.STUDENT && !loading && (
        <>
          {isMobile && <h4>Courses</h4>}
          <div className={styles.course__grid}>
            {courses
              .filter((c) => c.state === StateType.ACTIVE)
              .map((c, index) => (
                <CourseViewItem course={c} key={index} />
              ))}
          </div>
        </>
      )}

      {typeof role === "undefined" && courses.length > 0 && !loading && (
        <>
          <div className={styles.course__grid}>
            {courses
              .filter((c) => c.state == StateType.ACTIVE)
              .map((c, index) => (
                <CourseViewItem course={c} key={index} />
              ))}
          </div>
        </>
      )}

      {typeof role === "undefined" && courses.length == 0 && !loading && (
        <Flex justify="center" align="center">
          {emptyView}
        </Flex>
      )}
    </div>
  );
};
