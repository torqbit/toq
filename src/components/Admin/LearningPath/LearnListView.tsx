import { PageSiteConfig } from "@/services/siteConstant";
import { Theme } from "@/types/theme";
import { FC, ReactNode, useEffect, useState } from "react";
import styles from "@/components/Courses/CourseListView/CourseListView.module.scss";
import {
  Button,
  Card,
  Flex,
  Space,
  Tabs,
  TabsProps,
  Tag,
  Dropdown,
  MenuProps,
  Progress,
  Skeleton,
  Segmented,
  message,
  Spin,
} from "antd";
import { CourseType, Role, StateType } from "@prisma/client";
import { capsToPascalCase, validateImage } from "@/lib/utils";
import { useRouter } from "next/router";
import Link from "next/link";
import SvgIcons from "@/components/SvgIcons";
import { getDummyArray } from "@/lib/dummyData";
import { useMediaQuery } from "react-responsive";
import { ILearningPathDetail } from "@/types/learingPath";
import { ICourseListItem } from "@/types/courses/Course";
import { CourseViewItem } from "@/components/Courses/CourseListView/CourseListView";
import ProgramService from "@/services/ProgramService";
import { LoadingOutlined } from "@ant-design/icons";
import FallBackImage from "@/templates/standard/components/FallBackImage/FallBackImage";
import { EnrolledCourseProgressList } from "@/components/Dashboard/StudentDashboard";
import LearningPathSerivices from "@/services/learningPath/LearningPathSerivices";
const { Meta } = Card;
export const LearnViewItem: FC<{ learning: ILearningPathDetail; previewMode?: boolean; userRole?: Role }> = ({
  learning,
  previewMode,
  userRole,
}) => {
  const isMobile = useMediaQuery({ query: "(max-width: 435px)" });

  const router = useRouter();
  const [showDummyPurchase, setDummyBtn] = useState(typeof previewMode !== "undefined" && previewMode);

  const handleEdit = (id: number) => {
    router.push(`admin/content/path/${id}/edit`);
  };

  const handlePurchase = (slug: string) => {
    router.push(`/path/${slug}`);
  };

  const items: MenuProps["items"] = [
    {
      label: <Link href={`/path/${learning.slug}`}>View</Link>,
      key: "1",
    },
  ];

  return (
    <Card
      className={styles.course__card}
      cover={
        <FallBackImage
          width={isMobile ? "80vw" : "300px"}
          height={168}
          imageSrc={learning.banner}
          ariaLabel={`thumbnail of ${learning.title}`}
        />
      }
    >
      <Meta
        className={styles.meta}
        title={
          <>
            <Flex align="center" justify="space-between" gap={5}>
              <Tag bordered={true} style={{ fontWeight: "normal" }}>
                {learning.learningPathCourses.length} courses
              </Tag>
              {learning.state === StateType.DRAFT && (
                <Tag bordered={true} color="warning" style={{ fontWeight: "normal" }}>
                  {capsToPascalCase(StateType.DRAFT)}
                </Tag>
              )}
            </Flex>

            <h4 style={{ marginTop: 5, marginBottom: 5 }}>{learning.title}</h4>
            <p style={{ fontWeight: "normal", marginBottom: 0, fontSize: 14 }}>
              A learning path by <b>{learning.author.name}</b>
            </p>
          </>
        }
        description={learning.description}
      />
      <Flex justify="space-between" align="center" className={styles.card__footer}>
        <div>{learning.price > 0 ? CourseType.PAID : CourseType.FREE}</div>

        {!showDummyPurchase &&
          userRole &&
          (userRole === Role.AUTHOR || userRole === Role.ADMIN) &&
          learning.state == StateType.DRAFT && (
            <Button onClick={(e) => handleEdit(learning.id)} type="default">
              Edit
            </Button>
          )}
        {!showDummyPurchase &&
          userRole &&
          (userRole === Role.AUTHOR || userRole === Role.ADMIN) &&
          learning.state == StateType.ACTIVE && (
            <Dropdown.Button
              type="default"
              trigger={["click"]}
              menu={{ items }}
              onClick={() => handleEdit(learning.id)}
              style={{ width: "auto" }}
            >
              Edit
            </Dropdown.Button>
          )}
        {!showDummyPurchase && userRole && userRole === Role.NOT_ENROLLED && (
          <Button type="default" onClick={(e) => handlePurchase(learning.slug)}>
            {learning.price > 0 ? "Buy Now" : "Enroll Now"}
          </Button>
        )}
        {!showDummyPurchase && userRole && userRole === Role.STUDENT && (
          <Button type="default" onClick={(e) => handlePurchase(learning.slug)}>
            Go to Learning
          </Button>
        )}
        {!showDummyPurchase && !userRole && (
          <Button type="default" onClick={(e) => handlePurchase(learning.slug)}>
            {learning.price > 0 ? "Buy Now" : "Enroll Now"}
          </Button>
        )}
      </Flex>
    </Card>
  );
};

export const AcademyItemsListView: FC<{
  pathList: ILearningPathDetail[];
  loadingCourses: boolean;
  courses: ICourseListItem[];
  getPathList: () => void;
  siteConfig: PageSiteConfig;
  handleItemsList: (key: string) => void;
  currentTheme: Theme;
  emptyView: ReactNode;
  role?: Role;
  loading: boolean;
}> = ({
  pathList,
  currentTheme,
  siteConfig,
  loadingCourses,
  handleItemsList,
  getPathList,
  emptyView,
  role,
  loading,
  courses,
}) => {
  const [messageApi, contextMessageHolder] = message.useMessage();
  const [tab, setTab] = useState("courses");
  const [segmentValue, setSegmentValue] = useState<string>("all");

  const [pageLoading, setPageLoading] = useState<boolean>(false);

  const [allRegisterCourse, setAllRegisterCourse] =
    useState<{ courseName: string; progress: string; courseId: number; slug: string }[]>();

  const router = useRouter();
  const isMobile = useMediaQuery({ query: "(max-width: 435px)" });
  const handleLearningCreate = () => {
    return router.push("/admin/content/path/add");
  };
  const onChangeTab = (k: string) => {
    switch (k) {
      case "courses":
        setTab(k);
        setSegmentValue("all");
        return handleItemsList(k);
      case "learning":
        setTab(k);
        setSegmentValue("all");
        return handleItemsList(k);

      default:
        return handleItemsList(k);
    }
  };

  const getEnrolledLearning = () => {
    LearningPathSerivices.getEnrolledList(
      (result) => {},
      (error) => {}
    );
  };
  useEffect(() => {
    getEnrolledLearning();
  }, []);

  const studentTabItems: TabsProps["items"] = [
    {
      key: "1",
      label: "My Learnings",
      className: "some-class",
      icon: <i style={{ fontSize: 18, color: "var(--font-primary)" }}>{SvgIcons.courses}</i>,
      children:
        !pageLoading && allRegisterCourse ? (
          <EnrolledCourseProgressList courseData={allRegisterCourse} />
        ) : (
          <Flex gap={5} vertical>
            {getDummyArray(5).map((t) => {
              return <Skeleton.Input style={{ width: "100%" }} />;
            })}
          </Flex>
        ),
    },
  ];

  const items: TabsProps["items"] = [
    {
      key: "courses",
      label: "Courses",
      children: (
        <Spin spinning={loadingCourses || !courses} indicator={<LoadingOutlined spin />} size="large">
          {typeof role == "undefined" && courses && courses.length > 0 && (
            <div className={styles.course__grid}>
              {courses
                .filter((c) => c.state === StateType.ACTIVE)
                .map((c, index) => (
                  <CourseViewItem course={c} key={index} />
                ))}
            </div>
          )}

          {role && courses && courses.length > 0 && (
            <Flex vertical gap={10}>
              {role && role !== Role.STUDENT && (
                <Segmented
                  style={{ width: "fit-content" }}
                  onChange={setSegmentValue}
                  options={[
                    { value: "all", label: "All" },
                    { value: StateType.ACTIVE, label: "Published" },
                  ]}
                />
              )}
              <>
                {role && role !== Role.STUDENT && segmentValue === "all" ? (
                  <div className={styles.course__grid}>
                    {courses.map((c, index) => (
                      <CourseViewItem course={c} key={index} />
                    ))}
                  </div>
                ) : (
                  <div className={styles.course__grid}>
                    {courses
                      .filter((c) => c.state === StateType.ACTIVE)
                      .map((c, index) => (
                        <CourseViewItem course={c} key={index} />
                      ))}
                  </div>
                )}
              </>
            </Flex>
          )}

          {loadingCourses && courses.length == 0 && (
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
          )}
          {courses && courses.length == 0 && !loadingCourses && (
            <Flex justify="center" align="center">
              {emptyView}
            </Flex>
          )}
        </Spin>
      ),
    },
    {
      key: "learning",
      label: "Learning Paths",
      children: (
        <Spin spinning={loading} indicator={<LoadingOutlined spin />} size="large">
          {typeof role == "undefined" && pathList.length > 0 && (
            <div className={styles.course__grid}>
              {pathList
                .filter((p) => p.state === StateType.ACTIVE)
                .map((path, index) => (
                  <LearnViewItem userRole={role} learning={path} key={index} />
                ))}
            </div>
          )}
          {role && pathList.length > 0 && (
            <Flex vertical gap={10}>
              {role && role !== Role.STUDENT && (
                <Segmented
                  style={{ width: "fit-content" }}
                  onChange={setSegmentValue}
                  options={[
                    { value: "all", label: "All" },
                    { value: StateType.ACTIVE, label: "Published" },
                  ]}
                />
              )}
              <>
                {role && role !== Role.STUDENT && segmentValue === "all" ? (
                  <div className={styles.course__grid}>
                    {pathList.map((path, index) => (
                      <LearnViewItem userRole={path.role} learning={path} key={index} />
                    ))}
                  </div>
                ) : (
                  <div className={styles.course__grid}>
                    {pathList
                      .filter((p) => p.state === StateType.ACTIVE)
                      .map((path, index) => (
                        <LearnViewItem userRole={path.role} learning={path} key={index} />
                      ))}
                  </div>
                )}
              </>
            </Flex>
          )}

          {loading && pathList.length == 0 && (
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
          )}
          {(!pathList || pathList.length == 0) && !loading && (
            <Flex justify="center" align="center">
              {emptyView}
            </Flex>
          )}
        </Spin>
      ),
    },
  ];

  const addCourse = () => {
    ProgramService.createDraftCourses(
      undefined,
      (result) => {
        messageApi.success(result.message);
        router.push(`/admin/content/course/${result.getCourse.courseId}/edit`);
      },
      (error) => {
        messageApi.error(error);
      }
    );
  };
  return (
    <div className={styles.courses__list}>
      {contextMessageHolder}

      <>
        <h4>Academy</h4>

        <Tabs
          tabBarGutter={40}
          items={role === Role.STUDENT ? studentTabItems.concat(items) : items}
          activeKey={tab}
          onChange={onChangeTab}
          tabBarExtraContent={
            <>
              {role && role !== Role.STUDENT && (
                <>
                  {tab == "learning" &&
                    courses.filter((c) => c.state == StateType.ACTIVE && c.price == 0).length > 2 && (
                      <Button type="primary" onClick={handleLearningCreate}>
                        Add Learning Path
                      </Button>
                    )}

                  {tab === "courses" && (
                    <Button type="primary" onClick={addCourse}>
                      Add Courses
                    </Button>
                  )}
                </>
              )}
            </>
          }
        />
      </>
    </div>
  );
};
